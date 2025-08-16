import os
from git_utils.ai_reviewer import get_pr_diff, review_diff
from github import Github
from openai import OpenAI  # pyright: ignore[reportMissingImports]

""" GitHub setup"""
gh_token = os.environ["GITHUB_TOKEN"]
gh = Github(gh_token)
repo = gh.get_repo(os.environ["GITHUB_REPOSITORY"])
pr_number = int(os.environ["PR_NUMBER"])
pr = repo.get_pull(pr_number)

""" Get PR diff"""
diff = get_pr_diff(pr, gh_token)

""" OpenAI client setup"""
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

""" Run AI review"""
review = review_diff(diff, client)

""" Post review as PR comment"""
pr.create_issue_comment(f"🤖 AI Review:\n{review}")
print("AI review posted to PR.")
