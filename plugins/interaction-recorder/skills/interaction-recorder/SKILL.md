---
name: interaction-recorder
description: >
  Use when someone asks to record, capture, or create a video of a web application's UI.
  Triggers on: demo video, walkthrough, screen recording, product demo, UI capture, video
  for README, record my app, make a demo, create a walkthrough, show how this works as a video,
  screen record the UI, video documentation.
---

# Interaction Recorder

Record professional demo videos of any codebase's UI — automatically.

This skill analyzes a repository, understands its UI flows, and produces polished video recordings
ranging from quick captures to fully narrated productions with graphics, annotations, transitions,
sound design, and AI-generated title cards.

---

## Terminology

- **Asker**: The person running this skill (you, the developer/PM/designer).
- **User**: The hypothetical person who uses the app being recorded at runtime.

---

## Two Configuration Axes

Before diving into phases, establish two things upfront with the Asker:

### Axis 1 — Scope

Ask: *"Should I record one continuous end-to-end video, or multiple separate clips?"*

| Scope | When to use |
|-------|------------|
| **End-to-end** | Single continuous video covering the full user journey (or a defined subset) |
| **Chunks** | Multiple separate clips — one per feature, flow, or view. Good for docs, onboarding, or modular demos |

### Axis 2 — Quality Tier

Ask: *"What level of polish do you need?"*

| Tier | What you get | Typical use case |
|------|-------------|-----------------|
| **Quick-demo** | Clean screen recording with cursor, no narration or effects | Internal sharing, quick Slack demo, PR review |
| **Walkthrough** | Narration (TTS) + AI start/end cards + annotations + click-zoom + subtle sounds + background music + browser frame + gradient background | README demo, onboarding video, stakeholder update |
| **Production** | Everything in walkthrough + AI-generated graphics + full storyboard + custom theme design | Product launch, marketing, investor deck, conference talk |

---

## Commands

### `/record-demo` — Full interactive workflow
Runs all phases (1→9). Pauses at the plan checkpoint for approval.

### `/record-quick` — Skip planning, smart defaults
Skips planning. Analyzes the repo, then immediately records using **walkthrough-tier defaults**.
Phases: 1→3, intent checkpoint, skip 4, then 5→9.

### `/record-plan` — Plan only, no execution
Runs phases 1→4 only. Outputs a storyboard without recording.

### `/record-review` — Post-recording quality critique
Reviews a completed recording for quality issues. Run after any recording session.

---

## Phase Workflow

```
PLANNING PHASES
  Phase 1: Repo Analysis          → references/repo-analysis.md
  Phase 2: Flow Mapping           → references/flow-mapping.md
  Phase 3: Limitations Check      → references/limitations-check.md
                                    (see also: references/auth-patterns.md)
  Phase 4: Planning & Storyboard  → references/planning.md
      ↓ ← CHECKPOINT (mandatory in /record-demo, intent-only in /record-quick)

EXECUTION PHASES
  Phase 5: Workspace Setup        → references/tool-setup.md
  Phase 6: Asset Generation       → references/asset-generation.md
  Phase 7: Recording              → references/recording.md
  Phase 8: Video Assembly         → references/video-assembly.md
  Phase 9: Quality Review         → references/quality-review.md

REFERENCE DOCS
  Config & presets                → references/config.md
  Quality tier presets            → references/presets.md
  Auth patterns                   → references/auth-patterns.md
  Remotion API                    → references/remotion-docs.md
```

---

## ⛔ STOP — READ THESE RULES BEFORE EXECUTING ANY PHASE

These four rules are NON-NEGOTIABLE. Violating any one of them produces a broken video.
If you find yourself about to do something that contradicts these rules, STOP and re-read them.

### Rule 1: AUDIO-FIRST — Generate ALL narration BEFORE any recording

```
CORRECT ORDER:  Phase 6 (generate narration) → Phase 7 (record paced by narration)
WRONG ORDER:    Record first, then generate narration, then stretch/compress to fit
```

Narration clip durations are the CRITICAL PATH. They drive the recording pace.
Each segment's Playwright recording lasts exactly `narration_duration + 0.5s buffer`.
This guarantees PERFECT narration-to-video sync with ZERO post-production time-stretching.

DO NOT start recording until ALL narration clips exist and timing-manifest.json is written.

### Rule 2: PER-SEGMENT RECORDING — Each segment is a separate video file

```
CORRECT:  recordings/segment-01.mp4, segment-02.mp4, ... (separate files)
WRONG:    One long recordings/full-recording.webm that gets sliced/slowed later
```

