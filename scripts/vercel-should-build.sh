#!/usr/bin/env bash
# Vercel "Ignored Build Step" command (set it in each project's
# Settings -> Git -> Ignored Build Step). Exit 1 skips the build entirely.
#
# Vercel builds every pushed branch as a preview deployment by default;
# the Production Branch setting only picks which branch gets the production
# domain. This script builds main and pull requests, and skips all other
# branches (e.g. legacy) so they never trigger deployments.
set -euo pipefail

ref="${VERCEL_GIT_COMMIT_REF:-}"
pr="${VERCEL_GIT_PULL_REQUEST_ID:-}"

if [ "$ref" = "main" ] || [ -n "$pr" ]; then
  echo "building '${ref:-unknown}' (pull request: ${pr:-none})"
  exit 0
fi

echo "skipping build for branch '${ref:-unknown}': only main and pull requests are deployed"
exit 1
