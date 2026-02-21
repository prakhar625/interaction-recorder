# Phase 8: Video Assembly

Composite raw recordings + assets into the final polished video.
Primary path: Remotion. Fallback: ffmpeg-only (with reduced features).

⛔ **BEFORE STARTING**: Verify these gates passed:
- ALL segment .mp4 files exist in recordings/
- ALL narration .wav files exist in assets/narration/
- Start/end card PNGs exist in assets/cards/
- Sound effect WAVs exist in assets/sounds/
- Background music WAV exists in assets/music/
- timing-manifest.json exists
- Remotion project installed and verified in Phase 5

## Assembly Pipeline

```
                    ┌─ start-card.png (animated via TitleCard component)
recordings/ ────────┤─ segment-*.mp4 + narration WAVs + action manifests
assets/ ────────────┤─ end-card.png (animated via TitleCard component)
                    ├─ click.wav, transition.wav
                    ├─ ambient-loop.wav
                    └─ timing-manifest.json
                            │
                    ┌───────┴───────┐
                    │   Remotion    │  ← PRIMARY PATH (renders everything)
                    │  Composition  │
                    └───────┬───────┘
                            │
                    npx remotion render
                            │
                    ┌───────┴───────┐
                    │  ffmpeg post  │  ← compression + thumbnail only
                    └───────┬───────┘
                            │
                      demo.mp4 + demo-thumbnail.png
```

## Step 1: Validate All Inputs

```javascript
const fs = require('fs');
const { execSync } = require('child_process');

function validateInputs(workspace) {
  const timing = JSON.parse(fs.readFileSync(`${workspace}/timing-manifest.json`));
  const errors = [];

  for (const seg of timing.segments) {
    const idx = String(seg.index).padStart(2, '0');
    const videoPath = `${workspace}/recordings/segment-${idx}.mp4`;
    const narrationPath = `${workspace}/${seg.narration_file}`;

    if (!fs.existsSync(videoPath)) {
      errors.push(`Missing video: segment-${idx}.mp4`);
    }
    if (!fs.existsSync(narrationPath)) {
      errors.push(`Missing narration: ${seg.narration_file}`);
    } else {
      // Validate audio format
      const info = execSync(
        `ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels -of csv=p=0 "${narrationPath}"`
      ).toString().trim();
      if (!info.includes('44100') || !info.includes('2')) {
        errors.push(`Audio format wrong for ${seg.narration_file}: ${info}`);
      }
    }
  }

  // Check required assets
  const required = [
    'assets/cards/start-card.png',
    'assets/cards/end-card.png',
    'assets/sounds/click.wav',
    'assets/sounds/transition.wav',
    'assets/music/ambient-loop.wav',
  ];
  for (const f of required) {
    if (!fs.existsSync(`${workspace}/${f}`)) {
      errors.push(`Missing: ${f}`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach(e => console.error(`  - ${e}`));
    return false;
  }
  console.log('✅ All inputs validated');
  return true;
}
```

## Step 2: Build Composition Config

Generate a JSON config that the Remotion DemoVideo component reads:

