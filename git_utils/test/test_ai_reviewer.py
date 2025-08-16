import pytest
from unittest.mock import patch, MagicMock
from git_utils.ai_reviewer import (
    split_diff_by_file,
    get_pr_diff,
    review_diff,
    review_pr
)


# -------------------
# Unit Tests
# -------------------


def test_split_diff_by_file():
    diff_text = """diff --git a/file1.js b/file1.js
+console.log("hello");
diff --git a/file2.js b/file2.js
+console.log("world");
"""
    result = split_diff_by_file(diff_text)
    assert "file1.js" in result
    assert "file2.js" in result


@patch("git_utils.ai_reviewer.requests.get")
def test_get_pr_diff(mock_get):
    """ Mock the HTTP response"""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = "fake diff"
    mock_get.return_value = mock_response

    pr = MagicMock()
    pr.patch_url = "http://fakeurl.com"
    token = "fake_token"
    result = get_pr_diff(pr, token)
    assert result == "fake diff"


@patch("git_utils.ai_reviewer.OpenAI")
def test_review_diff(mock_openai):
    """ Create a mock OpenAI client"""
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="[]"))]
    mock_client.chat.completions.create.return_value = mock_response

    """ Make OpenAI() return the mock client"""
    mock_openai.return_value = mock_client

    """ Call the function with injected client"""
    result = review_diff("fake diff", mock_client)
    assert result == []


@patch("git_utils.ai_reviewer.review_diff")
@patch("git_utils.ai_reviewer.get_pr_diff")
def test_review_pr(mock_get_diff, mock_review_diff):
    """ Mock diff response"""
    mock_get_diff.return_value = """diff --git a/file1.js b/file1.js
+console.log("hello");
diff --git a/file2.js b/file2.js
+console.log("world");"""

    """ Mock review_diff to return a comment"""
    mock_review_diff.side_effect = lambda diff, client: [{"comment":
                                                          "Looks good"}]

    pr = MagicMock()
    token = "fake_token"
    mock_client = MagicMock()

    result = review_pr(pr, token, mock_client)

    """ Assert both files were reviewed"""
    assert len(result) == 2
    assert all("file" in comment for comment in result)
    assert result[0]["comment"] == "Looks good"
