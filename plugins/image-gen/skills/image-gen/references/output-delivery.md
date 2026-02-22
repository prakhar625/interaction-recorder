# Output Delivery

Output format selection, file naming, directory structure, and delivery conventions.

---

## Output Directory

All generated images are saved to:

```
./output/image-gen/
```

Create it if it doesn't exist:
```bash
mkdir -p ./output/image-gen
```

## File Naming Convention

```
image-gen-{model-short}-{timestamp}.{ext}
```

### Model Short Names

| Model | Short Name |
|-------|-----------|
| Google Imagen 4 | `imagen4` |
| Google Imagen 4 Ultra | `imagen4ultra` |
| Grok Imagine Image | `grok` |
| Seedream v4.5 | `seedream45` |
| Seedream v4 | `seedream4` |
| Nano Banana | `nanobanana` |
| Nano Banana Pro | `nanabananapro` |
| FLUX.2 [pro] | `flux2pro` |
| FLUX.2 [dev] | `flux2dev` |
| FLUX.2 Flash | `flux2flash` |
| FLUX.2 [klein] | `flux2klein` |
| SeedVR2 | `seedvr2` |
| ESRGAN | `esrgan` |

### Timestamp Format

`YYYYMMDD-HHmmss` in local time.

### Examples

```
image-gen-flux2pro-20260222-143052.png
image-gen-seedream45-20260222-143055.png
image-gen-grok-20260222-143100.jpg
image-gen-seedvr2-20260222-143110.png
```

### Edited Images

For I2I edits, prefix with `edit-`:
```
edit-seedream45-20260222-143120.png
edit-flux2flash-20260222-143125.png
```

### Enhanced Images

For upscaled/enhanced images, prefix with `enhanced-`:
```
enhanced-seedvr2-20260222-143130.png
enhanced-esrgan-20260222-143135.png
```

## Format Selection

| Format | When to Use | Quality | File Size |
|--------|------------|---------|-----------|
| **PNG** | Default, transparency needed, lossless quality | Best | Largest |
| **JPG** | Photography, web delivery, size-constrained | Good | Smallest |
| **WebP** | Web-optimized, modern browsers | Very good | Small |

### Decision Tree

```
Need transparency? → PNG
Need smallest file? → JPG (quality 85-90)
Web delivery? → WebP (quality 85-90)
Print/archival? → PNG
Default → PNG
```

## Download and Save

After getting the image URL from FAL's response:

```bash
# Download the generated image
IMAGE_URL=$(echo "$RESULT" | jq -r '.images[0].url')
OUTPUT_PATH="./output/image-gen/image-gen-${MODEL_SHORT}-$(date +%Y%m%d-%H%M%S).png"

curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"
echo "Saved to: $OUTPUT_PATH"
```

### Format Conversion

If the API returns a format different from what's needed:

```bash
# PNG to JPG (with quality control)
ffmpeg -i input.png -quality 90 output.jpg

# PNG to WebP
ffmpeg -i input.png -quality 85 output.webp

# Any to PNG (lossless)
ffmpeg -i input.jpg output.png
```

## Delivery to User

When presenting the generated image:

1. **Show the image**: Use the file path so Claude can display it
2. **Report metadata**:
   - Model used
   - Prompt (or summary)
   - Dimensions
   - File size
   - File path
3. **Offer next steps**:
   - "Want to generate variations?"
   - "Should I adjust the prompt and try again?"
   - "Want to upscale this to a higher resolution?"
   - "Need a different format (JPG, WebP)?"

### Example Delivery Message

```
Generated your image using FLUX.2 [pro]:

📁 ./output/image-gen/image-gen-flux2pro-20260222-143052.png
📐 1024×576 (landscape 16:9)
📦 1.2 MB (PNG)

Would you like to:
- Generate more variations with different seeds?
- Adjust the prompt for a different style?
- Upscale to higher resolution?
```

## File Size Considerations

| Resolution | PNG (approx) | JPG 90% | WebP 85% |
|-----------|-------------|---------|----------|
| 512×512 | 300-500 KB | 50-100 KB | 40-80 KB |
| 1024×1024 | 1-2 MB | 200-400 KB | 150-300 KB |
| 2048×2048 | 4-8 MB | 500 KB-1 MB | 400-800 KB |
| 4096×4096 | 15-30 MB | 1-3 MB | 1-2 MB |

## CDN URL Expiration

FAL image URLs expire after **24 hours**. Always download immediately:

```bash
# CORRECT: Download right after generation
curl -s -o "output.png" "$IMAGE_URL"

# WRONG: Save the URL for later
echo "$IMAGE_URL" > url.txt  # URL will expire!
```

## Multiple Images

When generating multiple images (num_images > 1):

```bash
# Save each image with an index
IMAGES=$(echo "$RESULT" | jq -r '.images[].url')
INDEX=1
for URL in $IMAGES; do
  OUTPUT="./output/image-gen/image-gen-${MODEL_SHORT}-$(date +%Y%m%d-%H%M%S)-${INDEX}.png"
  curl -s -o "$OUTPUT" "$URL"
  echo "Saved: $OUTPUT"
  INDEX=$((INDEX + 1))
done
```
