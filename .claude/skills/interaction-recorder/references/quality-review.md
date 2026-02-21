# Phase 9: Quality Review & Output Delivery

Review the completed recording for quality issues before delivering to the Asker.
This phase replaces the simple "list files" output from the original Phase 9.

## Two-Stage Review

### Stage 1: Spec Compliance

Verify the recording matches the storyboard/plan:

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkSpecCompliance(workspace) {
  const timing = JSON.parse(fs.readFileSync(`${workspace}/timing-manifest.json`));
  const issues = [];
  let passCount = 0;

  for (const seg of timing.segments) {
    const idx = String(seg.index).padStart(2, '0');
    const videoPath = `${workspace}/recordings/segment-${idx}.mp4`;
    const manifestPath = `${workspace}/recordings/segment-${idx}-manifest.json`;
    const narrationPath = `${workspace}/${seg.narration_file}`;

    // Check video exists
    if (!fs.existsSync(videoPath)) {
      issues.push({ segment: idx, severity: 'error', message: 'Missing video file' });
      continue;
    }

    // Check narration exists
    if (!fs.existsSync(narrationPath)) {
      issues.push({ segment: idx, severity: 'error', message: 'Missing narration file' });
    }

    // Check action manifest for errors
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath));
      const errors = (manifest.actions || []).filter(a => a.type === 'error');
      if (errors.length > 0) {
        errors.forEach(e => {
          issues.push({
            segment: idx,
            severity: 'warning',
            message: `Failed action: ${e.description} — ${e.error}`
          });
        });
      }
    } else {
      issues.push({ segment: idx, severity: 'warning', message: 'Missing action manifest' });
    }

    passCount++;
  }

  return { total: timing.segments.length, passed: passCount, issues };
}
```

### Stage 2: Quality Review

Check technical quality of the output:

```javascript
function checkQuality(workspace) {
  const timing = JSON.parse(fs.readFileSync(`${workspace}/timing-manifest.json`));
  const issues = [];

  for (const seg of timing.segments) {
    const idx = String(seg.index).padStart(2, '0');
    const videoPath = `${workspace}/recordings/segment-${idx}.mp4`;
    const narrationPath = `${workspace}/${seg.narration_file}`;

    if (!fs.existsSync(videoPath)) continue;

    // Check video duration drift (stricter: ±1.5s, not ±2s)
    try {
      const videoDur = parseFloat(
        execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${videoPath}"`).toString().trim()
      );
      const drift = Math.abs(videoDur - seg.target_recording_duration_seconds);
      if (drift > 1.5) {
        issues.push({
          segment: idx,
          severity: 'warning',
          message: `Timing drift: ${drift.toFixed(1)}s (target: ${seg.target_recording_duration_seconds}s, actual: ${videoDur.toFixed(1)}s). Re-record recommended.`
        });
      }
    } catch (e) {
      issues.push({ segment: idx, severity: 'error', message: 'Cannot read video duration' });
    }

    // Check audio format
    if (fs.existsSync(narrationPath)) {
      try {
        const info = execSync(
          `ffprobe -v error -select_streams a -show_entries stream=sample_rate,channels -of csv=p=0 "${narrationPath}"`
        ).toString().trim();
        if (!info.includes('44100') || !info.includes('2')) {
          issues.push({ segment: idx, severity: 'error', message: `Audio format wrong: ${info} (need 44100,2)` });
        }
      } catch (e) {
        issues.push({ segment: idx, severity: 'error', message: 'Cannot read audio format' });
      }
    }

    // Check file size (zero-size = corrupt)
    const stat = fs.statSync(videoPath);
    if (stat.size < 1024) {
      issues.push({ segment: idx, severity: 'error', message: 'Video file suspiciously small (< 1KB)' });
    }
  }

  // Check final output
  const finalPath = `${workspace}/output/demo.mp4`;
  if (fs.existsSync(finalPath)) {
    try {
      const hasVideo = execSync(
        `ffprobe -v error -select_streams v -show_entries stream=codec_name -of csv=p=0 "${finalPath}"`
      ).toString().trim();
      const hasAudio = execSync(
        `ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "${finalPath}"`
      ).toString().trim();
      if (!hasVideo) issues.push({ segment: 'final', severity: 'error', message: 'Final output has no video stream' });
      if (!hasAudio) issues.push({ segment: 'final', severity: 'error', message: 'Final output has no audio stream' });

      const totalDur = parseFloat(
        execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${finalPath}"`).toString().trim()
      );
      if (totalDur < 30) {
        issues.push({ segment: 'final', severity: 'warning', message: `Total duration very short: ${totalDur.toFixed(1)}s` });
      }
      if (totalDur > 600) {
        issues.push({ segment: 'final', severity: 'warning', message: `Total duration very long: ${(totalDur/60).toFixed(1)} minutes` });
      }
    } catch (e) {
      issues.push({ segment: 'final', severity: 'error', message: 'Cannot validate final output' });
    }
  } else {
    issues.push({ segment: 'final', severity: 'error', message: 'Final output demo.mp4 not found' });
  }

  // Check screenshots show distinct content
  const screenshots = timing.segments
    .map(s => `${workspace}/recordings/segment-${String(s.index).padStart(2, '0')}-screenshot.png`)
    .filter(p => fs.existsSync(p));

  if (screenshots.length > 0) {
    // Compare file sizes as a rough distinctness check
    const sizes = screenshots.map(p => fs.statSync(p).size);
    const uniqueSizes = new Set(sizes.map(s => Math.round(s / 1024))); // round to KB
    if (uniqueSizes.size < Math.ceil(screenshots.length * 0.5)) {
      issues.push({
        segment: 'all',
        severity: 'warning',
        message: 'Many screenshots have similar file sizes — segments may show the same content'
      });
    }
  }

  return issues;
}
```

## Report Format

Present the review as a structured report:

```
═══ Quality Review ═══

  Spec Compliance
  ───────────────
  Segments recorded:  X/Y
  Failed actions:     N errors across M segments
  Missing files:      [list or "none"]

  Quality
  ───────
  Timing accuracy:    X/Y segments within ±1.5s tolerance
  Audio format:       ✅ All 44100Hz stereo WAV  (or ❌ list issues)
  Final output:       ✅ video + audio streams present
  Duration:           Xm Ys
  File size:          X.X MB

  Issues
  ──────
  [severity] Segment NN: description
  ...

  Recommendations
  ───────────────
  1. Re-record segment NN (reason)
  2. ...

  Overall: ✅ Ready to deliver  /  ⚠️ N issues to review  /  ❌ N critical issues
