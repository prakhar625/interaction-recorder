# Text-to-Image Workflow

Detailed guide for the T2I generation pipeline — from intent parsing to file delivery.

---

## Phase 1: Intent Parsing

Extract these elements from the user's request:

| Element | Question | Default |
|---------|----------|---------|
| **Subject** | What to generate? | (required — ask if missing) |
| **Style** | What visual style? | Photorealistic |
| **Purpose** | What's it for? (web, print, social, icon) | General use |
| **Dimensions** | What size/aspect ratio? | `landscape_16_9` |
| **Model preference** | Did user specify a model? | Auto-select |
| **Quantity** | How many images? | 1 |
| **Reference images** | Any inspirational images? | None |

If the user's request is vague, ask clarifying questions:
- "What style are you looking for? (photorealistic, illustration, minimalist, etc.)"
- "What will this be used for? (web graphic, poster, social media, icon)"
- "Any specific dimensions or aspect ratio?"

## Phase 2: Model Routing

Use this decision tree (full details in `model-catalog.md`):

```
User specified a model?
├── Yes → Use that model
└── No → Auto-select:
    ├── Needs text in image? → Nano Banana Pro
    ├── Highest quality? → Imagen 4 Ultra or Nano Banana Pro
    ├── Cinematic/aesthetic? → Grok Imagine Image
    ├── Fast draft? → FLUX.2 Flash
    ├── Budget-conscious? → FLUX.2 [klein] or Flash
    ├── Custom style (LoRA)? → FLUX.2 [dev] LoRA
    └── Default production → FLUX.2 [pro] or Seedream v4.5
```

## Phase 3: Parameter Defaults by Use Case

| Use Case | Recommended Model | image_size | guidance_scale | steps |
|----------|------------------|------------|---------------|-------|
| **Web graphic** | FLUX.2 [pro] | `landscape_16_9` | 7-8 | 25 |
| **Print poster** | Imagen 4 Ultra | Largest | 8-10 | 30+ |
| **Social media** | Seedream v4.5 | `square_hd` | 7-9 | default |
| **App icon** | Nano Banana Pro | `square` | 7-8 | default |
| **Quick draft** | FLUX.2 Flash | `square` | default | default |
| **Product photo** | FLUX.2 [pro] | varies | 8-9 | 30 |
| **Logo concept** | Nano Banana Pro | `square_hd` | 7-8 | default |
| **Diagram** | FLUX.2 [pro] | varies | 8 | 28 |

## Phase 4: FAL API Call Construction

### Using the fal-submit.sh Script

```bash
# Arguments: endpoint, payload_json, output_path
./scripts/fal-submit.sh "fal-ai/flux-2-pro" \
  '{"prompt":"A serene mountain lake at golden hour","image_size":"landscape_16_9","num_images":1}' \
  "./output/image-gen/flux2pro-mountain-lake.png"
```

### Direct curl (for reference)

```bash
# Step 1: Submit to queue
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain lake at golden hour",
    "image_size": "landscape_16_9",
    "num_images": 1
  }' \
  "https://queue.fal.run/fal-ai/flux-2-pro")

REQUEST_ID=$(echo "$RESPONSE" | jq -r '.request_id')

# Step 2: Poll for completion
while true; do
  STATUS=$(curl -s \
    -H "Authorization: Key ${FAL_KEY}" \
    "https://queue.fal.run/fal-ai/flux-2-pro/requests/${REQUEST_ID}/status")

  STATE=$(echo "$STATUS" | jq -r '.status')
  [ "$STATE" = "COMPLETED" ] && break
  [ "$STATE" = "FAILED" ] && { echo "Generation failed"; exit 1; }
  sleep 2
done

# Step 3: Get result
RESULT=$(curl -s \
  -H "Authorization: Key ${FAL_KEY}" \
  "https://queue.fal.run/fal-ai/flux-2-pro/requests/${REQUEST_ID}")

IMAGE_URL=$(echo "$RESULT" | jq -r '.images[0].url')

# Step 4: Download
curl -s -o "output.png" "$IMAGE_URL"
```

## Phase 5: Response Handling

The FAL API returns a JSON response. Key fields:

```json
{
  "images": [
    {
      "url": "https://fal.media/files/...",
      "width": 1024,
      "height": 576,
      "content_type": "image/png"
    }
  ],
  "seed": 42,
  "has_nsfw_concepts": false,
  "prompt": "original prompt"
}
```

- Image URLs are hosted on FAL's CDN — valid for 24 hours
- Download immediately after generation for permanent storage
- Check `has_nsfw_concepts` if safety checker was enabled

## Phase 6: File Saving

Save to `./output/image-gen/` with naming convention:
```
image-gen-{model-short}-{timestamp}.{ext}
```

Examples:
- `image-gen-flux2pro-20260222-143052.png`
- `image-gen-imagen4-20260222-143052.png`
- `image-gen-seedream45-20260222-143052.png`

See `output-delivery.md` for full output format details.

## Error Handling

| Error | Action |
|-------|--------|
| 401 Unauthorized | Check FAL_KEY — see `fal-auth.md` |
| 402 Payment Required | Check billing — see `fal-auth.md` |
| 404 Not Found | Verify endpoint ID in `model-catalog.md` |
| 422 Unprocessable Entity | Check payload format (invalid params) |
| 429 Rate Limited | Retry with exponential backoff (2s, 4s, 8s, 16s) |
| 500 Server Error | Retry once, then try alternative model |
| Timeout (>60s) | Retry once, then try faster model (Flash/Klein) |

## Validation Gate

- [ ] Model selected and endpoint confirmed
- [ ] Prompt constructed (via prompt-architect if complex)
- [ ] Parameters set per use case
- [ ] FAL_KEY verified
- [ ] Output directory exists
- [ ] Image generated and downloaded successfully
- [ ] File saved with correct naming convention
