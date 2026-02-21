# Phase 6: Asset Generation (BEFORE Recording)

Generate all supplementary assets. Narration is the CRITICAL PATH — its durations
drive the recording pace in Phase 7.

⛔ **MANDATORY ORDER**: Narration → timing-manifest.json → (cards + sounds + music in parallel)
Do NOT start Phase 7 until all assets are generated and validated.

## Execution Order

```
1. Generate narration clips (sequential — each must complete before the next)
     ↓
2. Normalize ALL clips to 44100Hz stereo WAV (immediately after each download)
     ↓
3. Build timing-manifest.json (segment → narration duration mapping)
     ↓  GATE: timing-manifest.json must exist before proceeding
     ↓
4. In parallel:
   ├─ Start card + end card (HTML-rendered via Playwright)
   ├─ Sound effects (click, transition)
   └─ Background music (ambient drone loop)
```

## Audio Format — HARD RULE

**ALL audio in the ENTIRE pipeline must be 44100Hz, stereo, 16-bit PCM WAV.**

This includes: narration clips, silence gaps, sound effects, background music.
Mixing different formats (e.g., 32kHz mono + 44100Hz stereo) produces garbled audio.

Normalize immediately after generation, BEFORE storing:

```bash
# Normalize any audio file to canonical format
normalize_audio() {
  local input="$1"
  local output="$2"
  ffmpeg -y -i "$input" -ar 44100 -ac 2 -c:a pcm_s16le "$output" 2>/dev/null
}
```

In Node.js scripts:
```javascript
const { execSync } = require('child_process');
function normalizeAudio(input, output) {
  execSync(`ffmpeg -y -i "${input}" -ar 44100 -ac 2 -c:a pcm_s16le "${output}" 2>/dev/null`);
}

function validateAudioFormat(filePath) {
  const info = execSync(
    `ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels -of csv=p=0 "${filePath}"`
  ).toString().trim();
  if (!info.includes('44100') || !info.includes('2')) {
    throw new Error(`Audio format wrong for ${filePath}: got ${info}, need 44100,2`);
  }
  return true;
}
```

## API Call Resilience

ALL API calls (TTS, image gen) must use retry with exponential backoff:

```javascript
async function apiCallWithRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`  Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`  Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

---

## 1. Narration (TTS) — CRITICAL PATH

### Narration Script Preparation

From the storyboard (or auto-generated for /record-quick), expand key points into
natural conversational speech:
- Write as if explaining to a colleague
- Keep sentences short and clear
- Add natural pauses (commas, periods) for breathing room
- Each segment's narration should describe what's VISIBLE on screen

### TTS Providers

#### FAL MiniMax Speech-2.8 HD (Recommended)

Requires `FAL_KEY` environment variable.

```javascript
async function generateNarrationFAL(text, outputWavPath) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) throw new Error('FAL_KEY not set');

  const response = await apiCallWithRetry(async () => {
    const resp = await fetch('https://fal.run/fal-ai/minimax/speech-2.8-hd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok) throw new Error(`FAL TTS error ${resp.status}: ${await resp.text()}`);
    return resp.json();
  });

  const audioUrl = response.audio?.url;
  if (!audioUrl) throw new Error('FAL TTS returned no audio URL');

  const audioResp = await fetch(audioUrl);
  const rawBuffer = Buffer.from(await audioResp.arrayBuffer());

  // Save raw, then IMMEDIATELY normalize
  const tempPath = outputWavPath.replace('.wav', '.raw.mp3');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputWavPath);
  fs.unlinkSync(tempPath);

  // Validate format
  validateAudioFormat(outputWavPath);
  return getDuration(outputWavPath);
}
```

#### ElevenLabs (Direct API — NOT through FAL)

Requires `ELEVENLABS_API_KEY`. FAL does NOT route ElevenLabs.

```javascript
async function generateNarrationElevenLabs(text, outputWavPath, voiceId) {
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!API_KEY) throw new Error('ELEVENLABS_API_KEY not set');

  voiceId = voiceId || 'pNInz6obpgDQGcFmaJgB'; // default: Adam
  const response = await apiCallWithRetry(async () => {
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!resp.ok) throw new Error(`ElevenLabs error ${resp.status}`);
    return resp;
  });

  const rawBuffer = Buffer.from(await response.arrayBuffer());
  const tempPath = outputWavPath.replace('.wav', '.raw.mp3');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputWavPath);
  fs.unlinkSync(tempPath);
  validateAudioFormat(outputWavPath);
  return getDuration(outputWavPath);
}
```

#### Local TTS (Fallback)

No API key needed. Lower quality.

**macOS**:
```bash
say -v "Samantha" -o /tmp/segment.aiff "Welcome to the dashboard..."
ffmpeg -y -i /tmp/segment.aiff -ar 44100 -ac 2 -c:a pcm_s16le segment-01.wav 2>/dev/null
```

**Linux** (espeak-ng):
```bash
espeak-ng -w /tmp/segment.wav "Welcome to the dashboard..."
ffmpeg -y -i /tmp/segment.wav -ar 44100 -ac 2 -c:a pcm_s16le segment-01.wav 2>/dev/null
```

### Narration Generation Loop

Generate all clips sequentially, normalize each immediately, build timing manifest:

```javascript
const timingManifest = { segments: [] };

