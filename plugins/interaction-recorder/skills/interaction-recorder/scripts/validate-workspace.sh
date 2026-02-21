#!/usr/bin/env bash
# Validate that the workspace is ready for recording.
# Usage: validate-workspace.sh <workspace-path> [app-url]
#
# Checks all prerequisites: ffmpeg, Node.js 18+, Playwright, Remotion,
# starter components, symlinks, API keys, and target app reachability.
# Returns exit code 0 if all checks pass, 1 if any fail.

set -euo pipefail

WORKSPACE="${1:-}"
APP_URL="${2:-http://localhost:3000}"

if [ -z "$WORKSPACE" ]; then
  echo "Usage: validate-workspace.sh <workspace-path> [app-url]"
  echo ""
  echo "Validates the workspace is ready for Phase 6-8."
  echo "  <workspace-path>  Absolute path to interaction-recorder-workspace/"
  echo "  [app-url]         Target app URL (default: http://localhost:3000)"
  exit 1
fi

echo "═══ Pre-flight Check ═══"
echo "  Workspace: $WORKSPACE"
echo "  App URL:   $APP_URL"
echo ""

PASS=true
WARNINGS=0

# ffmpeg
if command -v ffmpeg >/dev/null 2>&1; then
  echo "✅ ffmpeg: $(ffmpeg -version 2>&1 | head -1 | cut -d' ' -f1-3)"
else
  echo "❌ ffmpeg: NOT FOUND"
  PASS=false
fi

# ffprobe
if command -v ffprobe >/dev/null 2>&1; then
  echo "✅ ffprobe: available"
else
  echo "❌ ffprobe: NOT FOUND"
  PASS=false
fi

# Node.js 18+
NODE_VER=$(node --version 2>/dev/null || echo "none")
NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1 2>/dev/null || echo "0")
if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
  echo "✅ Node.js: $NODE_VER"
else
  echo "❌ Node.js 18+ required (found: $NODE_VER)"
  PASS=false
fi

# Playwright
if [ -d "$WORKSPACE/node_modules/playwright" ]; then
  echo "✅ Playwright: installed"
else
  echo "❌ Playwright: not installed in workspace"
  PASS=false
fi

# Remotion
if cd "$WORKSPACE/remotion" 2>/dev/null && npx remotion --version >/dev/null 2>&1; then
  REMOTION_VER=$(npx remotion --version 2>/dev/null || echo "unknown")
  echo "✅ Remotion: $REMOTION_VER"
else
  echo "❌ Remotion: not working"
  PASS=false
fi

# Starter components
COMPONENTS=("BrowserFrame.tsx" "ClickZoomOverlay.tsx" "GradientBackground.tsx" "AnnotationOverlay.tsx" "FadeTransition.tsx")
MISSING_COMPONENTS=0
for comp in "${COMPONENTS[@]}"; do
  if [ ! -f "$WORKSPACE/remotion/src/components/$comp" ]; then
    MISSING_COMPONENTS=$((MISSING_COMPONENTS + 1))
  fi
done
if [ $MISSING_COMPONENTS -eq 0 ]; then
  echo "✅ Components: all ${#COMPONENTS[@]} present"
else
  echo "❌ Components: $MISSING_COMPONENTS missing"
  PASS=false
fi

# Symlinks
if [ -L "$WORKSPACE/remotion/public/recordings" ] && [ -L "$WORKSPACE/remotion/public/assets" ]; then
  echo "✅ Symlinks: recordings + assets"
else
  echo "❌ Symlinks: missing (run: ln -sf ... in remotion/public/)"
  PASS=false
fi

# API keys
if [ -n "${FAL_KEY:-}" ]; then
  echo "✅ FAL_KEY: ${FAL_KEY:0:8}..."
elif [ -n "${ELEVENLABS_API_KEY:-}" ]; then
  echo "✅ ELEVENLABS_API_KEY: ${ELEVENLABS_API_KEY:0:8}..."
else
  echo "⚠️  No TTS API key (FAL_KEY or ELEVENLABS_API_KEY). Will use local fallback."
  WARNINGS=$((WARNINGS + 1))
fi

# App running
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" != "000" ]; then
  echo "✅ App: $APP_URL (HTTP $HTTP_CODE)"
else
  echo "❌ App: not reachable at $APP_URL"
  PASS=false
fi

# Workspace directories
REQUIRED_DIRS=("recordings" "assets/narration" "assets/cards" "assets/sounds" "assets/music" "output" "remotion/src/components" "remotion/public")
MISSING_DIRS=0
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$WORKSPACE/$dir" ]; then
    MISSING_DIRS=$((MISSING_DIRS + 1))
  fi
done
if [ $MISSING_DIRS -eq 0 ]; then
  echo "✅ Directories: all present"
else
  echo "❌ Directories: $MISSING_DIRS missing"
  PASS=false
fi

echo ""
if $PASS; then
  if [ $WARNINGS -gt 0 ]; then
    echo "✅ All checks passed ($WARNINGS warnings). Ready for Phase 6."
  else
    echo "✅ All checks passed. Ready for Phase 6."
  fi
  exit 0
else
  echo "❌ Some checks failed. Fix issues before proceeding."
  exit 1
fi
