---
command: generate
description: Generate an image from a text description using FAL AI
disable-model-invocation: true
---

# /generate

Quick text-to-image generation with intelligent model selection and prompt optimization.

## Before Starting

1. Read the `image-gen` SKILL.md for the full workflow
2. Read `references/fal-auth.md` — verify FAL_KEY is set
3. Read `references/model-catalog.md` — know available models

## Execution Flow

```
Step 1: Gather Intent     → Ask what to generate (if not already clear)
Step 2: Select Model      → Auto-select or use user preference
Step 3: Craft Prompt      → Use prompt-architect agent for optimization
Step 4: Generate          → Execute via scripts/fal-submit.sh
Step 5: Deliver           → Present result, offer iteration
```

### Step 1: Gather Intent

If the user provided a description with the command, parse it immediately.
If the description is vague or missing, ask:

- "What would you like me to generate?"
- "Any specific style? (photorealistic, illustration, minimalist, etc.)"
- "What size/aspect ratio? (landscape, portrait, square)"

### Step 2: Select Model

Read `references/model-catalog.md` for the decision tree:
- Default: FLUX.2 [pro] (best general-purpose)
- If text needed: Nano Banana Pro
- If fast/cheap: FLUX.2 Flash
- If cinematic: Grok Imagine Image
- If user specifies a model: use that model

Tell the user which model you're using and why.

### Step 3: Craft Prompt

For simple requests, construct the prompt directly using guidance from `references/prompt-engineering.md`.
For complex requests, spawn the `prompt-architect` agent.

If reference images are provided, spawn the `image-analyst` agent first.

### Step 4: Generate

```bash
mkdir -p ./output/image-gen
./scripts/fal-submit.sh "{endpoint}" '{json_payload}' \
  "./output/image-gen/image-gen-{model}-$(date +%Y%m%d-%H%M%S).png"
```

Read `references/text-to-image.md` for full API call details.

### Step 5: Deliver

Present the image with:
- File path for viewing
- Model used, dimensions, file size
- The prompt that was used

Offer next steps:
- "Generate variations?" (change seed)
- "Adjust and retry?" (modify prompt)
- "Try a different model?"
- "Upscale this image?" (triggers image-enhance skill)
- "Edit this image?" (triggers image-edit skill)
