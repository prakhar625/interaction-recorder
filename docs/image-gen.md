# Image Gen

**Generate, edit, and enhance images with FAL AI — directly from Claude Code.**

Supports 13 models across text-to-image, image editing, and upscaling with intelligent model selection, prompt optimization, and iterative workflows.

---

## What This Does

Describe what you want and get production-quality images. The skill handles model selection, prompt engineering, API calls, and file delivery.

**Three workflows:**

| Workflow | What it does | Trigger |
|----------|-------------|---------|
| **Generate** | Create new images from text descriptions | "generate an image of...", `/generate` |
| **Edit** | Transform existing images (style, background, text, etc.) | "edit this image to...", `/edit-image` |
| **Enhance** | Upscale and improve image quality | "upscale this image", `/enhance-image` |

**Key features:**
- **Intelligent model selection** — auto-picks the best model for your task
- **Prompt optimization** — crafts model-specific prompts for optimal results
- **Reference image analysis** — extracts style from inspirational images
- **13 models** — from fast drafts to premium quality, including text rendering
- **Iterative workflow** — refine results through prompt adjustments, model switching, and parameter tuning

---

## Installation

### Plugin (Recommended)

In Claude Code:

```
/plugin marketplace add prakhar625/my-plugins
/plugin install my-plugins@image-gen
```

Restart Claude Code after installing.

### Manual

```bash
git clone https://github.com/prakhar625/my-plugins.git
cp -r my-plugins/plugins/image-gen ~/.claude/plugins/
```

Then enable it in Claude Code with `/plugin`.

---

## Setup

### FAL API Key (Required)

1. Create an account at [fal.ai](https://fal.ai)
2. Generate an API key at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
3. Set it in your environment:

```bash
export FAL_KEY="your-key-here"
```

Or add to your project's `.env` file:

```
FAL_KEY=your-key-here
```

The plugin will automatically load the key from `.env` on session start.

---

## Usage

### Generate Images

```
Generate a photorealistic mountain landscape at golden hour
```

```
Create a minimalist logo for a coffee shop called "Brew & Bean"
```

```
/generate a futuristic cityscape in cyberpunk style
```

### Edit Images

```
Edit ./photo.jpg to look like a watercolor painting
```

```
Change the background of this image to a tropical beach
```

```
/edit-image — make the text on the sign say "OPEN 24/7"
```

### Enhance Images

```
Upscale ./low-res.png to 4K resolution
```

```
Enhance this photo for print at 8x10 inches
```

```
/enhance-image for web delivery
```

### List Models

```
/image-models
```

---

## Available Models

### Generation (Text-to-Image)

| Model | Best For | Price |
|-------|----------|-------|
| Google Imagen 4 | Fine details, diverse styles | Check fal.ai |
| Imagen 4 Ultra | Maximum quality | Check fal.ai |
| Grok Imagine (xAI) | Cinematic, aesthetic | Check fal.ai |
| Seedream v4.5 (ByteDance) | Fast, versatile, unified T2I+edit | $0.04/img |
| Nano Banana (Google) | Solid quality | Check fal.ai |
| Nano Banana Pro (Google) | Text rendering, reasoning-guided | $0.15/img |
| FLUX.2 [pro] | Studio-grade, zero-config | $0.03/MP |
| FLUX.2 [dev] | LoRA custom styles | $0.012/MP |
| FLUX.2 Flash | Sub-second speed | $0.005/MP |
| FLUX.2 [klein] | Fast drafts, budget | $0.009/MP |

### Upscaling

| Model | Best For | Price |
|-------|----------|-------|
| SeedVR2 | Quality upscaling, natural textures | $0.001/MP |
| ESRGAN | Fast upscaling (2x/4x) | ~$0.001/MP |

### Quick Guide

- **Best quality**: Nano Banana Pro or Imagen 4 Ultra
- **Fastest**: FLUX.2 Flash
- **Best value**: Seedream v4.5
- **Text in images**: Nano Banana Pro
- **Cinematic**: Grok Imagine
- **Custom styles**: FLUX.2 [dev] with LoRA

You can request a specific model: "generate using Grok Imagine..."

---

## Commands

| Command | Description |
|---------|-------------|
| `/generate` | Quick text-to-image generation |
| `/edit-image` | Edit an existing image |
| `/enhance-image` | Upscale and enhance an image |
| `/image-models` | List all available models |

---

## Output

Generated images are saved to `./output/image-gen/` with the naming convention:

```
image-gen-{model}-{timestamp}.png
edit-{model}-{timestamp}.png
enhanced-{model}-{timestamp}.png
```

---

## Architecture

The plugin includes:
- **3 skills**: image-gen (T2I), image-edit (I2I), image-enhance (upscaling)
- **2 agents**: prompt-architect (prompt optimization), image-analyst (reference image analysis)
- **4 commands**: /generate, /edit-image, /enhance-image, /image-models
- **8 reference docs**: model catalog, prompt engineering, workflows, auth, output conventions
- **1 script**: fal-submit.sh (reusable FAL API submit/poll/download)
- **1 hook**: FAL_KEY validation on session start

---

## Requirements

- FAL AI API key (`FAL_KEY`)
- `curl` and `jq` (for the FAL submit script)
- Internet access (for FAL API calls)
