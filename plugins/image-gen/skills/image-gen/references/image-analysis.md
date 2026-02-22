# Image Analysis Guide

How to analyze inspirational or reference images to extract reusable style attributes for prompt construction.

---

## Goal

When the user provides a reference image, extract a structured style profile that feeds into the prompt-architect agent for accurate style replication.

## Prerequisites

- [ ] Reference image is accessible (local file path or URL)
- [ ] Image can be viewed by Claude (supported format: PNG, JPG, WebP, GIF)

## Analysis Process

### Step 1: Visual Inspection

Read the image file using Claude's vision capabilities. Analyze systematically:

1. **Subject**: What is the primary subject? Secondary elements?
2. **Composition**: Rule of thirds? Centered? Symmetrical? Leading lines?
3. **Perspective**: Eye-level, bird's eye, worm's eye, isometric?
4. **Framing**: Close-up, medium shot, wide shot, panoramic?

### Step 2: Style Classification

Classify the image into one or more categories:

| Category | Indicators |
|----------|-----------|
| **Photorealistic** | Natural lighting, lens effects (bokeh, flare), realistic textures |
| **Illustration** | Visible strokes/lines, stylized proportions, flat or textured fills |
| **3D Render** | Perfect surfaces, ray-traced lighting, CGI quality |
| **Abstract** | Non-representational, geometric, color-field |
| **Minimalist** | Limited palette, simple shapes, negative space |
| **Vintage/Retro** | Film grain, faded colors, period-specific design |
| **Anime/Manga** | Japanese animation style, large eyes, cel shading |
| **Pixel Art** | Visible pixels, limited palette, blocky |
| **Watercolor** | Soft edges, color bleeding, paper texture |
| **Oil Painting** | Visible brushstrokes, rich color, impasto texture |

### Step 3: Technical Attributes

Extract measurable qualities:

- **Color palette**: Dominant colors (list 3-5 hex values), warm/cool/neutral, saturation level
- **Lighting**: Direction, quality (soft/hard), color temperature, shadows (harsh/soft)
- **Contrast**: High/medium/low
- **Depth of field**: Shallow (blurred background) / deep (everything sharp)
- **Noise/grain**: Present? Film-like? Digital?
- **Resolution quality**: Sharp/soft, artifact presence
- **Dynamic range**: High (HDR-like) or standard

### Step 4: Mood & Atmosphere

- **Emotional tone**: Cheerful, moody, dramatic, serene, energetic, mysterious
- **Time of day** (if applicable): Dawn, morning, noon, golden hour, dusk, night
- **Weather/environment** (if applicable): Clear, overcast, rainy, foggy, snowy
- **Energy level**: Calm, dynamic, chaotic, meditative

## Output Format: Style Profile

Structure the analysis as a style profile that the prompt-architect can consume:

```markdown
## Style Profile

**Subject**: [Main subject description]
**Style**: [Category from classification]
**Medium**: [Photographic / Digital illustration / Watercolor / etc.]

**Composition**:
- Layout: [Rule of thirds / centered / etc.]
- Perspective: [Eye-level / bird's eye / etc.]
- Framing: [Close-up / medium / wide]

**Color**:
- Dominant: [Color 1], [Color 2], [Color 3]
- Temperature: [Warm / Cool / Neutral]
- Saturation: [High / Medium / Low]

**Lighting**:
- Direction: [Top-left / natural / rim / etc.]
- Quality: [Soft / Hard / Mixed]
- Color temp: [Warm golden / Cool blue / Neutral]

**Mood**: [Emotional description]
**Detail level**: [Highly detailed / Clean minimal / Textured]

**Technical notes**:
- [Any specific techniques: lens type, film stock, brush style, etc.]
```

## Translating Analysis to Prompt Elements

| Style Profile Field | Prompt Translation |
|--------------------|-------------------|
| Style: Photorealistic | "photorealistic, photograph, natural lighting" |
| Medium: Watercolor | "watercolor painting on textured paper, soft bleeding edges" |
| Lighting: Warm golden, soft | "warm golden hour lighting, soft diffused shadows" |
| Color: Desaturated, cool | "muted color palette, cool blue tones, low saturation" |
| Mood: Moody, dramatic | "dramatic atmosphere, moody lighting, high contrast" |
| Detail: Highly detailed | "intricate details, highly detailed, sharp focus" |
| Composition: Centered | "centered composition, symmetrical framing" |

## Common Issues

- **Multiple styles**: If the image blends styles, note all of them and let the prompt-architect decide emphasis
- **Low-quality reference**: Note artifacts or quality issues so they're not replicated
- **Text in image**: Note any text content, fonts, and placement — relevant for models with text rendering support
- **Ambiguous style**: When uncertain, describe what you see literally rather than categorizing
