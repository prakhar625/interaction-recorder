---
command: record-review
description: Review a completed recording for quality issues before delivery
disable-model-invocation: true
---

# /record-review

Post-recording quality assessment and critique. Run this after a recording session
to catch issues before delivering the final video.

## Before Starting

1. Read `SKILL.md` for context
2. Read `references/quality-review.md` for the full review protocol

## Execution Flow

```
Step 1: Locate workspace     → find interaction-recorder-workspace/
Step 2: Spec compliance      → verify storyboard was followed
Step 3: Quality review       → check recordings, audio, assembly
Step 4: Report               → present findings with fix suggestions
Step 5: Fix                  → re-record or re-assemble specific segments
```

## What This Checks

### Spec Compliance (did we follow the plan?)
- Every storyboard segment has a matching recording
- Each segment navigated to the correct route
- Action manifests have no error entries (failed clicks, missing selectors)
- Narration files match storyboard segment count

### Quality Review (is the output good?)
- Segment durations within ±1.5s of targets (stricter than the ±2s gate)
- All audio is 44100Hz stereo WAV
- Final output has both video and audio streams
- No segments with zero-size or corrupt files
- Total duration is reasonable (not < 30s or > 10 minutes for typical apps)
- Start card shows correct title
- Screenshots show distinct content per segment (not the same page repeated)

### Output

Present a quality report:
```
═══ Quality Review ═══
  Spec compliance:  X/Y segments match storyboard
  Timing accuracy:  X/Y segments within tolerance
  Audio format:     ✅ All 44100Hz stereo WAV
  Failed actions:   N errors across M segments
  Final output:     ✅ video + audio streams present
  Duration:         Xm Ys (expected: ~Xm Ys)

  Issues found:
    ⚠️ Segment 3: click on ".nav-item" failed (element not found)
    ⚠️ Segment 7: 2.8s drift from target (re-record recommended)

  Suggested fixes:
    1. Re-record segment 3 with updated selector
    2. Re-record segment 7 to reduce timing drift
```

Offer to re-record specific segments or re-assemble if needed.
