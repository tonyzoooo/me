#!/bin/sh

set -e

REPO="github.com/tonyzoooo/me-content.git"
DEST="src/content"
BRANCH="main"

if [ -f .env ]; then
  echo "[fetch-content] Loading .env"
  export $(grep -v '^#' .env | xargs)
fi

if [ -d "$DEST" ]; then
  echo "[fetch-content] '$DEST' already exists, skipping clone."
  exit 0
fi

if [ -z "$ME_CONTENT_TOKEN" ]; then
  echo "[fetch-content] ME_CONTENT_TOKEN not set. Aborting."
  exit 1
fi

REPO_URL="https://${ME_CONTENT_TOKEN}@${REPO}"

echo "[fetch-content] Cloning $REPO_URL into $DEST"
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$DEST"