```

## Segment Re-Recording

If specific segments need re-recording:
1. Read the original storyboard for that segment
2. Re-run only that segment's recording (Phase 7, single segment)
3. Re-assemble the full video (Phase 8) with the new segment
4. Re-run quality review

## Save Preferences

After a successful recording (no critical issues), offer to save preferences:

> "Recording complete. Want me to save these settings for future recordings?"
>   - Design tokens (colors, fonts)
>   - TTS provider + voice
>   - App start command + port
>   - Theme used

If the Asker accepts, write `.interaction-recorder/preferences.json` in the target repo root.

### Preferences File Format

```json
{
  "version": 1,
  "created": "2026-02-20T12:00:00Z",
  "updated": "2026-02-20T12:00:00Z",
  "app": {
    "start_command": "npm run dev",
    "port": 3000,
    "base_url": "http://localhost:3000",
    "framework": "next.js"
  },
  "design_tokens": {
    "primary_color": "#3ee8b5",
    "background_color": "#080a0e",
    "accent_color": "#3ee8b5",
    "font_family": "Inter, sans-serif",
    "border_radius": "8px"
  },
  "narration": {
    "provider": "fal-minimax",
    "voice_id": "default",
    "style": "conversational"
  },
  "visual": {
    "theme": "dark",
    "background_colors": ["#080a0e", "#0c1118", "#101420"],
    "browser_frame_style": "minimal"
  },
  "quality_tier": "walkthrough"
}
```

Subsequent recordings in the same repo will load this file and skip re-discovery of
design tokens, TTS provider validation, and app startup configuration.
