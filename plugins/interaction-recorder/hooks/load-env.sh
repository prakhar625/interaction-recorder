#!/usr/bin/env bash
# SessionStart hook: load .env file and export API keys for the recording pipeline.
# Writes export statements to CLAUDE_ENV_FILE so they persist across Bash calls.

set -euo pipefail

# Read the project directory from hook input
CWD=$(cat | jq -r '.cwd // empty')

if [ -z "$CWD" ]; then
  exit 0
fi

# Look for .env files in the project root
ENV_FILE=""
for candidate in "$CWD/.env" "$CWD/.env.local"; do
  if [ -f "$candidate" ]; then
    ENV_FILE="$candidate"
    break
  fi
done

if [ -z "$ENV_FILE" ]; then
  exit 0
fi

# Only export recording-relevant keys
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    # Strip 'export ' prefix if present
    key="${key#export }"
    # Only export keys relevant to the recording pipeline
    case "$key" in
      FAL_KEY|ELEVENLABS_API_KEY|OPENAI_API_KEY)
        echo "export ${key}=${value}" >> "$CLAUDE_ENV_FILE"
        ;;
    esac
  done < "$ENV_FILE"
fi

exit 0
