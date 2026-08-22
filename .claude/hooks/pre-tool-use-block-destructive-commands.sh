#!/usr/bin/env python3
"""
Pre-tool-use hook: block destructive shell commands.
Reads the Claude hook JSON payload from stdin and exits with code 2
if a dangerous pattern is detected, which causes Claude to abort the tool call.
"""

import json
import re
import sys

DANGEROUS_PATTERNS = [
    # Recursive deletion
    (r'\brm\s+.*-[a-zA-Z]*r[a-zA-Z]*f\b', "rm -rf detected"),
    (r'\brm\s+.*-[a-zA-Z]*f[a-zA-Z]*r\b', "rm -rf detected"),
    # Hard git reset
    (r'\bgit\s+reset\s+--hard\b', "git reset --hard detected"),
    # Force-clean tracked/untracked files
    (r'\bgit\s+clean\s+.*-[a-zA-Z]*f\b', "git clean -f detected"),
    # find -delete
    (r'\bfind\b.*\s-delete\b', "find -delete detected"),
    # CDK destroy
    (r'\bcdk\s+destroy\b', "cdk destroy detected"),
    # Terraform destroy
    (r'\bterraform\s+destroy\b', "terraform destroy detected"),
    (r'\b\.\/deploy\.sh\s+\w+\s+destroy\b', "deploy.sh destroy detected"),
]


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        # If payload is unreadable, allow the command through
        sys.exit(0)

    # The Bash tool payload contains the command in tool_input.command
    tool_input = payload.get("tool_input", {})
    command = tool_input.get("command", "")

    if not command:
        sys.exit(0)

    for pattern, description in DANGEROUS_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(
                f"[BLOCKED] Destructive command detected: {description}\n"
                f"Command: {command}\n"
                "If this is intentional, please run the command manually in your terminal.",
                file=sys.stderr,
            )
            sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