```javascript
function buildCompositionConfig(workspace, config) {
  const timing = JSON.parse(fs.readFileSync(`${workspace}/timing-manifest.json`));
  const fps = 30;
  const transitionFrames = Math.round((config.visual?.transition_duration_ms || 300) / 1000 * fps);

  let currentFrame = 0;
  const segments = [];

  // Start card
  const startCardFrames = (config.start_card?.duration_seconds || 3) * fps;

  // Build segment timeline
  for (const seg of timing.segments) {
    const idx = String(seg.index).padStart(2, '0');
    let manifest = { actions: [] };
    const manifestPath = `${workspace}/recordings/segment-${idx}-manifest.json`;
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath));
    }

    const durationFrames = Math.ceil(seg.target_recording_duration_seconds * fps);

    segments.push({
      id: `segment-${idx}`,
      title: seg.title,
      videoFile: `recordings/segment-${idx}.mp4`,
      narrationFile: `assets/narration/segment-${idx}.wav`,
      narrationDuration: seg.narration_duration_seconds,
      startFrame: startCardFrames + currentFrame,
      durationFrames,
      actions: manifest.actions || [],
    });

    currentFrame += durationFrames;
  }

  // End card
  const endCardFrames = (config.end_card?.duration_seconds || 3) * fps;
  const totalFrames = startCardFrames + currentFrame + endCardFrames;

  const compositionConfig = {
    fps,
    width: 1920,
    height: 1080,
    totalFrames,
    startCard: {
      imageFile: 'assets/cards/start-card.png',
      title: config.start_card?.title || '',
      subtitle: config.start_card?.subtitle || '',
      durationFrames: startCardFrames,
    },
    endCard: {
      imageFile: 'assets/cards/end-card.png',
      title: config.end_card?.text || 'Thanks for watching',
      startFrame: startCardFrames + currentFrame,
      durationFrames: endCardFrames,
    },
    segments,
    transitionDurationFrames: transitionFrames,
    sounds: {
      click: 'assets/sounds/click.wav',
      transition: 'assets/sounds/transition.wav',
      success: 'assets/sounds/success.wav',
    },
    backgroundMusic: config.background_music?.enabled !== false ? {
      file: 'assets/music/ambient-loop.wav',
      volume: config.background_music?.volume || 0.08,
      duckUnderNarration: config.background_music?.duck_under_narration ?? true,
    } : null,
    visual: {
      background_colors: config.visual?.background_colors || ['#080a0e', '#0c1118', '#101420'],
      accent_color: config.design_tokens?.accent_color || '#3ee8b5',
      click_zoom: config.recording?.click_zoom ?? true,
      click_zoom_level: config.recording?.click_zoom_level || 1.3,
      annotations: config.visual?.annotations ?? true,
      browser_frame_style: config.recording?.browser_frame_style || 'minimal',
    },
  };

  const outPath = `${workspace}/remotion/src/composition-config.json`;
  fs.writeFileSync(outPath, JSON.stringify(compositionConfig, null, 2));
  console.log(`✅ Composition config: ${outPath} (${totalFrames} frames, ${(totalFrames/fps).toFixed(1)}s)`);
  return compositionConfig;
}
```

## Step 3: Write Remotion Components

Copy starter components from `assets/remotion-templates/` into `remotion/src/components/`.
Then write the main composition files:

### Root.tsx

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';
import compositionConfig from './composition-config.json';

export const Root: React.FC = () => (
  <Composition
    id="DemoVideo"
    component={DemoVideo}
    durationInFrames={compositionConfig.totalFrames}
    fps={compositionConfig.fps}
    width={compositionConfig.width}
    height={compositionConfig.height}
    defaultProps={{ config: compositionConfig }}
  />
);
```

### DemoVideo.tsx (Main Composition)

This is the core component that layers everything together. Copy it exactly.

```tsx
import React from 'react';
import {
  AbsoluteFill, Sequence, Audio, Img, Video,
  useCurrentFrame, useVideoConfig, interpolate, staticFile
} from 'remotion';
import { BrowserFrame } from './components/BrowserFrame';
import { ClickZoomOverlay } from './components/ClickZoomOverlay';
import { AnnotationOverlay } from './components/AnnotationOverlay';
import { FadeTransition, TitleCard } from './components/FadeTransition';
import { GradientBackground } from './components/GradientBackground';

