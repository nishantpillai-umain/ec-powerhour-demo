#!/bin/bash
# SessionStart hook for Claude Code cloud sessions; no-op locally, and off in
# environments that set CLAUDE_SESSION_HOOK=off (deps from the setup script).
# Logs go to stderr; stdout is added to Claude's context.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
[ "${CLAUDE_SESSION_HOOK:-on}" = "off" ] && exit 0
set -euo pipefail
cd "$CLAUDE_PROJECT_DIR"

start=$(date +%s)
npm ci --no-audit --no-fund >&2
mkdir -p "$HOME/.cache"
echo "hook ran $(date -u +%FT%TZ): npm ci took $(( $(date +%s) - start ))s" >> "$HOME/.cache/cloud-hook.txt"

cat <<'EOF'
Cloud session: dependencies installed.
- Browser checks: `npm run e2e` (Playwright; starts the dev server itself on http://localhost:5173).
- Commit and push small, descriptive commits as you go; the developer follows progress from `git log` on your branch.
- `gh pr` and `gh issue` fail here (GraphQL is blocked); use `gh api` REST calls or the Create PR button.
EOF
