# Image-to-Image Workflow

Detailed guide for I2I editing — transforming existing images with AI models.

---

## Overview

Image-to-image (I2I) workflows take a source image and modify it according to a text prompt. The amount of change is controlled by parameters like strength and guidance scale.

## Prerequisites

- [ ] Source image exists and is accessible (local path or URL)
- [ ] Source image is a supported format (PNG, JPG, WebP)
- [ ] FAL_KEY is configured (see `fal-auth.md`)

## Phase 1: Input Validation

Before starting any edit:

1. **Verify the source image exists**: Check the file path or URL is valid
2. **Check format**: FAL accepts jpg, jpeg, png, webp, gif, avif
3. **Check resolution**: Note original dimensions for output comparison
4. **For local files**: The image must be uploaded or converted to base64

### Handling Local Files

FAL API requires images as URLs. For local files:

```bash
# Option 1: Base64 encode (for small images)
BASE64=$(base64 -w0 "local-image.png")
IMAGE_URL="data:image/png;base64,${BASE64}"

# Option 2: Upload to FAL storage first (for large images)
# Use fal.storage.upload() via the JS client
```

## Phase 2: Model Selection for Editing

| Edit Type | Recommended Model | Endpoint | Why |
|-----------|------------------|----------|-----|
| **General edits** | Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/edit` | Unified architecture, natural results |
| **Aesthetic transforms** | Grok Imagine | `xai/grok-imagine-image/edit` | Cinematic quality, style transforms |
| **Fast edits** | FLUX.2 Flash | `fal-ai/flux-2/flash/edit` | Sub-second, cost-effective |
| **Precision edits** | FLUX.2 [klein] | `fal-ai/flux-2/klein/4b/edit` | Configurable guidance, negative prompt |
| **Text changes** | Nano Banana Pro | `fal-ai/nano-banana-pro/edit` | Best text rendering |
| **Multi-reference** | Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/edit` | Accepts up to 10 reference images |

## Phase 3: Strength / Guidance Tuning

### Guidance Scale

Controls how closely the output follows the prompt vs preserving the original:

| guidance_scale | Effect | Use Case |
|---------------|--------|----------|
| 2-4 | Subtle influence | Minor tweaks, color adjustments |
| 5-7 | Moderate guidance | Style transfer, background changes |
| 7-9 | Strong guidance | Significant transformations |
| 10+ | Maximum adherence | Near-complete regeneration (may cause artifacts) |

**Default recommendation**: Start at 5-7, adjust based on results.

### Seedream-Specific

- Keep `guidance_scale` between 7-9 for best results
- Values above 10 cause oversaturation and edge artifacts (~40% of generations)
- For subtle edits, use lower guidance (5-7)

### FLUX.2 Klein Edit

- Default `guidance_scale`: 5
- Default `num_inference_steps`: 28
- `negative_prompt` supported — use to exclude unwanted changes

## Phase 4: Edit Prompt Construction

Edit prompts should describe the desired change, not the entire image:

### Good Edit Prompts

```
Change the background to a tropical beach sunset
```

```
Make the person's hair color bright red while keeping everything else the same
```

```
Apply a watercolor painting style to this photograph
```

```
Replace the text on the sign with "OPEN 24/7"
```

### Bad Edit Prompts

```
A beautiful image with changes
```
(Too vague — what changes?)

```
A tropical beach with a person and sunset and palm trees and...
```
(Describing the full scene instead of the edit)

## Phase 5: API Call Construction

### Seedream v4.5 Edit

```bash
./scripts/fal-submit.sh "fal-ai/bytedance/seedream/v4.5/edit" \
  '{
    "prompt": "Change the background to a tropical beach at sunset",
    "image_urls": ["https://example.com/source.jpg"],
    "guidance_scale": 7
  }' \
  "./output/image-gen/seedream45-edit-beach.png"
```

### FLUX.2 Flash Edit

```bash
./scripts/fal-submit.sh "fal-ai/flux-2/flash/edit" \
  '{
    "prompt": "Apply a vintage film look with warm tones",
    "image_urls": ["https://example.com/source.jpg"],
    "guidance_scale": 5
  }' \
  "./output/image-gen/flux2flash-edit-vintage.png"
```

### Grok Imagine Edit

```bash
./scripts/fal-submit.sh "xai/grok-imagine-image/edit" \
  '{
    "prompt": "Transform into a cinematic night scene with neon reflections",
    "image_url": "https://example.com/source.jpg"
  }' \
  "./output/image-gen/grok-edit-neon.png"
```

## Phase 6: Compare & Iterate

After generating the edit:

1. **Present both images**: Show original alongside the edit
2. **Highlight changes**: Describe what changed and what was preserved
3. **Offer adjustments**:
   - "Want more/less change? I can adjust the guidance scale."
   - "Want to try a different model for this edit?"
   - "Should I refine the prompt to be more specific?"
4. **Allow iteration**: Re-run with adjusted parameters until satisfied

## Error Handling

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| 422 Unprocessable | Invalid image format or URL | Check format, re-upload |
| Image unchanged | Guidance too low | Increase guidance_scale |
| Image completely different | Guidance too high | Decrease guidance_scale |
| Artifacts/distortion | Guidance >10 on Seedream | Keep guidance_scale 7-9 |
| Slow response | Large image + complex edit | Try FLUX.2 Flash for speed |

## Validation Gate

- [ ] Source image verified and accessible
- [ ] Edit intent clearly defined
- [ ] Model selected for edit type
- [ ] Guidance scale set appropriately
- [ ] Edit prompt focuses on the change, not the full scene
- [ ] Result compared with original
- [ ] User satisfied or iteration planned