export const DemoVideo: React.FC<{ config: any }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>

      {/* ═══ Layer 1: Animated Gradient Background ═══ */}
      <GradientBackground
        colors={config.visual.background_colors}
        style="linear"
      />

      {/* ═══ Layer 2: Animated Start Card ═══ */}
      <Sequence durationInFrames={config.startCard.durationFrames}>
        <TitleCard
          title={config.startCard.title}
          subtitle={config.startCard.subtitle}
          bgColor="transparent"
          accentColor={config.visual.accent_color}
          durationFrames={config.startCard.durationFrames}
        />
      </Sequence>

      {/* ═══ Layer 3: Content Segments ═══ */}
      {config.segments.map((seg: any, i: number) => (
        <Sequence
          key={seg.id}
          from={seg.startFrame}
          durationInFrames={seg.durationFrames}
        >
          {/* Fade in transition */}
          <FadeTransition durationFrames={config.transitionDurationFrames}>

            {/* Browser frame wrapping the recording */}
            <BrowserFrame style={config.visual.browser_frame_style}>

              {/* Click zoom overlay wrapping the video */}
              {config.visual.click_zoom ? (
                <ClickZoomOverlay
                  actions={seg.actions}
                  zoomLevel={config.visual.click_zoom_level}
                >
                  <Video
                    src={staticFile(seg.videoFile)}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </ClickZoomOverlay>
              ) : (
                <Video
                  src={staticFile(seg.videoFile)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}

            </BrowserFrame>

          </FadeTransition>

          {/* Narration audio — synced by construction */}
          <Audio src={staticFile(seg.narrationFile)} volume={0.9} />

          {/* Transition sound at segment start (skip first segment) */}
          {i > 0 && config.sounds?.transition && (
            <Audio src={staticFile(config.sounds.transition)} volume={0.15} />
          )}
        </Sequence>
      ))}

      {/* ═══ Layer 4: Animated End Card ═══ */}
      <Sequence
        from={config.endCard.startFrame}
        durationInFrames={config.endCard.durationFrames}
      >
        <TitleCard
          title={config.endCard.title}
          bgColor="transparent"
          accentColor={config.visual.accent_color}
          durationFrames={config.endCard.durationFrames}
        />
        {/* Success chime on end card */}
        {config.sounds?.success && (
          <Audio src={staticFile(config.sounds.success)} volume={0.2} />
        )}
      </Sequence>

      {/* ═══ Layer 5: Background Music (full duration, ducked) ═══ */}
      {config.backgroundMusic && (
        <Audio
          src={staticFile(config.backgroundMusic.file)}
          volume={(f: number) => {
            if (!config.backgroundMusic.duckUnderNarration) {
              return config.backgroundMusic.volume;
            }
            const isNarrationActive = config.segments.some((seg: any) => {
              const segStart = seg.startFrame;
              const segEnd = segStart + Math.ceil(seg.narrationDuration * fps);
              return f >= segStart && f < segEnd;
            });
            return isNarrationActive
              ? config.backgroundMusic.volume * 0.3
              : config.backgroundMusic.volume;
          }}
          loop
        />
      )}

      {/* ═══ Layer 6: Click Sounds ═══ */}
      {config.sounds?.click && config.segments.flatMap((seg: any) =>
        seg.actions
          .filter((a: any) => a.type === 'click')
          .map((action: any, ai: number) => (
            <Sequence
              key={`${seg.id}-click-${ai}`}
              from={seg.startFrame + Math.round((action.timestamp_ms / 1000) * fps)}
              durationInFrames={fps}
            >
              <Audio src={staticFile(config.sounds.click)} volume={0.12} />
            </Sequence>
          ))
      )}

    </AbsoluteFill>
  );
};
```

## Step 4: Copy Assets and Symlink

Remotion serves static files from `public/`. Ensure symlinks exist:

```bash
cd "${WORKSPACE}/remotion"
# Remove old symlinks if they exist
rm -f public/recordings public/assets

# Create symlinks
ln -sf "${WORKSPACE}/recordings" public/recordings
ln -sf "${WORKSPACE}/assets" public/assets

echo "✅ Symlinks created in remotion/public/"
ls -la public/
```

## Step 5: Test Render

Always test with a single frame before the full render:

```bash
cd "${WORKSPACE}/remotion"

echo "Testing render (single frame)..."
npx remotion still DemoVideo --frame=0 --output=../output/test-frame.png 2>&1

if [ $? -ne 0 ]; then
  echo "❌ Remotion test frame failed. Checking errors..."
  npx remotion still DemoVideo --frame=0 --output=../output/test-frame.png 2>&1 | tail -20
  echo ""
  echo "⚠️ Falling back to ffmpeg-only assembly."
  echo "The Asker will be warned about degraded quality."
  # → Jump to FALLBACK section below
else
  echo "✅ Test frame rendered successfully"
  echo "Proceeding to full render..."
fi
```

## Step 6: Full Render

```bash
cd "${WORKSPACE}/remotion"

echo "Rendering full video (this may take several minutes)..."
npx remotion render DemoVideo \
  --output=../output/demo-raw.mp4 \
  --codec=h264 \
  --crf=18 \
  --fps=30 \
  2>&1 | tail -30

if [ $? -ne 0 ]; then
  echo "❌ Remotion render failed. Falling back to ffmpeg."
  # → Jump to FALLBACK section below
else
  echo "✅ Remotion render complete"
fi
```

## Step 7: Post-Processing (ffmpeg)

After Remotion render, compress and generate thumbnail:

```bash
WORKSPACE="/absolute/path/to/interaction-recorder-workspace"

# Compress for sharing
ffmpeg -y -i "${WORKSPACE}/output/demo-raw.mp4" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 192k -ar 44100 -ac 2 \
  -movflags +faststart \
  "${WORKSPACE}/output/demo.mp4" 2>&1 | tail -3

# Generate thumbnail (5 seconds in, past start card)
ffmpeg -y -i "${WORKSPACE}/output/demo.mp4" \
  -ss 00:00:05 -vframes 1 \
  "${WORKSPACE}/output/demo-thumbnail.png" 2>/dev/null

# Remove raw render
rm -f "${WORKSPACE}/output/demo-raw.mp4"

