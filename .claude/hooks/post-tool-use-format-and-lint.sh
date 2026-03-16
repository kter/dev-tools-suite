#!/usr/bin/env python3
"""
Post-tool-use hook: auto-format and lint Vue/TS files after edits.
Reads the Claude hook JSON payload from stdin. For files under tools/*/
with .vue or .ts extensions, runs `npm run lint --if-present` in the
tool's directory. Failures are ignored to avoid breaking the workflow.
"""

import json
import os
import subprocess
import sys


def get_tool_dir(file_path: str, project_dir: str) -> str | None:
    """Return the tool root directory if the file belongs to a tool, else None."""
    # Normalise to an absolute path
    if not os.path.isabs(file_path):
        file_path = os.path.join(project_dir, file_path)
    rel = os.path.relpath(file_path, project_dir)

    # Expect: tools/<tool-name>/...
    parts = rel.split(os.sep)
    if len(parts) >= 2 and parts[0] == "tools":
        tool_dir = os.path.join(project_dir, parts[0], parts[1])
        if os.path.isdir(tool_dir):
            return tool_dir
    return None


def should_lint(file_path: str) -> bool:
    """Return True if the file extension warrants linting."""
    return file_path.endswith((".vue", ".ts"))


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())

    # The file path is in tool_input for Edit/Write tools
    tool_input = payload.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if not file_path or not should_lint(file_path):
        sys.exit(0)

    tool_dir = get_tool_dir(file_path, project_dir)
    if not tool_dir:
        sys.exit(0)

    # Run lint; ignore failures so we never break the workflow
    try:
        subprocess.run(
            ["npm", "run", "lint", "--if-present"],
            cwd=tool_dir,
            capture_output=True,
            timeout=60,
        )
    except Exception:
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
