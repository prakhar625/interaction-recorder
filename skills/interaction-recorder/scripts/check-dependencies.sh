#!/bin/bash
# Check all dependencies required for the interaction-recorder skill.
# Run this before starting any recording session.
# Exit code 0 = all good, 1 = missing critical dependency.

ERRORS=0
WARNINGS=0

echo "═══════════════════════════════════════"
echo "  Interaction Recorder: Dependency Check"
echo "═══════════════════════════════════════"
echo ""

# ffmpeg (required)
if command -v ffmpeg &>/dev/null; then
  VER=$(ffmpeg -version 2>&1 | head -1 | awk '{print $3}')
  echo "✅ ffmpeg: $VER"
else
  echo "❌ ffmpeg: NOT FOUND"
  echo "   Install: brew install ffmpeg (macOS) / sudo apt install ffmpeg (Linux)"
  ERRORS=$((ERRORS + 1))
fi

# ffprobe (required, comes with ffmpeg)
if command -v ffprobe &>/dev/null; then
  echo "✅ ffprobe: available"
else
  echo "❌ ffprobe: NOT FOUND (should come with ffmpeg)"
  ERRORS=$((ERRORS + 1))
fi

# Node.js (required, v18+)
if command -v node &>/dev/null; then
  NODE_VER=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    echo "✅ Node.js: $NODE_VER"
  else
    echo "❌ Node.js: $NODE_VER (need v18+)"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "❌ Node.js: NOT FOUND"
  ERRORS=$((ERRORS + 1))
fi

# npm
if command -v npm &>/dev/null; then
  echo "✅ npm: $(npm --version)"
else
  echo "❌ npm: NOT FOUND"
  ERRORS=$((ERRORS + 1))
fi

# npx
if command -v npx &>/dev/null; then
  echo "✅ npx: $(npx --version 2>/dev/null || echo 'available')"
else
  echo "⚠️ npx: NOT FOUND (optional, npm can be used instead)"
  WARNINGS=$((WARNINGS + 1))
fi

# Playwright (checked but installed during setup if missing)
if npx playwright --version &>/dev/null 2>&1; then
  echo "✅ Playwright: $(npx playwright --version 2>/dev/null)"
else
  echo "⚠️ Playwright: not installed (will be installed during setup)"
  WARNINGS=$((WARNINGS + 1))
fi

# macOS TTS fallback
if command -v say &>/dev/null; then
  echo "✅ macOS say: available (TTS fallback)"
elif command -v espeak-ng &>/dev/null; then
  echo "✅ espeak-ng: available (TTS fallback)"
else
  echo "⚠️ No local TTS found (say/espeak-ng). External TTS required."
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "═══════════════════════════════════════"
if [ $ERRORS -gt 0 ]; then
  echo "  ❌ $ERRORS critical issue(s), $WARNINGS warning(s)"
  echo "  Fix critical issues before proceeding."
  exit 1
else
  echo "  ✅ All critical dependencies met ($WARNINGS warning(s))"
  exit 0
fi