for (let i = 0; i < segments.length; i++) {
  const seg = segments[i];
  const filename = `segment-${String(i + 1).padStart(2, '0')}.wav`;
  const outputPath = path.join(WORKSPACE, 'assets', 'narration', filename);

  console.log(`[${i + 1}/${segments.length}] Generating: ${seg.title}...`);

  let duration;
  try {
    duration = await generateNarration(seg.narration_text, outputPath);
  } catch (error) {
    console.error(`  ❌ TTS failed: ${error.message}. Falling back to local TTS...`);
    duration = await generateNarrationLocal(seg.narration_text, outputPath);
  }

  console.log(`  ✅ ${filename} — ${duration.toFixed(1)}s`);

  timingManifest.segments.push({
    index: i + 1,
    id: `segment-${String(i + 1).padStart(2, '0')}`,
    title: seg.title,
    narration_file: `assets/narration/${filename}`,
    narration_duration_seconds: duration,
    target_recording_duration_seconds: duration + 0.5,
  });
}

fs.writeFileSync(
  path.join(WORKSPACE, 'timing-manifest.json'),
  JSON.stringify(timingManifest, null, 2)
);

const totalDur = timingManifest.segments.reduce((s, seg) => s + seg.narration_duration_seconds, 0);
console.log(`\n✅ Timing manifest written (${segments.length} segments, total narration: ${totalDur.toFixed(1)}s)`);
```

### Helper: Get Duration

```javascript
function getDuration(filePath) {
  const output = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`
  ).toString().trim();
  return parseFloat(output);
}
```

---

## 2. Start & End Cards (NON-OPTIONAL for walkthrough+)

These are generated AFTER narration (can run in parallel with sounds/music).
For walkthrough tier and above, start and end cards are MANDATORY — do not skip them.

### HTML-Rendered Cards (Default for Walkthrough)

Create an HTML page, render it with Playwright as a screenshot.
This gives full control over typography, layout, and styling.

```javascript
async function generateStartCard(config, outputPath) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const bgColors = config.visual?.background_colors || ['#080a0e', '#0c1118', '#101420'];
  const accentColor = config.design_tokens?.accent_color || '#3ee8b5';
  const title = config.start_card?.title || 'Demo';
  const subtitle = config.start_card?.subtitle || '';

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; width:1920px; height:1080px; display:flex;
      justify-content:center; align-items:center;
      background: linear-gradient(135deg, ${bgColors.join(', ')});
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="text-align:center;">
        <div style="width:60px; height:4px; background:${accentColor}; border-radius:2px;
          margin:0 auto 24px;"></div>
        <h1 style="color:#eef0f4; font-size:64px; font-weight:700; margin:0;
          letter-spacing:-1px;">${title}</h1>
        ${subtitle ? `<p style="color:#eef0f4; opacity:0.6; font-size:24px;
          margin-top:16px; max-width:800px;">${subtitle}</p>` : ''}
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: outputPath });
  await browser.close();
  console.log(`✅ Start card: ${outputPath}`);
}