Each segment = its own Playwright browser context = its own video file = its own
duration matched to its narration clip. This enables:
- Per-segment timing matched to narration (no uniform speed adjustment)
- Easy re-takes without re-recording everything
- Clean transition points in assembly

DO NOT record one continuous video. Create a new browser context for each segment.

### Rule 3: REMOTION FOR ASSEMBLY — ffmpeg is the FALLBACK only

```
CORRECT:  Remotion composition → npx remotion render → ffmpeg compress final output
WRONG:    ffmpeg drawbox + concat + filter_complex as the primary pipeline
```

Remotion renders: browser frame with rounded corners and shadow, click-zoom overlays,
spring-animated annotations, fade transitions between segments, animated title cards,
layered audio with ducking. ffmpeg drawbox cannot do any of these properly.

Only fall back to ffmpeg-only if Remotion render fails. If falling back, explicitly
warn the Asker: "Remotion failed. Using ffmpeg fallback — no zoom, annotations, or
animated transitions."

### Rule 4: ALL AUDIO IS 44100Hz STEREO WAV — No exceptions

Every audio file in the entire pipeline — narration clips, silence gaps, sound effects,
background music — MUST be 44100Hz, 2-channel, 16-bit PCM WAV.

Normalize IMMEDIATELY after generating/downloading each file:
```bash
ffmpeg -y -i "input.mp3" -ar 44100 -ac 2 -c:a pcm_s16le "output.wav" 2>/dev/null
```

Mixing formats (e.g., 32kHz mono narration + 44100Hz stereo silence) WILL produce
garbled audio. Validate format before concatenation.

---

## Phase Details

### Phase 1 — Repo Analysis

**Goal**: Understand the codebase, how to run it, and where the UI lives.
Read `references/repo-analysis.md` before starting.

- Scan the repo structure, identify tech stack and framework
- Figure out how to start the app
- Locate the UI entry point (URL, port, route)
- Extract the app's visual design tokens (colors, fonts) for theme matching

Output: Mental model of the repo + run instructions + design tokens.

### Phase 2 — Flow Mapping

**Goal**: Map every user journey, view, and state.
Read `references/flow-mapping.md` before starting.

- Identify all routes/pages/views
- Map primary user journey(s) from entry to completion
- Document secondary flows and branches
- Catalog ALL tabs, sub-sections, and expandable content within each view
- Mine e2e tests for flow information

Output: A structured flow map.

### Phase 3 — Limitations Check

**Goal**: Identify blockers.
Read `references/limitations-check.md` before starting.
If auth is needed, also read `references/auth-patterns.md`.

- Auth requirements, 3rd-party deps, irreversible actions
- CAPTCHAs, rate limits, bot detection
- Check if app is already running (don't try to restart if it's already up)
- Validate that the requested TTS provider exists and API key works (small test request)

Output: Blockers list with workarounds.

### Phase 4 — Planning & Storyboard

**Goal**: Create a detailed plan, get Asker approval.
Read `references/planning.md` before starting.

**Skipped in `/record-quick`** — auto-plan is generated from the flow map using walkthrough defaults
from `references/presets.md`, including default start/end cards and background music.

In `/record-demo`, this is interactive:
- Draft segment-by-segment storyboard with narration script per segment
- Plan start card (title, subtitle, branding) and end card (CTA, thanks)
- Propose visual theme, transition style
- List all assets needed
- Validate API keys with a test call

**⚠️ CHECKPOINT**: Do not proceed without explicit Asker approval.

### Phase 5 — Workspace Setup

**Goal**: Prepare the environment.
Read `references/tool-setup.md` before starting.

- Create workspace directory structure
- Verify ffmpeg, Node.js 18+, Playwright with Chromium
- Set up Remotion project DETERMINISTICALLY (write files directly, never use `npx create-video`)
- Load and export API keys using `scripts/load-env.sh` or dotenv
- Check if target app is already running before attempting to start it
- Verify UI is reachable
- Render a Remotion test frame to verify the pipeline works

**GATE — Do not proceed to Phase 6 until ALL of these pass:**
- [ ] ffmpeg + ffprobe available
- [ ] Node.js 18+ available
- [ ] Playwright + Chromium installed
- [ ] Remotion project written and `npx remotion --version` succeeds
- [ ] API keys loaded and validated
- [ ] App UI reachable (HTTP 200 or 302)

### Phase 6 — Asset Generation (BEFORE Recording)

**Goal**: Generate all audio and visual assets. Narration durations are the CRITICAL PATH.
Read `references/asset-generation.md` before starting.

