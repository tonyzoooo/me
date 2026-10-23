#!/usr/bin/env bash
# Sets up and deploys both Vercel projects (cms + web) from this repo.
#
# Prerequisites:
#   - Vercel login:      pnpm --dir apps/cms exec vercel login
#   - Filled-in config:  apps/cms/.env.production (see .env.production.example)
#   - Neon schema:       DATABASE_URL=<neon> pnpm --dir apps/cms exec payload migrate
# Usage:
#   ./scripts/vercel-setup.sh            # deploy both projects
#   CMS_PROJECT=foo WEB_PROJECT=bar ./scripts/vercel-setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CMS_PROJECT="${CMS_PROJECT:-tonyzoooo-me-cms}"
WEB_PROJECT="${WEB_PROJECT:-tonyzoooo-me-web}"
CMS_URL="https://${CMS_PROJECT}.vercel.app"
SITE_URL="${SITE_URL:-$CMS_URL}"

ENV_FILE="apps/cms/.env.production"

say() { printf '\n==> %s\n' "$1"; }

# --- checks -----------------------------------------------------------------

if ! pnpm --dir apps/cms exec vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run:"
  echo "  pnpm --dir apps/cms exec vercel login"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE."
  echo "Copy apps/cms/.env.production.example to $ENV_FILE and fill in the values."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

for VAR in DATABASE_URL PAYLOAD_SECRET R2_ENDPOINT R2_BUCKET R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_PUBLIC_URL; do
  if [ -z "${!VAR:-}" ]; then
    echo "$VAR is not set in $ENV_FILE"
    exit 1
  fi
done

# --- helpers -----------------------------------------------------------------

set_env() { # set_env <dir> <name> <value>
  local dir="$1" name="$2" value="$3" flags=""
  # Public framework prefixes (NEXT_PUBLIC_, PUBLIC_) are inlined into the
  # client bundle and cannot be stored as sensitive values
  case "$name" in NEXT_PUBLIC_* | PUBLIC_*) flags="--no-sensitive" ;; esac
  printf '%s' "$value" | (cd "$dir" && pnpm exec vercel env add "$name" production --force $flags >/dev/null)
}

# --- cms project -------------------------------------------------------------

say "Linking CMS project ($CMS_PROJECT)"
(cd apps/cms && pnpm exec vercel link --project "$CMS_PROJECT" --yes >/dev/null)

say "Setting CMS environment variables"
for VAR in DATABASE_URL PAYLOAD_SECRET R2_ENDPOINT R2_BUCKET R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_PUBLIC_URL; do
  set_env apps/cms "$VAR" "${!VAR}"
  echo "  $VAR"
done
set_env apps/cms NEXT_PUBLIC_SITE_URL "$SITE_URL"
echo "  NEXT_PUBLIC_SITE_URL=$SITE_URL"

say "Deploying CMS"
(cd apps/cms && pnpm exec vercel deploy --prod)

# --- web project -------------------------------------------------------------

say "Linking web project ($WEB_PROJECT)"
(cd apps/web && pnpm exec vercel link --project "$WEB_PROJECT" --yes >/dev/null)

say "Setting web environment variables"
set_env apps/web PUBLIC_CMS_URL "$SITE_URL"
echo "  PUBLIC_CMS_URL=$SITE_URL"

say "Deploying web"
(cd apps/web && pnpm exec vercel deploy --prod)

# --- wrap up -----------------------------------------------------------------

cat <<WRAP

Deployed:
  CMS: $CMS_URL
  Web: https://$WEB_PROJECT.vercel.app

One manual step left (Vercel dashboard, web project -> Settings -> Deploy Hooks):
  1. Create a deploy hook, e.g. "cms-content"
  2. Add its URL to the CMS project:
       pnpm --dir apps/cms exec vercel env add WEB_DEPLOY_HOOK_URL production
  3. Redeploy the CMS:
       pnpm --dir apps/cms exec vercel deploy --prod

To get push-to-deploy on git pushes, connect both projects to the GitHub
repo in the Vercel dashboard (Settings -> Git).
WRAP
