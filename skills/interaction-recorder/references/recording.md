# Phase 7: Recording (Paced by Narration)

Capture screen recordings of the UI using Playwright. Each segment's duration is driven
by its narration clip duration from Phase 6's `timing-manifest.json`.

⛔ **BEFORE STARTING**: Verify these gates passed:
- timing-manifest.json exists with all segment durations
- ALL narration WAV files exist and are 44100Hz stereo
- App UI is running and reachable

## Core Architecture: Narration-Paced, Per-Segment Recording

### Why per-segment?

Each segment is recorded as a SEPARATE video file. Do NOT record one continuous video.

Per-segment recording guarantees:
- **Perfect sync**: each segment's duration matches its narration clip exactly
- **Easy re-takes**: re-record segment 5 without touching segments 1-4
- **Clean transitions**: Remotion handles crossfades between distinct files
- **No time-stretching**: no uniform slowdown/speedup artifacts

### How timing works

```
timing-manifest.json says segment-03 narration is 7.2s
  → target recording duration = 7.2s + 0.5s buffer = 7.7s
  → segment script has: navigate, 2 clicks, 1 scroll
  → estimated action time: ~4.0s
  → remaining pause budget: 3.7s → distributed across 4 gaps ≈ 925ms each
```

When the segment video and its narration WAV are layered in Phase 8 Remotion
assembly, they match by construction — no speed adjustment needed.

## Recording Script Structure

Use ONE browser instance, but create a NEW recording context per segment.
Between segments, the browser stays alive — you just close one context and open another.

```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// CRITICAL: Use absolute paths everywhere
const WORKSPACE = '/absolute/path/to/interaction-recorder-workspace';
const RECORDINGS_DIR = path.join(WORKSPACE, 'recordings');
const TIMING = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'timing-manifest.json'), 'utf8'));
const BASE_URL = 'http://localhost:PORT';

// ═════════════════════════════════════════════════════
// Fake Cursor (Playwright hides the real cursor in recordings)
// ═════════════════════════════════════════════════════

async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('fake-cursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'fake-cursor';
    cursor.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 2L5 20L10 15L16 19L19 12L5 2Z" fill="white"
            stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 999999;
      pointer-events: none; transform: translate(-2px, -2px);
      transition: left 0.15s cubic-bezier(0.25, 0.1, 0.25, 1),
                  top 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
      filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.4));
    `;
    document.body.appendChild(cursor);
  });
}

async function moveCursor(page, x, y) {
  await page.evaluate(([cx, cy]) => {
    const el = document.getElementById('fake-cursor');
    if (el) { el.style.left = cx + 'px'; el.style.top = cy + 'px'; }
  }, [x, y]);
  await page.waitForTimeout(180); // let CSS transition play
}

// ═════════════════════════════════════════════════════
// Interaction Helpers
// ═════════════════════════════════════════════════════

async function goto(page, url, actions, startTime) {
  actions.push({ type: 'navigate', timestamp_ms: Date.now() - startTime, url });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await injectCursor(page);
  await page.waitForTimeout(1000);
}

async function click(page, selector, description, actions, startTime) {
  try {
    const element = await page.waitForSelector(selector, { timeout: 10000 });
    const box = await element.boundingBox();
    const cx = box ? Math.round(box.x + box.width / 2) : 960;
    const cy = box ? Math.round(box.y + box.height / 2) : 540;
    actions.push({ type: 'click', timestamp_ms: Date.now() - startTime, x: cx, y: cy, description });
    await moveCursor(page, cx, cy);
    await page.waitForTimeout(200);
    await element.click();
    await page.waitForTimeout(800);
  } catch (error) {
    console.error(`  ⚠️ Click failed: ${description} — ${error.message}`);
    actions.push({ type: 'error', timestamp_ms: Date.now() - startTime, description, error: error.message });
  }
}

async function scrollDown(page, amount, description, actions, startTime) {
  actions.push({ type: 'scroll', timestamp_ms: Date.now() - startTime, direction: 'down', amount, description });
  await moveCursor(page, 960, 540);
  await page.mouse.wheel(0, amount);
  await page.waitForTimeout(600);
}

