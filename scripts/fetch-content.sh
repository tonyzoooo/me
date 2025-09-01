#!/bin/sh

set -e

REPO="github.com/tonyzoooo/me-content.git"
DEST="src/content"
BRANCH="main"
ASSETS_SRC="$DEST/assets/projects"
ASSETS_DEST="public/assets/projects"

if [ -f .env ]; then
  echo "[fetch-content] Loading .env"
  export $(grep -v '^#' .env | xargs)
fi

if [ -d "$DEST" ]; then
  echo "[fetch-content] '$DEST' already exists, skipping clone."
else
  if [ -z "$ME_CONTENT_TOKEN" ]; then
    echo "[fetch-content] ME_CONTENT_TOKEN not set. Aborting."
    exit 1
  fi

  REPO_URL="https://${ME_CONTENT_TOKEN}@${REPO}"

  echo "[fetch-content] Cloning $REPO_URL into $DEST"
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$DEST"
fi

if [ -d "$ASSETS_SRC" ]; then
  echo "[fetch-content] Moving assets from $ASSETS_SRC to $ASSETS_DEST"
  mkdir -p "$ASSETS_DEST"
  cp -R "$ASSETS_SRC/"* "$ASSETS_DEST/"
else
  echo "[fetch-content] No assets found in $ASSETS_SRC"
fi