# Report
FINAL_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${WORKSPACE}/output/demo.mp4")
FINAL_SIZE=$(ls -lh "${WORKSPACE}/output/demo.mp4" | awk '{print $5}')
HAS_VIDEO=$(ffprobe -v error -select_streams v -show_entries stream=codec_name -of csv=p=0 "${WORKSPACE}/output/demo.mp4")
HAS_AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "${WORKSPACE}/output/demo.mp4")

echo ""
echo "════════════════════════════════════════"
echo "  ASSEMBLY COMPLETE"
echo "════════════════════════════════════════"
echo "  Output:     output/demo.mp4"
echo "  Duration:   ${FINAL_DUR}s"
echo "  Size:       ${FINAL_SIZE}"
echo "  Video:      ${HAS_VIDEO}"
echo "  Audio:      ${HAS_AUDIO}"
echo "════════════════════════════════════════"
```

### Quality presets

| Config quality | CRF | Preset | Audio bitrate |
|---------------|-----|--------|--------------|
| draft | 28 | fast | 128k |
| balanced | 23 | medium | 192k |
| high | 18 | slow | 256k |

---

## FALLBACK: ffmpeg-Only Assembly

If Remotion render fails, fall back to ffmpeg. **ALWAYS warn the Asker:**

> "⚠️ Remotion render failed. Using ffmpeg-only fallback.
> Missing features: click-zoom, spring-animated annotations, animated title cards,
> proper rounded browser frame. The video will have a simpler browser overlay and
> basic fade transitions."

```bash
#!/bin/bash
# ffmpeg-only fallback assembly
WORKSPACE="$1"
cd "$WORKSPACE" || exit 1

echo "⚠️ Running ffmpeg-only fallback (degraded quality)"

FPS=30
TIMING=$(cat timing-manifest.json)

# Browser frame dimensions (centered, 90% scale)
FRAME_X=48; FRAME_Y=32; FRAME_W=1824; FRAME_H=1016
TITLEBAR_H=36
CONTENT_W=$FRAME_W; CONTENT_H=$((FRAME_H - TITLEBAR_H))
CONTENT_X=$FRAME_X; CONTENT_Y=$((FRAME_Y + TITLEBAR_H))

# Step 1: Start card video (from static image, 3 seconds)
ffmpeg -y -loop 1 -i assets/cards/start-card.png \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -c:v libx264 -t 3 -pix_fmt yuv420p -r $FPS \
  -c:a aac -b:a 192k -shortest \
  output/start-card.mp4 2>/dev/null || { echo "❌ Start card failed"; exit 1; }
echo "  ✅ Start card"

# Step 2: Process each segment — browser frame + narration
for seg_file in recordings/segment-*.mp4; do
  seg=$(basename "$seg_file" .mp4)
  narr_file="assets/narration/${seg}.wav"

  if [ ! -f "$narr_file" ]; then
    echo "  ⚠️ Missing narration for $seg, using silence"
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$seg_file")
    ffmpeg -y -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=44100" \
      -t "$dur" -c:a pcm_s16le "$narr_file" 2>/dev/null
  fi

  # Add browser frame overlay + gradient background
  ffmpeg -y -i "$seg_file" \
    -filter_complex "\
      [0:v]scale=${CONTENT_W}:${CONTENT_H}:force_original_aspect_ratio=decrease,\
      pad=${CONTENT_W}:${CONTENT_H}:(ow-iw)/2:(oh-ih)/2:color=0x0c0e12[scaled];\
      color=c=0x080a0e:s=1920x1080:d=999:r=${FPS},\
      drawbox=x=0:y=540:w=1920:h=540:color=0x0c1118@1:t=fill,\
      drawbox=x=${FRAME_X}:y=${FRAME_Y}:w=${FRAME_W}:h=${FRAME_H}:color=0x0c0e12@1:t=fill,\
      drawbox=x=${FRAME_X}:y=${FRAME_Y}:w=${FRAME_W}:h=1:color=0x262a34@1:t=fill,\
      drawbox=x=${FRAME_X}:y=$((FRAME_Y+FRAME_H)):w=${FRAME_W}:h=1:color=0x262a34@1:t=fill,\
      drawbox=x=${FRAME_X}:y=${FRAME_Y}:w=1:h=${FRAME_H}:color=0x262a34@1:t=fill,\
      drawbox=x=$((FRAME_X+FRAME_W)):y=${FRAME_Y}:w=1:h=${FRAME_H}:color=0x262a34@1:t=fill,\
      drawbox=x=${FRAME_X}:y=${FRAME_Y}:w=${FRAME_W}:h=${TITLEBAR_H}:color=0x13161c@1:t=fill,\
      drawbox=x=${FRAME_X}:y=$((FRAME_Y+TITLEBAR_H)):w=${FRAME_W}:h=1:color=0x262a34@1:t=fill,\
      drawtext=text='●':fontsize=14:fontcolor=0xef4444:x=$((FRAME_X+16)):y=$((FRAME_Y+11)),\
      drawtext=text='●':fontsize=14:fontcolor=0xf0a830:x=$((FRAME_X+36)):y=$((FRAME_Y+11)),\
      drawtext=text='●':fontsize=14:fontcolor=0x3ee8b5:x=$((FRAME_X+56)):y=$((FRAME_Y+11))\
      [bg];\
      [bg][scaled]overlay=${CONTENT_X}:${CONTENT_Y}:shortest=1[out]" \
    -map "[out]" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r $FPS -an \
    "output/framed-${seg}.mp4" 2>/dev/null || { echo "❌ Framing failed: ${seg}"; continue; }

  # Merge framed video + narration audio
  ffmpeg -y -i "output/framed-${seg}.mp4" -i "$narr_file" \
    -c:v copy -c:a aac -b:a 192k -ar 44100 -shortest \
    "output/merged-${seg}.mp4" 2>/dev/null || { echo "❌ Merge failed: ${seg}"; continue; }

  echo "  ✅ ${seg}"
