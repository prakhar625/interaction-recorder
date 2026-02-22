#!/usr/bin/env bash
# fal-submit.sh — Submit a request to FAL AI, poll for completion, download the result.
#
# Usage: fal-submit.sh <endpoint> <json_payload> <output_path>
#
# Example:
#   ./fal-submit.sh "fal-ai/flux-2-pro" \
#     '{"prompt":"A sunset over mountains","image_size":"landscape_16_9"}' \
#     "./output/image-gen/sunset.png"
#
# Environment:
#   FAL_KEY — Required. Your FAL AI API key.

set -euo pipefail

ENDPOINT="${1:?Usage: fal-submit.sh <endpoint> <json_payload> <output_path>}"
PAYLOAD="${2:?Missing JSON payload}"
OUTPUT_PATH="${3:?Missing output path}"

BASE_URL="https://queue.fal.run"
MAX_POLL_ATTEMPTS=120
POLL_INTERVAL=2

# Validate FAL_KEY
if [ -z "${FAL_KEY:-}" ]; then
  echo "ERROR: FAL_KEY environment variable is not set." >&2
  echo "Set it with: export FAL_KEY=your-key-here" >&2
  exit 1
fi

# Ensure output directory exists
OUTPUT_DIR=$(dirname "$OUTPUT_PATH")
mkdir -p "$OUTPUT_DIR"

# Step 1: Submit request to queue
echo "Submitting to ${ENDPOINT}..."
SUBMIT_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "${BASE_URL}/${ENDPOINT}")

HTTP_CODE=$(echo "$SUBMIT_RESPONSE" | tail -1)
BODY=$(echo "$SUBMIT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ge 400 ]; then
  echo "ERROR: Submit failed with HTTP ${HTTP_CODE}" >&2
  echo "$BODY" >&2
  exit 1
fi

REQUEST_ID=$(echo "$BODY" | jq -r '.request_id // empty')
if [ -z "$REQUEST_ID" ]; then
  # Some endpoints return the result directly (sync mode)
  IMAGE_URL=$(echo "$BODY" | jq -r '.images[0].url // .image.url // empty')
  if [ -n "$IMAGE_URL" ]; then
    echo "Direct response received. Downloading..."
    curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"
    echo "Saved to: $OUTPUT_PATH"
    exit 0
  fi
  echo "ERROR: No request_id in response" >&2
  echo "$BODY" >&2
  exit 1
fi

echo "Request queued: ${REQUEST_ID}"

# Step 2: Poll for completion
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_POLL_ATTEMPTS ]; do
  STATUS_RESPONSE=$(curl -s \
    -H "Authorization: Key ${FAL_KEY}" \
    "${BASE_URL}/${ENDPOINT}/requests/${REQUEST_ID}/status")

  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status // empty')

  case "$STATUS" in
    COMPLETED)
      echo "Generation complete."
      break
      ;;
    FAILED)
      ERROR_MSG=$(echo "$STATUS_RESPONSE" | jq -r '.error // "Unknown error"')
      echo "ERROR: Generation failed — ${ERROR_MSG}" >&2
      exit 1
      ;;
    IN_PROGRESS|IN_QUEUE|PENDING)
      ATTEMPT=$((ATTEMPT + 1))
      sleep $POLL_INTERVAL
      ;;
    *)
      echo "WARNING: Unknown status '${STATUS}', continuing to poll..." >&2
      ATTEMPT=$((ATTEMPT + 1))
      sleep $POLL_INTERVAL
      ;;
  esac
done

if [ $ATTEMPT -ge $MAX_POLL_ATTEMPTS ]; then
  echo "ERROR: Timed out waiting for generation (${MAX_POLL_ATTEMPTS} attempts)" >&2
  exit 1
fi

# Step 3: Get result
RESULT=$(curl -s \
  -H "Authorization: Key ${FAL_KEY}" \
  "${BASE_URL}/${ENDPOINT}/requests/${REQUEST_ID}")

# Extract image URL (try common response formats)
IMAGE_URL=$(echo "$RESULT" | jq -r '.images[0].url // .image.url // .output.url // empty')

if [ -z "$IMAGE_URL" ]; then
  echo "ERROR: No image URL found in result" >&2
  echo "$RESULT" | jq '.' >&2
  exit 1
fi

# Step 4: Download the image
echo "Downloading image..."
curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"

if [ -f "$OUTPUT_PATH" ] && [ -s "$OUTPUT_PATH" ]; then
  FILE_SIZE=$(wc -c < "$OUTPUT_PATH" | tr -d ' ')
  echo "Saved to: $OUTPUT_PATH (${FILE_SIZE} bytes)"
else
  echo "ERROR: Download failed or file is empty" >&2
  exit 1
fi
