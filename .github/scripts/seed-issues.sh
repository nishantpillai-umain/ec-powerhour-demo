#!/usr/bin/env bash
# Creates a GitHub issue for each .github/demo-issues/*.md, skipping titles that already exist (open or closed).
# Needs the gh CLI, authenticated. Locally: ./.github/scripts/seed-issues.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

existing=$(gh issue list --state all --limit 500 --json title --jq '.[].title')
for f in .github/demo-issues/*.md; do
  title=$(head -1 "$f" | sed 's/^# //')
  if grep -Fxq "$title" <<<"$existing"; then
    echo "skip: $title"
    continue
  fi
  tail -n +3 "$f" | gh issue create --title "$title" --body-file -
done
