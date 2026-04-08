#!/usr/bin/env bash
# install.sh — Copy pre-downloaded Node.js packages to /tmp/node_modules
# Usage: bash Resources/nodejs/install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="/tmp/node_modules"

echo "Installing node_modules from $SCRIPT_DIR -> $TARGET"
cp -r "$SCRIPT_DIR/node_modules" "$TARGET"
echo "Done. Playwright available at $TARGET/playwright/index.mjs"

# Install Chromium browser binary if not already present
if ! "$SCRIPT_DIR/node_modules/.bin/playwright" install chromium --dry-run 2>/dev/null | grep -q "already installed"; then
  echo "Installing Chromium browser binary..."
  "$SCRIPT_DIR/node_modules/.bin/playwright" install chromium
fi
