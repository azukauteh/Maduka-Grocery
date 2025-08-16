
import os
import json
import requests
import logging
from github import Github
from openai import OpenAI  # pyright: ignore[reportMissingImports]


logging.basicConfig(
    filename="ai_review.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# -------------------
# Utility Functions
# -------------------


def split_diff_by_file(diff_text: str):
    """Split GitHub PR diff text by file."""
    files = {}
    current_file = None
    lines = diff_text.splitlines()

    for line in lines:
        if line.startswith("diff --git"):
            parts = line.split(" b/")
            if len(parts) > 1:
                current_file = parts[1]
                files[current_file] = []
        elif current_file:
            files[current_file].append(line)

    return files


def get_pr_diff(pr, token: str) -> str:
    """Fetch the diff for a pull request."""
    diff_url = pr.patch_url
    diff_response = requests.get(
        diff_url,
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3.diff",
        },
    )
    if diff_response.status_code != 200:
        logging.error(f"Failed to fetch diff: {diff_response.text}")
        raise Exception("Failed to fetch PR diff")
    return diff_response.text


def review_diff(diff_text: str, client: OpenAI):
    """Send the diff to OpenAI for review."""
    if not diff_text:
        logging.warning("No diff provided for review.")
        return []

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior software engineer reviewing a pull"
                    "request diff. "
                    "Return feedback in valid JSON format only."
                ),
            },
            {"role": "user", "content": diff_text},
        ],
    )
    feedback = response.choices[0].message.content.strip()
    logging.info(f"AI Response: {feedback}")

    try:
        review_comments = json.loads(feedback)
        if not isinstance(review_comments, list):
            raise ValueError("AI response is not a list")
        return review_comments
    except (json.JSONDecodeError, ValueError) as e:
        logging.error(f"Invalid JSON from AI: {e}")
        raise Exception("Invalid AI response")
