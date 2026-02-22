# Prompt Engineering Guide

Per-model-family prompt crafting strategies for optimal image generation results.

---

## General Principles

1. **Be specific**: "a golden retriever puppy playing in autumn leaves" beats "a dog"
2. **Include style cues**: Mention artistic medium, lighting, mood, composition
3. **Specify technical details** when relevant: camera lens, f-stop, film stock, resolution
4. **Order matters**: Lead with subject, then style, then technical details
5. **Match prompt length to model**: Some models work better with concise prompts, others with detailed ones

---

## FLUX.2 Family (Pro, Dev, Flash, Klein)

### Prompt Style: Natural Language + JSON Prompting

FLUX.2 excels with detailed natural language descriptions. The Pro variant also supports JSON prompting for granular control.

**Do:**
- Write in complete, descriptive sentences
- Describe the scene, lighting, mood, and composition
- Use JSON prompting (Pro) for precise scene control
- Include artistic style references when relevant

**Don't:**
- Use keyword spam (e.g., "4k, ultra HD, masterpiece, best quality")
- Rely on negative prompts (FLUX.2 Pro doesn't need them)
- Write extremely long prompts for Flash/Klein (keep concise for speed models)

### Natural Language Example

```
A serene mountain lake at golden hour, with snow-capped peaks reflected in
perfectly still water. Pine forests line the shore. Soft warm light creates
long shadows. Shot on medium format film with rich color depth.
```

### JSON Prompt Example (FLUX.2 Pro)

```json
{
  "scene": "modern minimalist office workspace",
  "subject": "MacBook Pro on a clean white desk",
  "lighting": "soft natural window light from the left",
  "style": "product photography, editorial",
  "camera": "85mm f/2.8, shallow depth of field",
  "mood": "clean, professional, aspirational"
}
```

### Klein/Flash (Speed Models)

Keep prompts shorter (30-60 words) for optimal speed:
```
A red fox in a snowy forest, soft morning light filtering through trees,
photorealistic, detailed fur texture
```

---

## Seedream (v4.5, v4)

### Prompt Style: Focused Natural Language (30-100 words)

Seedream works best with detailed but focused prompts. Overly long prompts can confuse the model.

**Do:**
- Keep prompts between 30-100 words
- Be precise about what you want
- Include style, lighting, and composition cues
- Use `guidance_scale` between 7-9

**Don't:**
- Write extremely verbose prompts (>100 words)
- Set `guidance_scale` above 10 (causes oversaturation and edge artifacts)
- Stack redundant descriptors

### Example

```
A young woman sitting at a Parisian cafe, reading a worn leather-bound book.
Morning sunlight streaming through the window creates warm golden highlights
on her hair. Shallow depth of field, the background softly blurred with hints
of other patrons. Photorealistic, natural skin tones, editorial photography style.
```

### Edit Prompts (Seedream)

For the `/edit` endpoint, describe the desired change:
```
Change the background to a tropical beach at sunset. Keep the subject
and their pose exactly the same.
```

---

## Google Imagen 4 / Imagen 4 Ultra

### Prompt Style: Natural Language, Detail-Oriented

Imagen 4 excels at capturing fine details and textures with natural language prompts.

**Do:**
- Describe fine details and textures you want
- Specify art style (photorealism, animation, watercolor, etc.)
- Include composition and framing instructions
- Use `negative_prompt` to exclude unwanted elements

**Don't:**
- Use keyword-only prompts
- Assume the model knows your intent — be explicit

### Example

```
A detailed close-up of a mechanical pocket watch with visible gears and springs,
sitting on a weathered wooden surface. Warm afternoon light creates soft shadows
and golden reflections on the brass components. Every gear tooth and spring coil
is sharp and detailed. Photorealistic, macro photography, shallow depth of field.
```

---

## Grok Imagine Image (xAI)

### Prompt Style: Cinematic, Aesthetic Focus

Grok Imagine produces highly cinematic images with natural lighting and coherent body language.

**Do:**
- Describe cinematic qualities (lighting, framing, mood)
- Reference film/photography techniques
- Focus on atmosphere and emotion
- Include character/subject descriptions for people

**Don't:**
- Use overly technical or keyword-heavy prompts
- Ignore lighting descriptions (this model excels at lighting)

### Example

```
A lone figure standing on a rain-soaked city street at night, neon signs
reflected in puddles. Cinematic wide shot, anamorphic lens flare from a
distant streetlight. The figure wears a long dark coat, face partially
illuminated by the warm glow of a phone screen. Film noir atmosphere,
desaturated with selective warm highlights.
```

---

## Google Nano Banana / Nano Banana Pro

### Prompt Style: Natural Language with Reasoning Context

Nano Banana Pro uses reasoning-guided synthesis — it understands spatial relationships and physical properties.

**Do:**
- Describe spatial relationships explicitly
- Include text you want rendered in the image (Pro has excellent text rendering)
- Describe physical properties and materials
- For editing: describe the exact transformation needed

**Don't:**
- Use vague spatial descriptions
- Forget that Pro can handle complex multi-element scenes

### Text Rendering Example (Nano Banana Pro)

```
A vintage-style travel poster for Tokyo featuring Mount Fuji in the background.
Bold text at the top reads "TOKYO" in an art deco font. Below, smaller text reads
"The Gateway to the East". Cherry blossom branches frame the sides. Warm sunset
color palette with deep oranges and purples.
```

### Edit Example

```
Replace the text on the coffee cup with "Good Morning" in a handwritten script font.
Keep everything else exactly the same.
```

---

## Use-Case Prompt Templates

### Photography

```
[Subject description]. Shot on [camera body] with [lens focal length] at [f-stop].
[Lighting setup — e.g., natural window light, studio strobe, golden hour].
[Film stock or digital processing style]. [Composition — rule of thirds, centered, etc.].
```

### Illustration / Digital Art

```
[Subject] in the style of [artistic medium — watercolor, oil painting, vector, etc.].
[Color palette — warm, cool, monochromatic, etc.]. [Mood/atmosphere].
[Level of detail — minimalist, highly detailed, etc.]. [Background description].
```

### Product Photography

```
[Product name] on [surface/background]. [Lighting — soft box, rim light, natural].
Clean [white/dark/gradient] background. [Angle — 45-degree, overhead, eye-level].
Sharp focus, [style — editorial, catalog, lifestyle].
```

### Diagrams / Technical

```
A [type of diagram — flowchart, architecture diagram, mind map] showing [content].
Clean lines, [color scheme — monochrome, blue/gray, colorful]. Clear labels for
each [node/component/step]. Professional, minimal style. White background.
```

### Icons / UI Elements

```
A [style — flat, 3D, glassmorphism, skeuomorphic] icon of [subject].
[Color — single color, gradient, multicolor]. [Size context — app icon, toolbar].
Clean edges, [background — transparent, rounded square]. Modern design language.
```

---

## Negative Prompt Guide

Only some models support negative prompts. When supported, use them to exclude:

### Common Negative Prompt Elements

```
blurry, low quality, distorted, deformed, ugly, duplicate, watermark, text,
signature, out of frame, cropped, bad anatomy, extra limbs, disfigured,
overexposed, underexposed, noise, grain
```

### Model Support

| Model | Negative Prompt |
|-------|----------------|
| FLUX.2 [pro] | Not needed (auto-enhancement) |
| FLUX.2 [dev] | Not officially documented |
| FLUX.2 [klein] | Supported (`negative_prompt` param) |
| Seedream v4.5 | Check API docs |
| Imagen 4 | Supported (`negative_prompt` param) |
| Grok Imagine | Check API docs |
| Nano Banana Pro | Check API docs |

---

## Parameter Recommendations by Use Case

| Use Case | guidance_scale | num_inference_steps | image_size |
|----------|---------------|-------------------|------------|
| Web graphic | 7-8 | 20-25 | `landscape_16_9` or `square_hd` |
| Print poster | 8-10 | 28-40 | Largest available |
| Social media | 7-8 | 20-28 | `square_hd` or `portrait_4_3` |
| Icon/logo | 7-8 | 25-30 | `square` or `square_hd` |
| Quick draft | 5-7 | 8-15 | `square` |
| Product photo | 8-9 | 28-35 | Varies by platform |