async function generateEndCard(config, outputPath) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const bgColors = config.visual?.background_colors || ['#080a0e', '#0c1118', '#101420'];
  const accentColor = config.design_tokens?.accent_color || '#3ee8b5';
  const text = config.end_card?.text || 'Thanks for watching';
  const cta = config.end_card?.cta || '';

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; width:1920px; height:1080px; display:flex;
      justify-content:center; align-items:center;
      background: linear-gradient(135deg, ${bgColors.join(', ')});
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="text-align:center;">
        <div style="width:60px; height:4px; background:${accentColor}; border-radius:2px;
          margin:0 auto 24px;"></div>
        <h1 style="color:#eef0f4; font-size:48px; font-weight:600; margin:0;">${text}</h1>
        ${cta ? `<p style="color:${accentColor}; font-size:20px;
          margin-top:20px;">${cta}</p>` : ''}
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: outputPath });
  await browser.close();
  console.log(`✅ End card: ${outputPath}`);
}
```

### FAL-Generated Cards (Production Tier)

Use FAL Flux for AI-generated imagery:

```javascript
async function generateCardFAL(prompt, outputPath) {
  const resp = await apiCallWithRetry(async () => {
    const r = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        image_size: { width: 1920, height: 1080 },
        num_images: 1,
      }),
    });
    if (!r.ok) throw new Error(`FAL error: ${r.status}`);
    return r.json();
  });

  const imgUrl = resp.images?.[0]?.url;
  if (!imgUrl) throw new Error('FAL returned no image');
  const imgResp = await fetch(imgUrl);
  fs.writeFileSync(outputPath, Buffer.from(await imgResp.arrayBuffer()));
  console.log(`✅ AI card: ${outputPath}`);
}
```

---

## 3. Sound Effects (NON-OPTIONAL for walkthrough+)

Generate UI sounds via FAL AI models. All output must be normalized to 44100Hz stereo WAV.

### Provider Priority

1. **FAL ElevenLabs SFX v2** (recommended) — `fal-ai/elevenlabs/sound-effects/v2`
2. **FAL Beatoven SFX** — `beatoven/sound-effect-generation`
3. **FAL CassetteAI SFX** — `cassetteai/sound-effects-generator`
4. **ffmpeg synthesis** (fallback if no FAL_KEY)

### FAL ElevenLabs SFX v2 (Primary)

```javascript
async function generateSoundEffect(description, outputWavPath, durationSeconds) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) throw new Error('FAL_KEY not set — will use ffmpeg fallback');

  const response = await apiCallWithRetry(async () => {
    const resp = await fetch('https://fal.run/fal-ai/elevenlabs/sound-effects/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        text: description,
        duration_seconds: durationSeconds || 1.5,
        prompt_influence: 0.3,
      }),
    });
    if (!resp.ok) throw new Error(`FAL SFX error ${resp.status}: ${await resp.text()}`);
    return resp.json();
  });

  const audioUrl = response.audio?.url;
  if (!audioUrl) throw new Error('FAL SFX returned no audio URL');

  const audioResp = await fetch(audioUrl);
  const rawBuffer = Buffer.from(await audioResp.arrayBuffer());
  const tempPath = outputWavPath.replace('.wav', '.raw.mp3');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputWavPath);
  fs.unlinkSync(tempPath);
  validateAudioFormat(outputWavPath);
}
```

### FAL Beatoven SFX (Alternative)

```javascript
async function generateSoundEffectBeatoven(description, outputWavPath, durationSeconds) {
  const response = await apiCallWithRetry(async () => {
    const resp = await fetch('https://fal.run/beatoven/sound-effect-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: description,
        duration: durationSeconds || 2,
        refinement: 40,
        creativity: 10,
      }),
    });
    if (!resp.ok) throw new Error(`Beatoven SFX error ${resp.status}`);
    return resp.json();
  });

  // Note: Beatoven returns 'audio' key with WAV at 44.1kHz
  const audioUrl = response.audio?.url;
  if (!audioUrl) throw new Error('Beatoven SFX returned no audio URL');

  const audioResp = await fetch(audioUrl);
  const rawBuffer = Buffer.from(await audioResp.arrayBuffer());
  const tempPath = outputWavPath.replace('.wav', '.raw.wav');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputWavPath); // Still normalize to ensure 44100Hz stereo
  fs.unlinkSync(tempPath);
  validateAudioFormat(outputWavPath);
}
```

### ffmpeg Synthesis (Fallback — no API key needed)

```bash
SOUNDS_DIR="${WORKSPACE}/assets/sounds"

