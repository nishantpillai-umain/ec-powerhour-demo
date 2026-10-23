#!/bin/bash
# Setup script for the Claude Code cloud environment: paste into the
# environment dialog on claude.ai/code. Kept here for reference only.
set -uo pipefail

# 0 = deps come from the SessionStart hook; 1 = install them here (set
# CLAUDE_SESSION_HOOK=off in that environment's env vars).
INSTALL_DEPS=0
PLAYWRIGHT_VERSION=1.64.0 # keep in sync with package.json
export PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright
DIAG=/opt/cloud-setup-diag.txt

echo "setup ran $(date -u +%FT%TZ), INSTALL_DEPS=$INSTALL_DEPS, cwd=$PWD" > "$DIAG"

# Vite 8 needs Node 22.12+.
if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=12)?0:1)'; then
  npm install -g n && n 22
fi
echo "node $(node -v)" >> "$DIAG"

start=$(date +%s)
npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium || exit 1
chmod -R a+rX "$PLAYWRIGHT_BROWSERS_PATH"
echo "playwright install took $(( $(date +%s) - start ))s" >> "$DIAG"

if [ "$INSTALL_DEPS" = 1 ]; then
  repo=""
  for f in "$PWD/package-lock.json" $(find / -xdev -maxdepth 5 -name package-lock.json -not -path '*/node_modules/*' 2>/dev/null); do
    if [ -f "$f" ] && grep -q '"name": "toolbox"' "$f"; then
      repo=$(dirname "$f")
      break
    fi
  done
  if [ -z "$repo" ]; then
    echo "repo not present at setup time; npm ci skipped" >> "$DIAG"
  else
    start=$(date +%s)
    if (cd "$repo" && npm ci --no-audit --no-fund); then
      echo "npm ci in $repo took $(( $(date +%s) - start ))s" >> "$DIAG"
    else
      echo "npm ci in $repo FAILED" >> "$DIAG"
    fi
  fi
fi
exit 0
