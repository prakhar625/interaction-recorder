#!/bin/bash
# Load environment variables from a .env file
# Usage: source scripts/load-env.sh /path/to/.env
#
# This exports all variables from the .env file into the current shell.
# Use before running any script that needs API keys.

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  # Try common locations
  for candidate in ".env" "../.env" "../../.env"; do
    if [ -f "$candidate" ]; then
      ENV_FILE="$candidate"
      break
    fi
  done
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
  echo "✅ Loaded env from $(realpath "$ENV_FILE")"

  # Verify key API keys (show first 8 chars only)
  [ -n "$FAL_KEY" ] && echo "  FAL_KEY: ${FAL_KEY:0:8}..."
  [ -n "$ELEVENLABS_API_KEY" ] && echo "  ELEVENLABS_API_KEY: ${ELEVENLABS_API_KEY:0:8}..."
else
  echo "⚠️ No .env file found at: $ENV_FILE"
  echo "  API-dependent features (TTS, image gen) may not work."
  echo "  Provide the path: source scripts/load-env.sh /path/to/.env"
fi
