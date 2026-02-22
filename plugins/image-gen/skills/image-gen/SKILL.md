---
name: image-gen
description: >
  Use when the user wants to create, generate, or design a new image, artwork, illustration,
  diagram, icon, mockup, graphic, or visual from a text description using AI.
  Triggers on: generate image, create artwork, make an illustration, design a graphic, create
  a diagram, AI image, generate art, make a poster, create a logo concept, text-to-image,
  generate a picture, make me an image, create a visual, design an icon.
---

# Image Gen — Text-to-Image

Generate images from text descriptions using FAL AI's model ecosystem. Intelligently selects the
best model for the task, crafts optimized prompts, and delivers production-quality results.

---

## Supported Models

See `references/model-catalog.md` for the full model catalog. Key models:

| Use Case | Default Model |
|----------|--------------|
| Production quality | FLUX.2 [pro] or Seedream v4.5 |
| Highest quality | Nano Banana Pro or Imagen 4 Ultra |
| Fast drafts | FLUX.2 Flash or FLUX.2 [klein] |
| Text in images | Nano Banana Pro |
| Cinematic/aesthetic | Grok Imagine Image |
| Custom style (LoRA) | FLUX.2 [dev] LoRA |

---

## Workflow

### Phase 1: Intent Analysis

Parse the user's request to extract:
- **Subject**: What to generate (required — ask if unclear)
- **Style**: Visual style (photorealistic, illustration, minimalist, etc.)
- **Purpose**: What it's for (web, print, social, icon)
- **Dimensions**: Aspect ratio or specific size
- **Model preference**: Did the user request a specific model?
- **Reference images**: Any inspirational images provided?

If the request is vague, ask clarifying questions before proceeding.

### Phase 2: Model Selection

Read `references/model-catalog.md` for the model selection decision tree.

If the user specifies a model, use it. Otherwise auto-select based on:
- Quality requirements → Nano Banana Pro, Imagen 4 Ultra
- Speed requirements → FLUX.2 Flash, FLUX.2 [klein]
- Text rendering → Nano Banana Pro, FLUX.2 [pro]
- Cinematic style → Grok Imagine Image
- General production → FLUX.2 [pro], Seedream v4.5

### Phase 3: Input Analysis (conditional)

If reference/inspirational images are provided:
1. Spawn the `image-analyst` agent to extract a style profile
2. Read `references/image-analysis.md` for the analysis process
3. Feed the style profile into prompt construction

### Phase 4: Prompt Construction

1. Spawn the `prompt-architect` agent with:
   - User's description
   - Target model name
   - Style requirements
   - Image analysis results (if any)
   - Use case context
2. Read `references/prompt-engineering.md` for model-specific prompt strategies
3. Receive back: optimized prompt + negative prompt + recommended parameters

### Phase 5: Generation

1. Read `references/text-to-image.md` for the full T2I workflow
2. Read `references/fal-auth.md` to verify FAL_KEY is set
3. Execute the FAL API call using `scripts/fal-submit.sh`:

```bash
./scripts/fal-submit.sh "{endpoint}" '{json_payload}' "./output/image-gen/{filename}"
```

4. Handle errors per the error table in `references/text-to-image.md`

### Phase 6: Delivery & Iteration

1. Read `references/output-delivery.md` for output conventions
2. Present the generated image with metadata:
   - Model used, prompt, dimensions, file size, file path
3. Offer next steps:
   - Generate variations (different seeds)
   - Adjust prompt and regenerate
   - Try a different model
   - Upscale to higher resolution
   - Edit the generated image

---

## Validation Gates

- [ ] User's intent is clear (subject, style, purpose)
- [ ] Model is selected and endpoint confirmed
- [ ] Prompt is constructed and optimized for the target model
- [ ] FAL_KEY is verified
- [ ] Output directory exists (`./output/image-gen/`)
- [ ] Image generated and downloaded successfully
- [ ] Result presented to user with metadata

---

## Important Notes

- Always download FAL image URLs immediately — they expire after 24 hours
- Respect the user's model preference when specified
- For complex scenes, use the prompt-architect agent
- For reference images, always use the image-analyst agent
- Save all outputs to `./output/image-gen/` with the standard naming convention
- If generation fails, try an alternative model before giving up