# Click: short sine burst (subtle, tactile)
ffmpeg -y -f lavfi -i "sine=frequency=1000:duration=0.05" \
  -ar 44100 -ac 2 -c:a pcm_s16le \
  -af "volume=0.3,afade=t=out:st=0.02:d=0.03" \
  "${SOUNDS_DIR}/click.wav" 2>/dev/null

# Transition: soft pink noise sweep
ffmpeg -y -f lavfi -i "anoisesrc=d=0.3:c=pink:a=0.1" \
  -ar 44100 -ac 2 -c:a pcm_s16le \
  -af "afade=t=in:d=0.1,afade=t=out:st=0.15:d=0.15,highpass=f=300,lowpass=f=2000" \
  "${SOUNDS_DIR}/transition.wav" 2>/dev/null

# Success: two-tone chime
ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.15" \
  -f lavfi -i "sine=frequency=1200:duration=0.15" \
  -filter_complex "[0:a]adelay=0|0[a];[1:a]adelay=100|100[b];[a][b]amix=2:duration=longest,\
  volume=0.2,afade=t=out:st=0.1:d=0.15" \
  -ar 44100 -ac 2 -c:a pcm_s16le \
  "${SOUNDS_DIR}/success.wav" 2>/dev/null
```

### Sound Effect Generation (orchestrator)

```javascript
async function generateAllSounds(workspace, config) {
  const SOUNDS_DIR = path.join(workspace, 'assets', 'sounds');

  const sounds = [
    { name: 'click', prompt: 'Clean subtle UI button click, digital interface tap sound, minimal and crisp', duration: 0.5 },
    { name: 'transition', prompt: 'Soft gentle whoosh transition sound, brief page turn sweep, subtle and clean', duration: 0.8 },
    { name: 'success', prompt: 'Pleasant two-tone success chime notification, positive achievement sound, short and subtle', duration: 1.0 },
  ];

  for (const sound of sounds) {
    const outPath = path.join(SOUNDS_DIR, `${sound.name}.wav`);
    try {
      await generateSoundEffect(sound.prompt, outPath, sound.duration);
      console.log(`  ✅ ${sound.name}.wav (FAL AI)`);
    } catch (error) {
      console.error(`  ⚠️ FAL SFX failed for ${sound.name}: ${error.message}. Using ffmpeg fallback.`);
      // Fall back to ffmpeg synthesis (run the bash commands above)
    }
  }

  // Write sound map
  fs.writeFileSync(path.join(SOUNDS_DIR, 'sound-map.json'), JSON.stringify({
    click: 'assets/sounds/click.wav',
    transition: 'assets/sounds/transition.wav',
    success: 'assets/sounds/success.wav',
  }, null, 2));
}
```

Validate: `ffprobe -v error -show_entries stream=sample_rate,channels -of csv=p=0 click.wav`
should output `44100,2`.

---

## 4. Background Music (NON-OPTIONAL for walkthrough+)

Generate ambient background music via FAL AI. Keep it very low volume and unobtrusive.

### Provider Priority

1. **FAL Beatoven Music** (recommended) — `beatoven/music-generation` (up to 2.5 minutes, copyright-safe)
2. **FAL CassetteAI Music** — `cassetteai/music-generator` (up to 3 minutes, very fast)
3. **FAL Stable Audio 2.5** — `fal-ai/stable-audio-25/text-to-audio` (up to 3+ minutes)
4. **ffmpeg synthesis** (fallback if no FAL_KEY)

### FAL Beatoven Music (Primary)

```javascript
async function generateBackgroundMusic(workspace, config) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) throw new Error('FAL_KEY not set — will use ffmpeg fallback');

  const MUSIC_DIR = path.join(workspace, 'assets', 'music');
  const outputPath = path.join(MUSIC_DIR, 'ambient-loop.wav');

  // Determine music style from config
  const stylePrompts = {
    ambient: 'Calm ambient background music for a software demo video, subtle and unobtrusive, lo-fi electronic texture, no prominent melody, gentle warmth, suitable for looping',
    upbeat: 'Light upbeat background music for a tech product demo, positive energy, clean electronic beats, not too busy, suitable for looping',
    minimal: 'Minimal ambient texture for a professional software walkthrough, barely there background atmosphere, very subtle, suitable for looping',
  };
  const style = config.background_music?.style || 'ambient';
  const prompt = config.background_music?.prompt || stylePrompts[style] || stylePrompts.ambient;

  const response = await apiCallWithRetry(async () => {
    const resp = await fetch('https://fal.run/beatoven/music-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        duration: 60,       // 60 seconds — will be looped in Remotion
        refinement: 80,
        creativity: 12,
      }),
    });
    if (!resp.ok) throw new Error(`Beatoven Music error ${resp.status}: ${await resp.text()}`);
    return resp.json();
  });

  // Beatoven returns 'audio' key with WAV at 44.1kHz
  const audioUrl = response.audio?.url;
  if (!audioUrl) throw new Error('Beatoven Music returned no audio URL');

  const audioResp = await fetch(audioUrl);
  const rawBuffer = Buffer.from(await audioResp.arrayBuffer());
  const tempPath = outputPath.replace('.wav', '.raw.wav');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputPath);
  fs.unlinkSync(tempPath);
  validateAudioFormat(outputPath);
  console.log(`✅ Background music: ambient-loop.wav (FAL Beatoven)`);
}
```

### FAL CassetteAI Music (Alternative — faster)

```javascript
async function generateBackgroundMusicCassette(workspace, config) {
  const prompt = config.background_music?.prompt ||
    'Calm ambient lo-fi electronic background music, subtle texture, suitable for software demo';

  const response = await apiCallWithRetry(async () => {
    const resp = await fetch('https://fal.run/cassetteai/music-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        duration: 60,
      }),
    });
    if (!resp.ok) throw new Error(`CassetteAI Music error ${resp.status}`);
    return resp.json();
  });

  // Note: CassetteAI returns 'audio_file' key (NOT 'audio')
  const audioUrl = response.audio_file?.url;
  if (!audioUrl) throw new Error('CassetteAI Music returned no audio URL');

  const audioResp = await fetch(audioUrl);
  const rawBuffer = Buffer.from(await audioResp.arrayBuffer());
  const outputPath = path.join(workspace, 'assets', 'music', 'ambient-loop.wav');
  const tempPath = outputPath.replace('.wav', '.raw.wav');
  fs.writeFileSync(tempPath, rawBuffer);
  normalizeAudio(tempPath, outputPath);
  fs.unlinkSync(tempPath);
  validateAudioFormat(outputPath);
  console.log(`✅ Background music: ambient-loop.wav (FAL CassetteAI)`);
}
```

### ffmpeg Synthesis (Fallback — no API key needed)

```bash
MUSIC_DIR="${WORKSPACE}/assets/music"

