---
name: image-edit
description: >
  Use when the user wants to edit, modify, transform, restyle, or create variations of an
  existing image using AI. Triggers on: edit this image, change the style, modify the photo,
  transform the picture, restyle, image variation, change the background, apply style transfer,
  make it look vintage, add text to image, remove background, change colors.
---

# Image Edit — Image-to-Image

Edit and transform existing images using FAL AI's image-to-image models. Supports style transfer,
background changes, text modifications, targeted edits, and aesthetic transformations.

---

## Supported Models for Editing

| Edit Type | Default Model | Endpoint |
|-----------|--------------|----------|
| General edits | Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/edit` |
| Aesthetic transforms | Grok Imagine | `xai/grok-imagine-image/edit` |
| Fast edits | FLUX.2 Flash | `fal-ai/flux-2/flash/edit` |
| Precision edits | FLUX.2 [klein] | `fal-ai/flux-2/klein/4b/edit` |
| Text changes | Nano Banana Pro | `fal-ai/nano-banana-pro/edit` |
| Multi-reference | Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/edit` |

---

## Workflow

### Phase 1: Input Validation

1. Verify the source image exists and is accessible
2. Check format (supported: jpg, jpeg, png, webp, gif, avif)
3. Note original dimensions for comparison
4. For local files: prepare base64 encoding or upload to FAL storage

Read `references/image-to-image.md` for handling local files.

### Phase 2: Edit Intent

Determine what the user wants to change:
- **Style transfer**: Change the visual style (watercolor, vintage, anime, etc.)
- **Background change**: Replace or modify the background
- **Subject modification**: Change attributes of the subject (hair color, clothing, etc.)
- **Text changes**: Add, modify, or remove text in the image
- **Color adjustments**: Change color palette, temperature, saturation
- **Composition changes**: Reframe, crop, extend
- **Variations**: Generate similar images with variations

If unclear, ask the user what specific changes they want.

### Phase 3: Model Selection

Read `references/model-catalog.md` for full details. Select based on edit type:

- Style transfer → Grok Imagine (cinematic) or Seedream v4.5 (general)
- Text editing → Nano Banana Pro (best text rendering)
- Fast iteration → FLUX.2 Flash
- Multi-reference compositing → Seedream v4.5 (up to 10 reference images)
- Fine control with negative prompt → FLUX.2 [klein]

### Phase 4: Prompt + Parameter Setup

1. Spawn the `prompt-architect` agent with the edit description and target model
2. Set `guidance_scale` based on desired change magnitude:
   - 2-4: Subtle tweaks (color adjustments, minor style change)
   - 5-7: Moderate changes (style transfer, background swap)
   - 7-9: Significant transformation (major restyle)
   - 10+: Near-complete regeneration (use with caution — may cause artifacts)

Read `references/image-to-image.md` for the full strength/guidance tuning guide.
Read `references/prompt-engineering.md` for edit-specific prompt strategies.

### Phase 5: Generation

Execute the FAL API call:

```bash
./scripts/fal-submit.sh "{endpoint}" \
  '{"prompt":"[edit description]","image_urls":["[source_url]"],"guidance_scale":[value]}' \
  "./output/image-gen/edit-{model}-{timestamp}.png"
```

Read `references/fal-auth.md` to verify FAL_KEY is set.

### Phase 6: Compare & Iterate

1. Present the original and edited images side by side
2. Describe what changed and what was preserved
3. Offer adjustments:
   - "Want more/less change? I can adjust the guidance scale."
   - "Want to try a different model?"
   - "Should I refine the edit prompt?"

---

## Validation Gates

- [ ] Source image verified and accessible
- [ ] Edit intent is clear
- [ ] Model selected for the edit type
- [ ] Guidance scale set appropriately
- [ ] Edit prompt focuses on the desired change
- [ ] Image generated and downloaded
- [ ] Before/after comparison presented
- [ ] User satisfied or iteration planned

---

## Important Notes

- Edit prompts should describe the change, not the entire scene
- Start with moderate guidance (5-7) and adjust based on results
- For Seedream, keep guidance_scale under 10 to avoid artifacts
- Always present original vs edited for comparison
- Save edited images with `edit-` prefix in the filename
