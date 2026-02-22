# Model Catalog

Complete reference for all supported FAL AI image generation, editing, and enhancement models.

---

## Generation Models (Text-to-Image + Image-to-Image)

### Google Imagen 4

Google's latest image generation model with enhanced detail, richer lighting, and fewer artifacts.

- **Endpoint**: `fal-ai/imagen4/preview`
- **Capabilities**: T2I
- **Best for**: High-quality images, fine details and textures, diverse art styles from photorealism to animation
- **Prompt style**: Natural language, detailed descriptions
- **Negative prompt**: Supported (`negative_prompt` parameter)
- **Parameters**:
  - `prompt` (required): Text description
  - `aspect_ratio`: Image aspect ratio
  - `negative_prompt`: What to avoid
  - `seed`: Reproducible generation
- **Pricing**: Check fal.ai for current pricing

### Google Imagen 4 Ultra

Google's highest quality image generation model.

- **Endpoint**: `fal-ai/imagen4/preview/ultra`
- **Capabilities**: T2I
- **Best for**: Maximum quality output, premium use cases
- **Prompt style**: Natural language, detailed descriptions
- **Negative prompt**: Supported
- **Parameters**: Same as Imagen 4
- **Pricing**: Premium tier — check fal.ai
- **Note**: Preview endpoint — may have availability fluctuations

### Grok Imagine Image (xAI)

xAI's highly aesthetic image generation model with cinematic quality.

- **T2I Endpoint**: `xai/grok-imagine-image`
- **I2I/Edit Endpoint**: `xai/grok-imagine-image/edit`
- **Capabilities**: T2I, I2I (editing)
- **Best for**: Cinematic images, believable lighting, coherent body language, stylized generations
- **Prompt style**: Natural language, aesthetic focus
- **Parameters**:
  - `prompt` (required): Text description
  - `image_size`: Output dimensions
  - `num_images`: Number of images to generate
  - `seed`: Reproducible generation
  - `enable_safety_checker`: Boolean
- **Pricing**: Check fal.ai for current pricing

### ByteDance Seedream v4.5

ByteDance's latest unified image generation and editing model.

- **T2I Endpoint**: `fal-ai/bytedance/seedream/v4.5/text-to-image`
- **Edit Endpoint**: `fal-ai/bytedance/seedream/v4.5/edit`
- **Capabilities**: T2I, I2I (editing), multi-reference (up to 10 images)
- **Best for**: Photorealistic images, unified generation + editing, fast inference (2-3s)
- **Max Resolution**: 4 megapixels (2048x2048)
- **Prompt style**: Natural language, 30-100 words. Avoid overly long prompts.
- **Parameters**:
  - `prompt` (required): Text description
  - `image_size`: Output dimensions (up to 2048x2048)
  - `guidance_scale`: 7-9 recommended (>10 causes oversaturation and artifacts)
  - `num_images`: Number to generate
  - `seed`: Reproducible generation
  - `enable_safety_checker`: Boolean
  - Edit: `image_urls` (array) — up to 10 reference images
- **Pricing**: $0.04 per image

### ByteDance Seedream v4

Previous generation Seedream — still capable, supports higher resolution.

- **T2I Endpoint**: `fal-ai/bytedance/seedream/v4/text-to-image`
- **Edit Endpoint**: `fal-ai/bytedance/seedream/v4/edit`
- **Capabilities**: T2I, I2I (editing)
- **Max Resolution**: Up to 4K
- **Parameters**: `prompt`, `image_size`, `max_images`, `sync_mode`, `enable_safety_checker`
- **Pricing**: $0.04 per image

### Google Nano Banana

Google's image generation and editing model.

- **T2I Endpoint**: `fal-ai/nano-banana`
- **Edit Endpoint**: `fal-ai/nano-banana/edit`
- **Capabilities**: T2I, I2I (editing)
- **Best for**: Solid quality image generation, reliable editing
- **Prompt style**: Natural language
- **Parameters**:
  - `prompt` (required): Text description
  - `seed`: Reproducible generation
- **Output**: `images` array with `url`, `file_name`, `content_type`

### Google Nano Banana Pro (Nano Banana 2)

Google's premium reasoning-guided image generation model built on Gemini 3 Pro + GemPix 2.

- **T2I Endpoint**: `fal-ai/nano-banana-pro`
- **Edit Endpoint**: `fal-ai/nano-banana-pro/edit`
- **Capabilities**: T2I, I2I (editing)
- **Best for**: Perfect text rendering, complex scene composition, visual reasoning, production-quality visuals
- **Architecture**: Gemini 3.0 Pro (reasoning) + GemPix 2 (rendering)
- **Key advantage**: Reasoning-guided synthesis — understands spatial relationships and physical properties before rendering
- **Prompt style**: Natural language with reasoning context
- **Parameters**:
  - `prompt` (required): Text description
  - `seed`: Reproducible generation
- **Pricing**: $0.15 per image (commercial use)

### FLUX.2 [pro]

Black Forest Labs' premium zero-configuration image generator (32B parameters).

- **Endpoint**: `fal-ai/flux-2-pro`
- **Capabilities**: T2I
- **Best for**: Studio-grade images, zero-config production pipeline, built-in typography
- **Prompt style**: Natural language + JSON prompting for granular control
- **Negative prompt**: Not needed (prompt enhancement enabled by default)
- **Parameters**:
  - `prompt` (required): Text or JSON prompt
  - `image_size`: Aspect ratio/dimensions
  - `seed`: Reproducible generation
  - `num_images`: Up to 4
  - `enable_safety_checker`: Boolean
