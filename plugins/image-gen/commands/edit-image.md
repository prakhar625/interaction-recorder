---
command: edit-image
description: Edit an existing image using AI-powered image-to-image transformation
disable-model-invocation: true
---

# /edit-image

Edit and transform an existing image using FAL AI's image-to-image models.

## Before Starting

1. Read the `image-edit` SKILL.md for the full workflow
2. Read `references/fal-auth.md` — verify FAL_KEY is set
3. Read `references/image-to-image.md` — understand I2I parameters
4. Read `references/model-catalog.md` — know available edit models

## Execution Flow

```
Step 1: Identify Source    → Get the source image path/URL
Step 2: Determine Edit     → What changes does the user want?
Step 3: Select Model       → Pick best model for this edit type
Step 4: Set Parameters     → Configure guidance_scale, prompt
Step 5: Generate           → Execute via scripts/fal-submit.sh
Step 6: Compare            → Show original vs result
```

### Step 1: Identify Source Image

If the user provided an image path with the command, use it.
Otherwise, ask: "Which image would you like to edit? (provide a file path or URL)"

Verify the image exists and is in a supported format.
For local files, prepare for base64 encoding or FAL upload.

### Step 2: Determine Edit Intent

If the user described the edit, parse it.
Otherwise, ask: "What changes would you like to make to this image?"

Common edit types:
- Style transfer (make it watercolor, vintage, anime, etc.)
- Background change
- Subject modification (hair color, clothing, etc.)
- Text addition/modification
- Color adjustments
- Aesthetic transformation

### Step 3: Select Model

Based on edit type (read `references/model-catalog.md`):
- General edits → Seedream v4.5
- Aesthetic transforms → Grok Imagine
- Text changes → Nano Banana Pro
- Fast iteration → FLUX.2 Flash
- Fine control → FLUX.2 [klein]

### Step 4: Set Parameters

Read `references/image-to-image.md` for guidance tuning:
- Start with `guidance_scale: 5-7` for most edits
- Subtle tweaks: 2-4
- Major transforms: 7-9
- Keep Seedream under 10 to avoid artifacts

Craft the edit prompt — describe the change, NOT the entire scene.

### Step 5: Generate

```bash
./scripts/fal-submit.sh "{endpoint}" \
  '{"prompt":"[edit description]","image_urls":["[source]"],"guidance_scale":[value]}' \
  "./output/image-gen/edit-{model}-$(date +%Y%m%d-%H%M%S).png"
```

### Step 6: Compare & Iterate

Show the original and edited images side by side.
Describe what changed.

Offer adjustments:
- "Want more/less change?"
- "Try a different model?"
- "Refine the edit prompt?"
- "Apply another edit on top of this?"
