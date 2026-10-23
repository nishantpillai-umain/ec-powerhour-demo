#!/bin/bash
# Reports how this cloud session's environment was prepared, then runs the
# unit and e2e tests. Used to compare the hook and setup-script-only setups.
cd "$(git rev-parse --show-toplevel)" || exit 1
section() { printf '\n== %s\n' "$1"; }

section "Session"
echo "branch $(git branch --show-current), user $(id -un), $(date -u +%FT%TZ)"
echo "CLAUDE_SESSION_HOOK=${CLAUDE_SESSION_HOOK:-on} PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-unset}"
section "Node"
node -v
section "Setup script"
cat /opt/cloud-setup-diag.txt 2>/dev/null || echo "no diagnostics (setup script did not run)"
section "SessionStart hook"
cat "$HOME/.cache/cloud-hook.txt" 2>/dev/null || echo "did not run"
section "node_modules matches package-lock.json"
if npm ls --depth=0 >/dev/null 2>&1; then echo yes; else echo no; npm ls --depth=0 2>&1 | tail -5; fi
section "Playwright"
npx --no-install playwright --version 2>&1 || echo "not installed"
ls "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}" 2>&1
section "Unit tests"
npm test 2>&1 | tail -4
section "E2E smoke"
start=$(date +%s)
npm run e2e 2>&1 | tail -15
echo "exit=${PIPESTATUS[0]} in $(( $(date +%s) - start ))s"