# Ambient drone: two detuned sine waves + soft pink noise
# Duration 30s — will be looped in Remotion
ffmpeg -y \
  -f lavfi -i "sine=frequency=220:duration=30" \
  -f lavfi -i "sine=frequency=330:duration=30" \
  -f lavfi -i "anoisesrc=d=30:c=pink:a=0.02" \
  -filter_complex "\
    [0:a]volume=0.06[a]; [1:a]volume=0.04[b]; [2:a]lowpass=f=400[c];\
    [a][b][c]amix=3:duration=longest,\
    afade=t=in:d=2,afade=t=out:st=28:d=2" \
  -ar 44100 -ac 2 -c:a pcm_s16le \
  "${MUSIC_DIR}/ambient-loop.wav" 2>/dev/null

echo "⚠️ Background music: ambient-loop.wav (ffmpeg fallback — lower quality)"
```

The background music will be looped in the Remotion composition and automatically
ducked to 30% volume when narration is playing.

### Important: FAL Model Response Key Differences

| Model | Output key | Format |
|-------|-----------|--------|
| ElevenLabs SFX v2 | `response.audio.url` | MP3 |
| Beatoven (SFX + Music) | `response.audio.url` | WAV 44.1kHz |
| CassetteAI (SFX + Music) | `response.audio_file.url` | WAV |
| Stable Audio 2.5 | `response.audio.url` | WAV |

Always normalize to 44100Hz stereo WAV regardless of source format.

---

## 5. Progress Reporting

All generation scripts must print clear progress:
```
[1/14] Generating narration: Dashboard...
  ✅ segment-01.wav — 5.2s
