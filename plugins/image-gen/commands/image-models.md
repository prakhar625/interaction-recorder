---
command: image-models
description: List all available FAL AI image generation models and their capabilities
disable-model-invocation: true
---

# /image-models

Display all available FAL AI image generation, editing, and enhancement models with their
capabilities, endpoints, and pricing.

## Before Starting

1. Read `references/model-catalog.md` for the complete model database

## Execution

Present the model catalog in a clear, scannable format:

### Generation Models (Text-to-Image)

| Model | Endpoint | Best For | Price |
|-------|----------|----------|-------|
| Google Imagen 4 | `fal-ai/imagen4/preview` | High-quality, fine details | Check fal.ai |
| Imagen 4 Ultra | `fal-ai/imagen4/preview/ultra` | Maximum quality | Check fal.ai |
| Grok Imagine | `xai/grok-imagine-image` | Cinematic, aesthetic | Check fal.ai |
| Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/text-to-image` | Fast, unified T2I+edit | $0.04/img |
| Nano Banana | `fal-ai/nano-banana` | Solid quality | Check fal.ai |
| Nano Banana Pro | `fal-ai/nano-banana-pro` | Text rendering, reasoning | $0.15/img |
| FLUX.2 [pro] | `fal-ai/flux-2-pro` | Studio-grade, zero-config | $0.03/MP |
| FLUX.2 [dev] | `fal-ai/flux-2` | LoRA, open-source | $0.012/MP |
| FLUX.2 Flash | `fal-ai/flux-2/flash` | Sub-second speed | $0.005/MP |
| FLUX.2 [klein] | `fal-ai/flux-2/klein/4b/base` | Fast drafts, 4B params | $0.009/MP |

### Editing Models (Image-to-Image)

| Model | Endpoint | Best For |
|-------|----------|----------|
| Seedream v4.5 | `.../seedream/v4.5/edit` | General edits, multi-ref |
| Grok Imagine | `xai/grok-imagine-image/edit` | Aesthetic transforms |
| FLUX.2 Flash | `fal-ai/flux-2/flash/edit` | Fast edits |
| FLUX.2 [klein] | `fal-ai/flux-2/klein/4b/edit` | Precision edits |
| Nano Banana Pro | `fal-ai/nano-banana-pro/edit` | Text changes |

### Upscaling Models

| Model | Endpoint | Best For | Price |
|-------|----------|----------|-------|
| SeedVR2 | `fal-ai/seedvr/upscale/image` | Quality upscaling | $0.001/MP |
| ESRGAN | `fal-ai/esrgan` | Fast upscaling (2x/4x) | ~$0.001/MP |

### Quick Reference

- **Best quality**: Nano Banana Pro or Imagen 4 Ultra
- **Fastest**: FLUX.2 Flash or FLUX.2 [klein]
- **Best value**: Seedream v4.5 ($0.04/img, fast, good quality)
- **Text in images**: Nano Banana Pro
- **Cinematic**: Grok Imagine
- **Custom styles**: FLUX.2 [dev] LoRA

Use `/generate` to create images, `/edit-image` to edit, `/enhance-image` to upscale.