async function scrollToTop(page, actions, startTime) {
  actions.push({ type: 'scroll', timestamp_ms: Date.now() - startTime, direction: 'up' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(800);
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

// ═════════════════════════════════════════════════════
// Per-Segment Recording Function
// ═════════════════════════════════════════════════════

async function recordSegment(browser, segConfig, segmentActions) {
  const { index, title, target_recording_duration_seconds } = segConfig;
  const segId = `segment-${String(index).padStart(2, '0')}`;
  const actions = [];
  const startTime = Date.now();
  const targetMs = target_recording_duration_seconds * 1000;

  console.log(`  [${index}/${TIMING.segments.length}] Recording: ${title} (target: ${target_recording_duration_seconds}s)`);

  // Create a NEW recording context for this segment
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1920, height: 1080 },
    },
  });
  const page = await context.newPage();

  // Re-inject cursor on every navigation
  page.on('load', async () => {
    try { await injectCursor(page); } catch (e) { /* ignore */ }
  });

  // ─────────────────────────────────────────
  // Execute this segment's actions
  // The segmentActions function receives (page, actions, startTime, pauseMs)
  // and performs the specific navigation/clicks/scrolls for this segment.
  //
  // pauseMs = how much pause time to distribute between actions
  // ─────────────────────────────────────────
  await segmentActions(page, actions, startTime, targetMs);

  // Pad remaining time if segment finished early
  const elapsedMs = Date.now() - startTime;
  const remainingMs = targetMs - elapsedMs;
  if (remainingMs > 200) {
    await pause(page, remainingMs);
  }

  // Capture validation screenshot
  await page.screenshot({
    path: path.join(RECORDINGS_DIR, `${segId}-screenshot.png`)
  });

  // Close context to finalize the video file
  const videoPath = await page.video().path();
  await context.close();

  // Rename the auto-generated file to our segment name
  const finalWebm = path.join(RECORDINGS_DIR, `${segId}.webm`);
  if (fs.existsSync(videoPath) && videoPath !== finalWebm) {
    fs.renameSync(videoPath, finalWebm);
  }

  // Convert webm → mp4 (Remotion prefers mp4)
  const mp4Path = path.join(RECORDINGS_DIR, `${segId}.mp4`);
  require('child_process').execSync(
    `ffmpeg -y -i "${finalWebm}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${mp4Path}" 2>/dev/null`
  );
  if (fs.existsSync(finalWebm)) fs.unlinkSync(finalWebm);

  // Save action manifest
  fs.writeFileSync(
    path.join(RECORDINGS_DIR, `${segId}-manifest.json`),
    JSON.stringify({ segment: index, title, actions }, null, 2)
  );

  // Report timing
  const actualDur = (Date.now() - startTime) / 1000;
  const videoDur = parseFloat(
    require('child_process').execSync(
      `ffprobe -v error -show_entries format=duration -of csv=p=0 "${mp4Path}"`
    ).toString().trim()
  );
  const drift = Math.abs(videoDur - target_recording_duration_seconds);
  const driftWarning = drift > 2 ? ' ⚠️ DRIFT > 2s!' : '';
  console.log(`  ✅ ${segId}: ${videoDur.toFixed(1)}s (target: ${target_recording_duration_seconds}s, drift: ${drift.toFixed(1)}s${driftWarning})`);

  return { segId, videoDur, drift };
}

// ═════════════════════════════════════════════════════
// Main Recording Orchestrator
// ═════════════════════════════════════════════════════

