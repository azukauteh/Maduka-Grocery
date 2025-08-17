
import os
import json
from git_utils.ai_reviewer import get_pr_diff, review_diff
from github import Github
from openai import OpenAI  # pyright: ignore[reportMissingImports]


def main():
    """Run AI review on a pull request and post the results as a comment."""

    """ --- GitHub setup ---"""
    gh_token = os.getenv("GITHUB_TOKEN")
    repo_name = os.getenv("GITHUB_REPOSITORY")
    pr_number = os.getenv("PR_NUMBER")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not all([gh_token, repo_name, pr_number, openai_key]):
        raise ValueError("Missing one or more required"
                         "environment variables.")

    gh = Github(gh_token)
    repo = gh.get_repo(repo_name)
    pr = repo.get_pull(int(pr_number))

    """ --- Get PR diff ---"""
    diff = get_pr_diff(pr, gh_token)

    """--- OpenAI client setup ---"""
    client = OpenAI(api_key=openai_key)

    """--- Run AI review ---"""
    review = review_diff(diff, client)

    """Ensure JSON feedback is printed nicely"""
    review_output = json.dumps(review, indent=2)

    """ --- Post review as PR comment ---"""
    pr.create_issue_comment(f"🤖 AI Review:\n```json\n{review_output}\n```")
    print(f"AI review posted to PR #{pr_number}.")


if __name__ == "__main__":
    main()
