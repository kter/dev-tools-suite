#!/usr/bin/env python3
"""
Post-tool-use hook: auto-format and lint Vue/TS files after edits.

Logic:
  - .vue in tools/*/          → per-tool ESLint
  - .ts in Biome scope        → biome format --write + oxlint
  - .ts in tools/ (non-scope) → per-tool ESLint
"""
import json, os, re, subprocess, sys

BIOME_SCOPE = [
    re.compile(r'^tests/'),
    re.compile(r'^tools/[^/]+/utils/'),
    re.compile(r'^tools/shared/'),
    re.compile(r'^vitest\.config\.ts$'),
    re.compile(r'^playwright\.config\.ts$'),
]


def rel(path, root):
    if not os.path.isabs(path):
        path = os.path.join(root, path)
    return os.path.relpath(path, root)


def is_biome_scope(r):
    return any(p.match(r) for p in BIOME_SCOPE)


def tool_dir(r, root):
    parts = r.split(os.sep)
    if len(parts) >= 2 and parts[0] == 'tools' and parts[1] != 'shared':
        d = os.path.join(root, parts[0], parts[1])
        return d if os.path.isdir(d) else None
    return None


def run(cmd, cwd=None):
    try:
        subprocess.run(cmd, cwd=cwd, capture_output=True, timeout=60)
    except Exception:
        pass


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    root = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
    fp = payload.get('tool_input', {}).get('file_path', '')
    if not fp:
        sys.exit(0)

    r = rel(fp, root)
    abs_fp = os.path.join(root, r)

    if fp.endswith('.vue'):
        d = tool_dir(r, root)
        if d:
            run(['npm', 'run', 'lint', '--if-present'], cwd=d)
    elif fp.endswith('.ts'):
        if is_biome_scope(r):
            run(['npx', 'biome', 'format', '--write', abs_fp], cwd=root)
            run(['npx', 'oxlint', abs_fp], cwd=root)
        else:
            d = tool_dir(r, root)
            if d:
                run(['npm', 'run', 'lint', '--if-present'], cwd=d)

    sys.exit(0)


if __name__ == '__main__':
    main()
