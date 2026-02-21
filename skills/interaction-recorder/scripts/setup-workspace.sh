#!/bin/bash
# Set up the interaction-recorder workspace directory structure.
# Usage: bash scripts/setup-workspace.sh [workspace-path]

WORKSPACE="${1:-$(pwd)/interaction-recorder-workspace}"
# Resolve to absolute path
WORKSPACE="$(cd "$(dirname "$WORKSPACE")" 2>/dev/null && pwd)/$(basename "$WORKSPACE")"

echo "Setting up workspace at: $WORKSPACE"

# Create directory structure (all paths from here must be absolute)
mkdir -p "$WORKSPACE"/{recordings,assets/{narration,cards,graphics,sounds,music},output/chunks,remotion/{src/components,public}}

# Initialize npm in workspace root (for Playwright, dotenv)
cd "$WORKSPACE"
if [ ! -f package.json ]; then
  npm init -y 2>/dev/null
  npm install playwright dotenv 2>&1 | tail -3
  npx playwright install chromium 2>&1 | tail -3
fi

echo ""
echo "✅ Workspace created: $WORKSPACE"
echo "   recordings/     — per-segment video files"
echo "   assets/         — narration, cards, sounds, music"
echo "   remotion/       — Remotion project"
echo "   output/         — final rendered video(s)"
echo ""
echo "Next: Set up Remotion project in $WORKSPACE/remotion/"
echo "      See references/tool-setup.md for instructions."
