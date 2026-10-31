#!/usr/bin/env bash
# Vercel "Ignored Build Step" command (set it in each project's
# Settings -> Git -> Ignored Build Step). Vercel skips the build when this
# exits 0 and builds on any non-zero exit.
#
# Vercel builds every pushed branch as a preview deployment by default;
# the Production Branch setting only picks which branch gets the production
# domain. This script builds main, pull requests, and hook-triggered builds
# (no git ref), and skips all other branches (e.g. legacy) so they never
# trigger deployments.
set -euo pipefail

ref="${VERCEL_GIT_COMMIT_REF:-}"
pr="${VERCEL_GIT_PULL_REQUEST_ID:-}"

if [ -n "$ref" ] && [ "$ref" != "main" ] && [ -z "$pr" ]; then
  echo "skipping build for branch '$ref': only main and pull requests are deployed"
  exit 0
fi

echo "building '${ref:-unknown}' (pull request: ${pr:-none})"
exit 1
