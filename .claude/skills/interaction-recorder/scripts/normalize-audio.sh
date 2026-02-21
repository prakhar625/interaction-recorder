#!/usr/bin/env bash
# Normalize an audio file to 44100Hz stereo 16-bit PCM WAV.
# Usage: normalize-audio.sh <input> <output>
#
# This is the canonical normalization script used by ALL phases of
# the interaction-recorder pipeline. Every audio file must pass
# through this script before being used.

set -euo pipefail

INPUT="${1:-}"
OUTPUT="${2:-}"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: normalize-audio.sh <input-file> <output-wav>"
  echo ""
  echo "Normalizes any audio file to 44100Hz, 2-channel, 16-bit PCM WAV."
  echo "This ensures all audio in the pipeline has a consistent format."
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "❌ Input file not found: $INPUT"
  exit 1
fi

ffmpeg -y -i "$INPUT" -ar 44100 -ac 2 -c:a pcm_s16le "$OUTPUT" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Failed to normalize: $INPUT"
  exit 1
fi

# Validate output
INFO=$(ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels -of csv=p=0 "$OUTPUT" 2>/dev/null)

if [[ "$INFO" != *"44100"* ]] || [[ "$INFO" != *"2"* ]]; then
  echo "❌ Normalization produced wrong format: $INFO (expected 44100,2)"
  exit 1
fi

echo "✅ Normalized: $OUTPUT (44100Hz stereo WAV)"