done

# Step 3: End card video
ffmpeg -y -loop 1 -i assets/cards/end-card.png \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -c:v libx264 -t 3 -pix_fmt yuv420p -r $FPS \
  -c:a aac -b:a 192k -shortest \
  output/end-card.mp4 2>/dev/null || { echo "❌ End card failed"; }
echo "  ✅ End card"

# Step 4: Concatenate
> /tmp/concat_list.txt
echo "file '${WORKSPACE}/output/start-card.mp4'" >> /tmp/concat_list.txt
for f in output/merged-segment-*.mp4; do
  echo "file '${WORKSPACE}/$f'" >> /tmp/concat_list.txt
done
echo "file '${WORKSPACE}/output/end-card.mp4'" >> /tmp/concat_list.txt

ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 192k -ar 44100 -ac 2 \
  -movflags +faststart \
  output/demo.mp4 2>&1 | tail -3

# Step 5: Mix in background music
if [ -f "assets/music/ambient-loop.wav" ]; then
  DEMO_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 output/demo.mp4 | cut -d. -f1)
  ffmpeg -y -i output/demo.mp4 \
    -stream_loop -1 -i assets/music/ambient-loop.wav \
    -filter_complex "[1:a]volume=0.06,afade=t=in:d=2,afade=t=out:st=$((DEMO_DUR-2)):d=2[music];\
    [0:a][music]amix=2:duration=first:dropout_transition=2[aout]" \
    -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k \
    output/demo-with-music.mp4 2>/dev/null
  mv output/demo-with-music.mp4 output/demo.mp4
  echo "  ✅ Background music mixed"
fi

# Step 6: Thumbnail + cleanup
ffmpeg -y -i output/demo.mp4 -ss 5 -vframes 1 output/demo-thumbnail.png 2>/dev/null
rm -f output/start-card.mp4 output/end-card.mp4 output/framed-*.mp4 output/merged-*.mp4

echo "✅ Fallback assembly complete (ffmpeg-only, no zoom/annotations/animated transitions)"
```

---

## Chunked Output

If scope is "chunks", render each chunk separately. Create a separate Remotion
composition per chunk, or use ffmpeg to extract individual segments from the full render.

If `combine_chunks` is true, also produce a combined version.

## Troubleshooting

**Remotion render fails**:
- First try `npx remotion still DemoVideo --frame=0` for a quick test
- Check all `staticFile()` paths resolve — run `ls remotion/public/recordings/`
- Verify symlinks are not broken: `ls -la remotion/public/`
- Check Node version (18+ required)
- Check Remotion error output for specific component issues

**Audio/video sync issues**:
- Should not happen with audio-first architecture
- If it does: verify timing-manifest.json durations match actual WAV durations
- Check segment mp4 durations vs targets (within ±2s)

**Black frames or missing video**:
- `ffprobe segment-01.mp4` to check validity
- Ensure Video component src matches actual file location
- Verify webm→mp4 conversion succeeded

**Large file sizes**:
- Increase CRF (higher = smaller, lower quality)
- Use `preset fast` for drafts
- Background music adds ~1MB per minute

## Output

```
output/
├── demo.mp4              # Final compressed video
├── demo-thumbnail.png    # Thumbnail at 5s mark
└── chunks/               # (if chunks mode)
    ├── chunk-01.mp4
    └── ...
```
