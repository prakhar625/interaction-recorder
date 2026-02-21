---
command: record-plan
description: Generate a recording plan and storyboard without executing
disable-model-invocation: true
---

# /record-plan

Run planning phases only. Output a detailed storyboard without recording anything.

## Before Starting

1. Read `SKILL.md` for context
2. Check for `.interaction-recorder/preferences.json` in the repo root
   - If it exists, load saved preferences for defaults

## Execution Flow

```
Phase 1: Repo Analysis          → read references/repo-analysis.md
Phase 2: Flow Mapping           → read references/flow-mapping.md
Phase 3: Limitations Check      → read references/limitations-check.md
Phase 4: Planning & Storyboard  → read references/planning.md
```

## Output

Present to the Asker:
- Complete flow map of the UI (all routes, tabs, sub-views)
- Segment-by-segment storyboard with narration scripts
- Visual theme proposal (colors, typography, transitions)
- Start/end card designs and content
- Sound and music plan
- Estimated total video duration
- Required API keys and services
- Blockers list with workarounds

The Asker can then iterate on the plan and later run `/record-demo` to execute.
