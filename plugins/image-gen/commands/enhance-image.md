---
command: enhance-image
description: Upscale and enhance an existing image using AI
disable-model-invocation: true
---

# /enhance-image

Upscale and enhance an existing image using FAL AI's upscaling models.

## Before Starting

1. Read the `image-enhance` SKILL.md for the full workflow
2. Read `references/fal-auth.md` — verify FAL_KEY is set
3. Read `references/enhancement.md` — understand enhancement operations
4. Read `references/model-catalog.md` — know upscaling models

## Execution Flow

```
Step 1: Identify Source    → Get the source image
Step 2: Assess Quality     → Analyze current resolution and quality
Step 3: Plan Enhancement   → Determine operations needed
Step 4: Select Model       → SeedVR2 (quality) or ESRGAN (speed)
Step 5: Execute            → Run enhancement pipeline
Step 6: Deliver            → Present before/after comparison
```

### Step 1: Identify Source Image

If the user provided an image path with the command, use it.
Otherwise, ask: "Which image would you like to enhance? (provide a file path or URL)"

### Step 2: Assess Quality

Read the source image and note:
- Current dimensions (width x height)
- File format and size
- Visible quality issues (noise, blur, artifacts)

### Step 3: Plan Enhancement

Based on assessment and user's goal:
- Low resolution → Upscale
- Noisy → Denoise before upscaling
- For print → Calculate target resolution (300 DPI at print size)
- For web → Cap at 2048px longest side
- For social → Match platform dimensions

Read `references/enhancement.md` for the full pipeline guide.

### Step 4: Select Model

- **Quality priority** → SeedVR2 (`fal-ai/seedvr/upscale/image`)
- **Speed priority** → ESRGAN (`fal-ai/esrgan`, scale: 2 or 4)

If the user has a preference, respect it.

### Step 5: Execute

```bash
# SeedVR2
./scripts/fal-submit.sh "fal-ai/seedvr/upscale/image" \
  '{"image_url": "[source]"}' \
  "./output/image-gen/enhanced-seedvr2-$(date +%Y%m%d-%H%M%S).png"

# ESRGAN 2x
./scripts/fal-submit.sh "fal-ai/esrgan" \
  '{"image_url": "[source]", "scale": 2}' \
  "./output/image-gen/enhanced-esrgan-$(date +%Y%m%d-%H%M%S).png"
```

### Step 6: Deliver

Present before/after:
- Original: [dimensions], [file size]
- Enhanced: [dimensions], [file size]
- Quality improvements noted

Offer further options:
- "Upscale further?"
- "Convert to a different format?"
- "Optimize for a specific platform?"
