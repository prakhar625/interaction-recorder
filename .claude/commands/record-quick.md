---
command: record-quick
description: Quick recording with smart walkthrough defaults, no planning phase
---

# /record-quick

Skip the planning conversation. Analyze the repo, then record using walkthrough-tier defaults.

## Execution Flow

1. Read `SKILL.md` — especially the ⛔ MANDATORY RULES section
2. Read `references/presets.md` for walkthrough defaults
3. Execute phases:

```
Phase 1: Repo Analysis          → read references/repo-analysis.md
Phase 2: Flow Mapping           → read references/flow-mapping.md
Phase 3: Limitations Check      → read references/limitations-check.md
    (Phase 4 SKIPPED — auto-plan from flow map with walkthrough defaults)
Phase 5: Workspace Setup        → read references/tool-setup.md
    ↓ GATE: all tools verified, Remotion test frame passes
Phase 6: Asset Generation       → read references/asset-generation.md
    ↓ GATE: all narration + cards + sounds + music exist
Phase 7: Recording              → read references/recording.md
    ↓ GATE: all segment mp4s exist, durations match targets
Phase 8: Video Assembly         → read references/video-assembly.md
Phase 9: Present Output
```

## Auto-Plan (replaces Phase 4)

After flow mapping, automatically generate:
1. One segment per view/tab/sub-section
2. Conversational narration per segment
3. Start card (repo name + description, HTML-rendered)
4. End card ("Thanks for watching", HTML-rendered)
5. Background music (ambient, volume 0.08)
6. Sound effects (click + transition, subtle)
7. Save as storyboard.md + config.json

## ⛔ Mandatory Rules (re-read before Phase 5)

1. **AUDIO-FIRST**: Generate ALL narration in Phase 6 BEFORE recording in Phase 7
2. **PER-SEGMENT**: Record each segment as a SEPARATE video file (new browser context)
3. **REMOTION PRIMARY**: Use Remotion for assembly, ffmpeg is fallback only
4. **44100Hz STEREO WAV**: ALL audio normalized immediately after generation