[2/14] Generating narration: Run Overview...
  ✅ segment-02.wav — 7.1s
...
[14/14] Generating narration: Outro...
  ✅ segment-14.wav — 4.8s

✅ Timing manifest written (14 segments, total narration: 82.3s)
✅ Start card: assets/cards/start-card.png
✅ End card: assets/cards/end-card.png
✅ Sound effects: click.wav, transition.wav, success.wav
✅ Background music: ambient-loop.wav
```

---

## 6. Output Validation

Before proceeding to Phase 7, validate ALL assets:

```bash
# Check all narration files are 44100Hz stereo
for f in assets/narration/segment-*.wav; do
  info=$(ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels -of csv=p=0 "$f")
  if [[ "$info" != *"44100"* ]] || [[ "$info" != *"2"* ]]; then
    echo "❌ FORMAT ERROR: $f is $info (need 44100,2)"
    exit 1
  fi
done
echo "✅ All narration files: 44100Hz stereo"

# Check timing manifest
test -f timing-manifest.json && echo "✅ timing-manifest.json exists" || echo "❌ MISSING"

# Check cards
test -f assets/cards/start-card.png && echo "✅ start-card.png" || echo "❌ MISSING"
test -f assets/cards/end-card.png && echo "✅ end-card.png" || echo "❌ MISSING"

# Check sounds
test -f assets/sounds/click.wav && echo "✅ click.wav" || echo "❌ MISSING"
test -f assets/sounds/transition.wav && echo "✅ transition.wav" || echo "❌ MISSING"

# Check music
test -f assets/music/ambient-loop.wav && echo "✅ ambient-loop.wav" || echo "❌ MISSING"
```

## Output

```
assets/
├── narration/
│   ├── segment-01.wav           # ALL 44100Hz stereo WAV
│   ├── segment-02.wav
│   └── ...
├── cards/
│   ├── start-card.png
│   └── end-card.png
├── sounds/
│   ├── click.wav
│   ├── transition.wav
│   ├── success.wav
│   └── sound-map.json
└── music/
    └── ambient-loop.wav

timing-manifest.json              # ← Phase 7 reads this
```
