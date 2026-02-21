---
command: record-quick
description: Quick recording with smart walkthrough defaults, no planning phase
disable-model-invocation: true
---

# /record-quick

Analyze the repo, then record using walkthrough-tier defaults.

## Before Starting

1. Read `SKILL.md` — especially the ⛔ MANDATORY RULES section
2. Read `references/presets.md` for walkthrough defaults
3. Check for `.interaction-recorder/preferences.json` in the repo root
   - If it exists, load saved preferences (design tokens, TTS provider, app config)
   - Use them as defaults instead of re-discovering everything

## Intent Checkpoint

After Phase 2 (flow mapping), BEFORE proceeding to Phase 5:

Present a brief summary to the Asker and wait for confirmation:

> "I'll record a walkthrough-tier demo covering these N views:
>   1. [View 1]
>   2. [View 2]
>   ...
> Using [TTS provider] for narration. Estimated duration: ~Xm.
> Proceed?"

Do NOT skip this checkpoint. A video takes minutes to produce — confirm direction first.

## Execution Flow

```
Phase 1: Repo Analysis          → read references/repo-analysis.md
Phase 2: Flow Mapping           → read references/flow-mapping.md
Phase 3: Limitations Check      → read references/limitations-check.md
    ↓
    INTENT CHECKPOINT: Brief summary, wait for Asker confirmation
    ↓
    (Phase 4 SKIPPED — auto-plan from flow map with walkthrough defaults)
Phase 5: Workspace Setup        → read references/tool-setup.md
    ↓ GATE: all tools verified, Remotion test frame passes
Phase 6: Asset Generation       → read references/asset-generation.md
    ↓ GATE: all narration + cards + sounds + music exist
Phase 7: Recording              → read references/recording.md
    ↓ GATE: all segment mp4s exist, durations match targets
Phase 8: Video Assembly         → read references/video-assembly.md
Phase 9: Present Output         → read references/quality-review.md
```

## Auto-Plan (replaces Phase 4)

After flow mapping, automatically generate:
1. One segment per view/tab/sub-section
2. Conversational narration per segment
3. Start card (repo name + description, HTML-rendered)
4. End card ("Thanks for watching", HTML-rendered)
5. Background music (AI-generated ambient via FAL, volume 0.08)
6. Sound effects (AI-generated click + transition via FAL)
7. Save as storyboard.md + config.json

## ⛔ Mandatory Rules (re-read before Phase 5)

1. **AUDIO-FIRST**: Generate ALL narration in Phase 6 BEFORE recording in Phase 7
2. **PER-SEGMENT**: Record each segment as a SEPARATE video file (new browser context)
3. **REMOTION PRIMARY**: Use Remotion for assembly, ffmpeg is fallback only
4. **44100Hz STEREO WAV**: ALL audio normalized immediately after generation
