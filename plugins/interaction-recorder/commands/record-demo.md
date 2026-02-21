---
command: record-demo
description: Full interactive demo video workflow with planning checkpoint
disable-model-invocation: true
---

# /record-demo

Full interactive workflow for recording a polished demo video.
Runs all phases (1→9) with an explicit planning checkpoint at Phase 4.

## Before Starting

1. Read `SKILL.md` — especially the ⛔ MANDATORY RULES section
2. Check for `.interaction-recorder/preferences.json` in the repo root
   - If it exists, load saved preferences (design tokens, TTS provider, app config)
   - Show the Asker: "Found saved preferences from a previous recording. Using them as defaults."
   - Saved preferences can be overridden during Phase 4 planning
3. Ask the Asker for **scope** (end-to-end vs chunks) and **quality tier**

## Execution Flow

```
Phase 1: Repo Analysis          → read references/repo-analysis.md
Phase 2: Flow Mapping           → read references/flow-mapping.md
Phase 3: Limitations Check      → read references/limitations-check.md
Phase 4: Planning & Storyboard  → read references/planning.md
    ↓
    CHECKPOINT: Present plan, wait for Asker approval
    ↓
Phase 5: Workspace Setup        → read references/tool-setup.md
    ↓ GATE: all tools verified, Remotion test frame passes
Phase 6: Asset Generation       → read references/asset-generation.md
    ↓ GATE: all narration + cards + sounds + music exist
Phase 7: Recording              → read references/recording.md
    ↓ GATE: all segment mp4s exist, durations match targets
Phase 8: Video Assembly         → read references/video-assembly.md
Phase 9: Present Output         → read references/quality-review.md
```

## ⛔ Mandatory Rules (re-read before Phase 5)

1. **AUDIO-FIRST**: Generate ALL narration in Phase 6 BEFORE recording in Phase 7
2. **PER-SEGMENT**: Record each segment as a SEPARATE video file (new browser context)
3. **REMOTION PRIMARY**: Use Remotion for assembly, ffmpeg is fallback only
4. **44100Hz STEREO WAV**: ALL audio normalized immediately after generation