async function recordAll(segmentActionMap) {
  const browser = await chromium.launch({ headless: false });
  const results = [];

  for (const seg of TIMING.segments) {
    const actionFn = segmentActionMap[seg.index];
    if (!actionFn) {
      console.error(`  ❌ No action function for segment ${seg.index}: ${seg.title}`);
      continue;
    }
    const result = await recordSegment(browser, seg, actionFn);
    results.push(result);
  }

  await browser.close();

  // Summary
  console.log(`\n═══ Recording Summary ═══`);
  const drifts = results.filter(r => r.drift > 2);
  if (drifts.length > 0) {
    console.log(`  ⚠️ ${drifts.length} segment(s) with timing drift > 2s:`);
    drifts.forEach(r => console.log(`     ${r.segId}: ${r.drift.toFixed(1)}s drift`));
  } else {
    console.log(`  ✅ All ${results.length} segments within timing tolerance`);
  }
}
```

## Pacing Strategy

For each segment, calculate how to distribute wait times:

```javascript
function calculatePacing(targetDurationMs, actionEstimates) {
  const totalActionTime = actionEstimates.reduce((s, a) => s + a.estimatedMs, 0);
  const totalPauseTime = Math.max(0, targetDurationMs - totalActionTime);
  const numGaps = actionEstimates.length + 1; // gaps between actions + start/end
  const pausePerGap = totalPauseTime / numGaps;

  return {
    pausePerGap: Math.round(pausePerGap),
    totalPauseTime,
    totalActionTime,
  };
}
```

**Action time estimates** (adjust based on observation):
- Navigation: 1500-2000ms (waitUntil + settle)
- Click: 1000-1200ms (move cursor + hover + click + result)
- Scroll: 600-1000ms (scroll + settle)
- Tab click (via eval): 1000ms

If `pausePerGap` < 500ms → narration is too long for the actions. Add slow scrolls,
hover over interesting elements, or linger on data.

If `pausePerGap` > 4000ms → add more interactions, or shorten narration.

## Segment Navigation Patterns

### Pattern A: Direct URL (for deep-linkable apps)

```javascript
// Segment 3: Persona detail
segmentActionMap[3] = async (page, actions, startTime, targetMs) => {
  const pacing = calculatePacing(targetMs, [
    { action: 'navigate', estimatedMs: 2000 },
    { action: 'scroll', estimatedMs: 800 },
    { action: 'scroll', estimatedMs: 800 },
  ]);
  const p = pacing.pausePerGap;

  await pause(page, p);
  await goto(page, `${BASE_URL}/runs/RUN_ID/persona/p_001`, actions, startTime);
  await pause(page, p);
  await scrollDown(page, 300, 'Show personality traits', actions, startTime);
  await pause(page, p);
  await scrollDown(page, 300, 'Show brand affinities', actions, startTime);
  await pause(page, p);
};
```

### Pattern B: Click-through (for non-deep-linkable apps)

```javascript
// Segment 3: Persona detail (navigate via clicks)
segmentActionMap[3] = async (page, actions, startTime, targetMs) => {
  const pacing = calculatePacing(targetMs, [
    { action: 'navigate', estimatedMs: 2000 },
    { action: 'click', estimatedMs: 1200 },
    { action: 'click', estimatedMs: 1200 },
    { action: 'scroll', estimatedMs: 800 },
  ]);
  const p = pacing.pausePerGap;

  await goto(page, `${BASE_URL}/dashboard`, actions, startTime);
  await click(page, '.study-card:first-child', 'Click study', actions, startTime);
  await click(page, '.persona-card:first-child', 'Click persona', actions, startTime);
  await pause(page, p);
  await scrollDown(page, 300, 'Scroll to details', actions, startTime);
  await pause(page, p);
};
```

### Pattern C: Hybrid (navigate to parent, click to child)

Best for most apps — navigate to the closest deep-linkable parent, then click into
the specific sub-view. Saves time vs. clicking from the root every segment.

## Validation Screenshots

After each segment, a screenshot is captured. Scan these to verify each segment
captured the right content before spending time on assembly.

If a segment looks wrong, re-record it individually by re-running just that segment's
action function — no need to redo all segments.

## Error Handling

Each interaction is wrapped in try/catch. If a click fails:
1. Log the error to the action manifest
2. Continue recording — do NOT kill the whole segment
3. Report failed interactions in the segment summary

If the entire segment fails (browser crash, app down):
1. Save whatever manifest data exists
2. Report to the Asker
3. Suggest: retry this segment, skip it, or abort

## Output Verification

After recording all segments, validate:

```bash
# Check every segment exists and has reasonable duration
for f in recordings/segment-*.mp4; do
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "$(basename $f): ${dur}s"
done
```

Each .mp4 should be within ±2s of its target from timing-manifest.json.
Screenshot files should show the expected UI state.

## Output

```
recordings/
├── segment-01.mp4               # Per-segment mp4
├── segment-01-manifest.json     # Action timestamps, click coordinates
├── segment-01-screenshot.png    # Validation screenshot
├── segment-02.mp4
├── segment-02-manifest.json
├── segment-02-screenshot.png
└── ...
```
