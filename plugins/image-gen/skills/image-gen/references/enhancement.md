# Image Enhancement & Upscaling

Guide for upscaling, denoising, sharpening, and optimizing images for specific use cases.

---

## Overview

Enhancement workflows improve existing image quality without changing content. Primary operations: upscaling (increase resolution), denoising (reduce noise/grain), and sharpening (increase perceived detail).

## Prerequisites

- [ ] Source image exists and is accessible
- [ ] Source image quality has been assessed
- [ ] FAL_KEY is configured

## Available Enhancement Models

### SeedVR2 — High-Quality Upscaler

- **Endpoint**: `fal-ai/seedvr/upscale/image`
- **Best for**: Maximum quality upscaling with exceptional texture detail
- **Strengths**: Realistic skin rendering, natural color/tone preservation, fine texture enhancement
- **Input formats**: jpg, jpeg, png, webp, gif, avif
- **Pricing**: $0.001 per megapixel
- **When to use**: Quality is the priority, final output for print/presentation

### ESRGAN — Fast Upscaler

- **Endpoint**: `fal-ai/esrgan`
- **Best for**: Quick upscaling, batch processing
- **Scale options**: 2x, 4x (default: 2)
- **Pricing**: ~$0.001 per megapixel
- **When to use**: Speed matters, bulk processing, intermediate upscale

## Enhancement Pipeline

The recommended order for multiple operations:

```
1. Denoise (if needed)     → Remove noise before upscaling amplifies it
2. Upscale                 → Increase resolution
3. Sharpen (if needed)     → Enhance edges after upscaling
```

**Critical**: Always denoise BEFORE upscaling. Upscaling amplifies noise.

## Phase 1: Input Analysis

Assess the source image quality:

1. **Resolution**: What are the current dimensions?
2. **Noise level**: Is there visible noise or grain?
3. **Sharpness**: Are edges crisp or soft?
4. **Artifacts**: Compression artifacts (JPEG blocking), banding, haloing?
5. **Dynamic range**: Blown highlights or crushed shadows?

### Quality Assessment Checklist

```
Source: [filename]
Dimensions: [width]x[height]
File size: [size]
Format: [format]
Noise: [none / light / moderate / heavy]
Sharpness: [sharp / acceptable / soft / blurry]
Artifacts: [none / minor JPEG / significant]
Overall: [good / needs enhancement / poor]
```

## Phase 2: Enhancement Plan

Based on the assessment, determine operations:

| Issue | Operation | Tool |
|-------|-----------|------|
| Low resolution | Upscale 2x or 4x | SeedVR2 or ESRGAN |
| Noise/grain | Denoise | (handled by upscaler implicitly) |
| Soft/blurry | Upscale → sharpen | SeedVR2 (adds natural detail) |
| JPEG artifacts | Upscale (removes artifacts) | SeedVR2 |
| Need specific dimensions | Upscale → resize | Upscaler → ffmpeg/ImageMagick |

## Phase 3: Execution

### SeedVR2 Upscaling

```bash
./scripts/fal-submit.sh "fal-ai/seedvr/upscale/image" \
  '{"image_url": "https://example.com/source.jpg"}' \
  "./output/image-gen/seedvr2-upscaled.png"
```

### ESRGAN Upscaling

```bash
# 2x upscale
./scripts/fal-submit.sh "fal-ai/esrgan" \
  '{"image_url": "https://example.com/source.jpg", "scale": 2}' \
  "./output/image-gen/esrgan-2x.png"

# 4x upscale
./scripts/fal-submit.sh "fal-ai/esrgan" \
  '{"image_url": "https://example.com/source.jpg", "scale": 4}' \
  "./output/image-gen/esrgan-4x.png"
```

### Post-Processing with ffmpeg (if needed)

```bash
# Sharpen after upscaling
ffmpeg -i upscaled.png -vf "unsharp=5:5:1.0:5:5:0.0" sharpened.png

# Resize to specific dimensions
ffmpeg -i upscaled.png -vf "scale=3840:2160:flags=lanczos" resized-4k.png

# Convert format
ffmpeg -i upscaled.png -quality 90 output.jpg
```

## Phase 4: Use-Case Optimization

### Web (Screen Display)

- **Max resolution**: 2048px on longest side (larger wastes bandwidth)
- **Format**: WebP (best compression) or PNG (transparency needed)
- **Compression**: WebP quality 80-90, or PNG with `optipng`
- **Target file size**: <500KB for most web images

```bash
# Optimize for web
ffmpeg -i upscaled.png -vf "scale='min(2048,iw)':'min(2048,ih)':force_original_aspect_ratio=decrease" -quality 85 web-output.webp
```

### Print

- **Target**: 300 DPI at print size
- **Formula**: `pixels = print_inches × 300`
- **Format**: PNG or TIFF (lossless)
- **Example**: 8×10 inch print needs 2400×3000 pixels minimum

```bash
# Check if resolution is sufficient for print
# 8x10 at 300 DPI = 2400x3000
# If source is 1200x1500, need 2x upscale
```

### Social Media Platform Dimensions

| Platform | Recommended Size | Aspect Ratio |
|----------|-----------------|--------------|
| Instagram Post | 1080×1080 | 1:1 |
| Instagram Story | 1080×1920 | 9:16 |
| Twitter/X Post | 1200×675 | 16:9 |
| LinkedIn Post | 1200×627 | ~2:1 |
| Facebook Post | 1200×630 | ~2:1 |
| YouTube Thumbnail | 1280×720 | 16:9 |

## Phase 5: Quality Check

After enhancement, verify:

- [ ] Output resolution matches target
- [ ] No new artifacts introduced
- [ ] Colors and tones preserved from original
- [ ] Text (if present) is still readable
- [ ] File size is appropriate for use case
- [ ] Format is correct for intended use

### Before/After Comparison

Present the original and enhanced images side by side:
- Note resolution change (e.g., "512×512 → 2048×2048")
- Note quality improvements (e.g., "Noise removed, edges sharpened")
- Note file size change

## Error Handling

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| Output looks worse | Over-processing | Try SeedVR2 (more natural) |
| Artifacts in faces | Upscaler hallucination | Try different model |
| Color shift | Model bias | Compare with original, adjust |
| File too large | Over-upscaled | Resize down to needed dimensions |
| Blurry after upscale | Source too degraded | Upscale less aggressively (2x not 4x) |

## Validation Gate

- [ ] Source image quality assessed
- [ ] Enhancement plan determined
- [ ] Correct model selected for the task
- [ ] Enhancement executed successfully
- [ ] Output quality verified (no new artifacts)
- [ ] Output optimized for target use case
- [ ] Before/after comparison presented to user