- **Special**: Automatic prompt enhancement, JSON prompting for scene elements/camera settings
- **Pricing**: $0.03 per megapixel

### FLUX.2 [dev]

Open-source FLUX.2 with LoRA training support.

- **T2I Endpoint**: `fal-ai/flux-2`
- **LoRA Endpoint**: `fal-ai/flux-2/lora`
- **Capabilities**: T2I, LoRA fine-tuning
- **Best for**: Custom styles via LoRA, open-source flexibility, brand-consistent generation
- **Prompt style**: Natural language + JSON prompting
- **Parameters**:
  - `prompt` (required): Text description
  - `image_size`: Aspect ratio/dimensions
  - `num_inference_steps`: Quality tuning (default ~28)
  - `guidance_scale`: Prompt adherence
  - `seed`: Reproducible generation
  - LoRA: `lora_url`, `lora_scale`
- **Pricing**: $0.012 per megapixel (LoRA: $0.021/MP)

### FLUX.2 Flash

Speed-optimized FLUX.2 via timestep distillation.

- **T2I Endpoint**: `fal-ai/flux-2/flash`
- **Edit Endpoint**: `fal-ai/flux-2/flash/edit`
- **Capabilities**: T2I, I2I (editing)
- **Best for**: Sub-second generation, rapid iteration, high-volume production, real-time applications
- **Prompt style**: Natural language
- **Parameters**:
  - `prompt` (required): Text description
  - `image_size`: e.g. `"square_hd"`
  - `num_images`: Number to generate
  - `enable_safety_checker`: Boolean
  - `seed`: Reproducible generation
  - Edit: `image_urls` (array), `guidance_scale`
- **Speed**: Sub-second at standard resolutions
- **Pricing**: $0.005 per megapixel (~58% cheaper than FLUX.2 dev)

### FLUX.2 [klein]

Lightweight 4-billion parameter FLUX.2 model.

- **Base T2I Endpoint**: `fal-ai/flux-2/klein/4b/base`
- **Distilled T2I Endpoint**: `fal-ai/flux-2/klein/4b/distilled`
- **Edit Endpoint**: `fal-ai/flux-2/klein/4b/edit`
- **LoRA Endpoints**: `fal-ai/flux-2/klein/4b/base/lora`, `fal-ai/flux-2/klein/4b/base/edit/lora`
- **9B Variants**: `fal-ai/flux-2/klein/9b/base` (larger, higher quality)
- **Capabilities**: T2I, I2I (editing), LoRA
- **Best for**: Fast drafts, sub-second inference, budget-conscious generation
- **Parameters**:
  - `prompt` (required): Text description
  - `image_size`: e.g. `"landscape_4_3"` (default width: 512)
  - `guidance_scale`: Default 5 for edit
  - `num_inference_steps`: Default 28 for edit (no effect on distilled)
  - `negative_prompt`: Supported
  - `seed`: Reproducible generation
  - `enable_safety_checker`: Boolean
- **Pricing**: $0.009 per megapixel (base), $0.014/MP (distilled)
- **Note**: Distilled variant ignores step/guidance params (fixed during distillation)

---

## Upscaling / Enhancement Models

### SeedVR2

ByteDance's high-quality image upscaler with exceptional texture detail.

- **Endpoint**: `fal-ai/seedvr/upscale/image`
- **Video Endpoint**: `fal-ai/seedvr/upscale/video`
- **Capabilities**: Image upscaling, video upscaling
- **Best for**: High-quality upscaling with natural texture detail, realistic skin/material rendering
- **Input formats**: jpg, jpeg, png, webp, gif, avif
- **Parameters**:
  - `image_url` (required): Source image URL or base64
- **Quality**: Exceptional fine textures, lifelike color and tone preservation
- **Pricing**: $0.001 per megapixel

### ESRGAN

Fast general-purpose image upscaler.

- **Endpoint**: `fal-ai/esrgan`
- **Capabilities**: Image upscaling (2x, 4x)
- **Best for**: Quick upscaling, batch processing, when speed matters more than peak quality
- **Parameters**:
  - `image_url` (required): Source image URL or base64
  - `scale`: Upscale factor (2 or 4, default: 2)
- **Pricing**: ~$0.001 per megapixel

---

## Model Selection Decision Tree

```
User wants to...
├── Generate a new image (T2I)
│   ├── Highest quality? → Nano Banana Pro or Imagen 4 Ultra
│   ├── Fast/cheap draft? → FLUX.2 Flash or FLUX.2 [klein]
│   ├── Production quality? → FLUX.2 [pro] or Seedream v4.5
│   ├── Text in image? → Nano Banana Pro or FLUX.2 [pro]
│   ├── Cinematic/aesthetic? → Grok Imagine Image
│   ├── Custom style (LoRA)? → FLUX.2 [dev] LoRA
│   └── User specifies model → Use that model
│
├── Edit an existing image (I2I)
│   ├── General edit? → Seedream v4.5 /edit
│   ├── Aesthetic transform? → Grok Imagine /edit
│   ├── Fast edit? → FLUX.2 Flash /edit
│   └── User specifies model → Use that model
│
└── Upscale/enhance an image
    ├── Quality priority? → SeedVR2
    └── Speed priority? → ESRGAN
```
