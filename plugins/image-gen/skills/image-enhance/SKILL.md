---
name: image-enhance
description: >
  Use when the user wants to upscale, enhance, improve quality, increase resolution, sharpen,
  denoise, or clean up an existing image. Triggers on: upscale image, enhance photo, improve
  resolution, sharpen, denoise, clean up, make higher quality, fix blurry, increase resolution,
  make it bigger, improve image quality, 4K upscale, super resolution.
---

# Image Enhance — Upscaling & Enhancement

Upscale and enhance existing images using FAL AI's specialized models. Supports resolution
upscaling, quality improvement, and use-case-specific optimization.

---

## Supported Enhancement Models

| Model | Endpoint | Best For | Price |
|-------|----------|----------|-------|
| **SeedVR2** | `fal-ai/seedvr/upscale/image` | Quality upscaling, natural textures, skin detail | $0.001/MP |
| **ESRGAN** | `fal-ai/esrgan` | Fast upscaling, batch processing | ~$0.001/MP |

### When to Use Which

- **SeedVR2**: Quality is priority. Final output for print, presentation, portfolio.
  Exceptional at preserving skin texture, fabric detail, natural color tones.
- **ESRGAN**: Speed is priority. Intermediate processing, batch operations, quick previews.
  Supports configurable scale factor (2x, 4x).

---

## Workflow

### Phase 1: Input Analysis

1. Read the source image to assess current quality
2. Note dimensions, file size, format
3. Evaluate:
   - **Resolution**: Is it sufficient for the target use case?
   - **Noise**: Is there visible noise or grain?
   - **Sharpness**: Are edges crisp or soft?
   - **Artifacts**: JPEG compression, banding, haloing?

Read `references/enhancement.md` for the full quality assessment checklist.

### Phase 2: Enhancement Plan

Determine what operations are needed:

```
Low resolution? → Upscale (SeedVR2 for quality, ESRGAN for speed)
Noisy/grainy? → Denoise first, then upscale
Soft/blurry? → Upscale with SeedVR2 (adds natural detail)
JPEG artifacts? → Upscale (removes artifacts)
Need specific dimensions? → Upscale, then resize
```

**Pipeline order**: Denoise → Upscale → Sharpen (if needed)

### Phase 3: Model Selection

- Quality priority → SeedVR2 (`fal-ai/seedvr/upscale/image`)
- Speed priority → ESRGAN (`fal-ai/esrgan`) with `scale: 2` or `scale: 4`

If the user specifies a preference, respect it.

### Phase 4: Execution

```bash
# SeedVR2 (quality)
./scripts/fal-submit.sh "fal-ai/seedvr/upscale/image" \
  '{"image_url": "[source_url]"}' \
  "./output/image-gen/enhanced-seedvr2-{timestamp}.png"

# ESRGAN (speed, 2x)
./scripts/fal-submit.sh "fal-ai/esrgan" \
  '{"image_url": "[source_url]", "scale": 2}' \
  "./output/image-gen/enhanced-esrgan-{timestamp}.png"

# ESRGAN (speed, 4x)
./scripts/fal-submit.sh "fal-ai/esrgan" \
  '{"image_url": "[source_url]", "scale": 4}' \
  "./output/image-gen/enhanced-esrgan-4x-{timestamp}.png"
```

Read `references/enhancement.md` for post-processing with ffmpeg (sharpening, resizing, format conversion).

### Phase 5: Quality Check & Use-Case Optimization

After enhancement:
1. Verify output quality (no new artifacts, colors preserved)
2. Optimize for target use case:

| Use Case | Max Resolution | Format | Notes |
|----------|---------------|--------|-------|
| Web | 2048px longest side | WebP or PNG | Compress for fast loading |
| Print | 300 DPI at print size | PNG or TIFF | Maximize resolution |
| Social media | Platform-specific | JPG or PNG | See platform dimensions in `references/enhancement.md` |

Read `references/output-delivery.md` for format selection and file naming.

### Phase 6: Delivery

1. Present before/after comparison:
   - Original dimensions → Enhanced dimensions
   - Quality improvements noted
   - File size comparison
2. Offer further options:
   - "Want to upscale further?"
   - "Need a different output format?"
   - "Should I optimize for a specific platform?"

---

## Validation Gates

- [ ] Source image assessed for quality
- [ ] Enhancement plan determined
- [ ] Correct model selected
- [ ] Enhancement executed successfully
- [ ] Output quality verified (no new artifacts)
- [ ] Output optimized for target use case
- [ ] Before/after comparison presented

---

## Important Notes

- Always denoise BEFORE upscaling — upscaling amplifies noise
- SeedVR2 produces more natural results for faces and organic textures
- ESRGAN is better for batch/speed scenarios
- FAL image URLs expire after 24 hours — download immediately
- Save enhanced images with `enhanced-` prefix in the filename