**Strict execution order:**
1. **Narration clips** — generate ALL, normalize each to 44100Hz stereo WAV immediately
2. **timing-manifest.json** — maps each segment to its narration duration
3. **In parallel** (once timing manifest exists):
   - Start card + end card (HTML-rendered via Playwright)
   - Sound effects (click, transition — ffmpeg synthesis)
   - Background music (ambient drone — ffmpeg synthesis)

**GATE — Do not proceed to Phase 7 until:**
- [ ] ALL narration WAV files exist and are 44100Hz stereo
- [ ] timing-manifest.json exists with valid durations
- [ ] Start card and end card PNG files exist
- [ ] Sound effect WAV files exist (click.wav, transition.wav)
- [ ] Background music WAV exists (ambient-loop.wav)

### Phase 7 — Recording (Paced by Narration)

**Goal**: Capture screen recordings paced by narration clip durations.
Read `references/recording.md` before starting.

- Read `timing-manifest.json` to know each segment's target duration
- Record each segment as a SEPARATE video file (new browser context per segment)
- Each segment lasts exactly: `narration_duration + 0.5s buffer`
- Distribute pauses within the segment to fill the time naturally
- Use injected SVG cursor for visible mouse movement
- Capture a validation screenshot after each segment
- Generate action manifest per segment (timestamps, clicks, coordinates)

**GATE — Do not proceed to Phase 8 until:**
- [ ] Every segment has a valid .mp4 file
- [ ] Each mp4 duration is within ±2s of its target from timing-manifest.json
- [ ] Screenshot for each segment exists (for visual validation)
- [ ] Action manifest for each segment exists

### Phase 8 — Video Assembly

**Goal**: Composite everything using Remotion.
Read `references/video-assembly.md` before starting.

Layer order in Remotion composition:
1. Gradient/solid background
2. Start card (animated fade in/out via TitleCard component)
3. Per-segment: browser frame → recording → click-zoom overlay → annotations
4. Narration audio per segment (already perfectly synced by construction)
5. Fade transitions between segments
6. Background music (looped, ducked under narration)
7. Sound effects (click sounds at action timestamps)
8. End card (animated fade in/out)

Render via `npx remotion render`. Post-process with ffmpeg for compression + thumbnail.
If Remotion fails: fall back to ffmpeg-only assembly with a warning to the Asker.

### Phase 9 — Quality Review & Output

**Goal**: Review the recording for quality issues before delivering.
Read `references/quality-review.md` before starting.

**Two-stage review:**
1. **Spec compliance** — did we follow the storyboard? Check action manifests for errors,
   verify all segments recorded correctly, confirm narration files match segment count.
2. **Quality review** — is the output technically sound? Check timing drift (±1.5s),
   audio formats, file sizes, final output streams, duration reasonableness.

**After review:**
- Present quality report to the Asker
- If issues found: offer to re-record specific segments
- If clean: offer to save preferences to `.interaction-recorder/preferences.json`

---

## Error Recovery

If anything fails:
1. **Pause immediately** — do not silently continue
2. **Save all progress** (partial recordings, generated assets)
3. **Report to Asker** with: what failed, what succeeded, recovery options
4. **Wait for Asker input**

### Fallback chain

| Failure | Fallback |
|---------|----------|
| TTS API | Retry 3× (2s/4s/8s backoff) → local TTS (macOS `say` / Linux `espeak-ng`) |
| FAL image gen | HTML+CSS → Playwright screenshot |
| FAL SFX/Music | Retry 3× → ffmpeg synthesis (**WARN Asker**: lower audio quality) |
| Remotion render | ffmpeg-only assembly (**WARN Asker**: no zoom/annotations/animated transitions) |
| Playwright selector | Screenshot state, log error, skip action, continue recording |
| App won't start | Check if already running; report exact error to Asker |
| App requires auth | See `references/auth-patterns.md` for common patterns |
| API key missing | Check .env files, prompt Asker, validate with test request |

---

## Subagent Strategy

**Phase 6 (Assets)**: Narration clips generated sequentially (critical path), then in parallel:
- Subagent A: Start/end card generation
- Subagent B: Sound effects + background music

**Phase 7 (Recording chunks)**: One subagent per chunk.

Phase 8 waits for all Phase 6-7 outputs to exist before starting.

---

## Config & Workspace Reference

See `references/config.md` for the full configuration reference, walkthrough tier defaults,
and workspace directory layout.

## Session Persistence

After a successful recording, the skill offers to save preferences to
`.interaction-recorder/preferences.json` in the target repo root. Subsequent recordings
in the same repo auto-load this file, skipping re-discovery of design tokens, TTS provider,
app startup configuration, and theme.

See `references/quality-review.md` for the preferences file format and save/load behavior.
