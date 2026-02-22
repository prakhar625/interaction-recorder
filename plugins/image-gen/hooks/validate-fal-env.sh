#!/usr/bin/env bash
# SessionStart hook: validate FAL_KEY environment variable.
# Non-blocking — outputs a warning if the key is missing but does not fail.

set -euo pipefail

# Read the project directory from hook input
CWD=$(cat | jq -r '.cwd // empty')

if [ -z "$CWD" ]; then
  exit 0
fi

# Check if FAL_KEY is already set in the environment
if [ -n "${FAL_KEY:-}" ]; then
  exit 0
fi

# Try to load from .env files
ENV_FILE=""
for candidate in "$CWD/.env" "$CWD/.env.local"; do
  if [ -f "$candidate" ]; then
    ENV_FILE="$candidate"
    break
  fi
done

if [ -n "$ENV_FILE" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    # Strip 'export ' prefix if present
    key="${key#export }"
    # Only export FAL-relevant keys
    case "$key" in
      FAL_KEY|FAL_API_KEY)
        echo "export ${key}=${value}" >> "$CLAUDE_ENV_FILE"
        ;;
    esac
  done < "$ENV_FILE"
  exit 0
fi

# If we get here, no FAL_KEY was found anywhere
echo "WARNING: FAL_KEY not found. Image generation will not work without it." >&2
echo "Set it with: export FAL_KEY=your-key-here" >&2
echo "Or add FAL_KEY=your-key to a .env file in your project root." >&2

exit 0
