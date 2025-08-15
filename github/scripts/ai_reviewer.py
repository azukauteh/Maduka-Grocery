import os
import json
import requests
from github import Github
from openai import OpenAI
import logging

# Set up logginglogging.basicConfig(filename='ai_review.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Environment variables
GITHUB_TOKEN = os.getenv("")
OPENAI_API_KEY = os.getenv("")
REPO_NAME = os.getenv("")
PR_NUMBER = os.getenv("x")

# Validate environment variables
if not all([GITHUB_TOKEN, OPENAI_API_KEY, REPO_NAME, PR_NUMBER]):
    logging.error("Missing required environment variables")
    raise Exception("Missing environment variables: GITHUB_TOKEN, OPENAI_API_KEY, GITHUB_REPOSITORY, or PR_NUMBER")

# Initialize clients
try:
    client = OpenAI(api_key=OPENAI_API_KEY)
except Exception as e:
    logging.error(f"Failed to initialize OpenAI client: {e}")
    raise

try:
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)
    pr = repo.get_pull(int(PR_NUMBER))
except Exception as e:
    logging.error(f"Failed to initialize GitHub client or fetch PR: {e}")
    raise

# Get PR diff
try:
    diff_url = pr.patch_url
    diff_response = requests.get(diff_url, headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3.diff"})
    if diff_response.status_code != 200:
        logging.error(f"Failed to fetch diff: {diff_response.text}")
        raise Exception("Failed to fetch PR diff")
    diff_text = diff_response.text
except Exception as e:
    logging.error(f"Error fetching diff: {e}")
    raise

# Warn if diff is too large (rough estimate: 4 chars/token)
if len(diff_text) > 100000:
    logging.warning("Large diff detected—analysis may be truncated.")

# AI review request
try:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior software engineer reviewing a pull request diff for a Node.js/Express application. "
                    "The diff is in GitHub patch format. Parse hunks (@@ -old_start,old_count +new_start,new_count @@) to determine absolute line numbers:\n"
                    "- For + lines (additions/context), use side='RIGHT', line = new_start + (offset in hunk - 1).\n"
                    "- For - lines (deletions), use side='LEFT', line = old_start + (offset in hunk - 1).\n"
                    "- Ignore unchanged lines unless critical.\n\n"
                    "Give feedback ONLY on:\n"
                    "- Potential bugs or logic errors (e.g., missing await in async functions, improper error handling)\n"
                    "- Security vulnerabilities (e.g., insecure CORS, exposed secrets)\n"
                    "- Performance optimizations (e.g., redundant middleware, inefficient queries)\n"
                    "- Major deviations from Node.js/Express best practices (e.g., middleware order, REST conventions)\n\n"
                    "If nothing is wrong, return an empty JSON array []. "
                    "Format all output as valid JSON: "
                    "[{'file':'path/to/file','line':absolute_line_number,'side':'LEFT' or 'RIGHT','comment':'Your feedback here'}].\n"
                    "Do not include any other text."
                )
            },
            {"role": "user", "content": diff_text}
        ]
    )
    feedback = response.choices[0].message.content.strip()
    logging.info(f"AI Response: {feedback}")
except Exception as e:
    logging.error(f"OpenAI API error: {e}")
    pr.create_review(
        body="⚠️ AI review failed due to API error. Manual review recommended.",
        event="REQUEST_CHANGES"
    )
    raise

# Parse feedback as JSON
try:
    review_comments = json.loads(feedback)
    if not isinstance(review_comments, list):
        raise ValueError("AI response is not a list")
except (json.JSONDecodeError, ValueError) as e:
    logging.error(f"Invalid JSON from AI: {e}")
    pr.create_review(
        body="⚠️ AI review failed due to invalid response format. Manual review recommended.",
        event="REQUEST_CHANGES"
    )
    raise Exception("Invalid AI response")

# Post review to GitHub
if not review_comments:
    try:
        pr.create_review(
            body="✅ LGTM — No major issues found. Auto-approving.",
            event="APPROVE"
        )
        logging.info("PR approved.")
    except Exception as e:
        logging.error(f"Failed to approve PR: {e}")
        raise
else:
    try:
        for comment in review_comments:
            side = comment.get("side", "RIGHT")  # Default to RIGHT
            pr.create_review_comment(
                body=comment["comment"],
                commit_id=pr.head.sha,
                path=comment["file"],
                line=comment["line"],
                side=side
            )
        pr.create_review(
            body="⚠️ Issues found. Please review the inline comments.",
            event="REQUEST_CHANGES"
        )
        logging.info("Changes requested with comments.")
    except Exception as e:
        logging.error(f"Failed to post comments: {e}")
        raise
