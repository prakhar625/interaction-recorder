# Interaction Recorder

**Record polished demo videos of any codebase's UI — directly from Claude Code.**

From quick screen captures to fully narrated, annotated productions with sound design, motion graphics, and transitions.

[Install](#installation) · [How It Works](#how-it-works) · [Commands](#commands) · [Requirements](#requirements)

---

## What This Does

Point it at any running web app and get a production-quality demo video. The skill handles everything: analyzing your UI, writing narration, recording the browser, and assembling the final video with a browser frame, click-zoom effects, transitions, and background music.

**Three quality tiers:**

| Tier | What you get | Use case |
|------|-------------|----------|
| **Screencast** | Raw recording, browser frame, basic cuts | Internal sharing, bug reports |
| **Walkthrough** | + TTS narration, click-zoom, transitions, sound design, title cards | README demos, team presentations |
| **Production** | + AI-generated graphics, custom branding, per-chunk export | Investor decks, marketing |

**Key architecture decisions:**
- **Audio-first** — all narration is generated before recording, so video is paced by the script (no awkward speed adjustments)
- **Per-segment recording** — each section is a separate video file matched to its narration duration
- **Remotion compositing** — professional assembly with layered browser frames, click-zoom overlays, spring-animated title cards, and audio ducking

## Installation

### Plugin (Recommended)

In Claude Code:

```
/plugin marketplace add prakhar625/interaction-recorder
/plugin install interaction-recorder@interaction-recorder
```

Restart Claude Code after installing.

### Manual

```bash
git clone https://github.com/prakhar625/interaction-recorder.git
cp -r interaction-recorder/skills/* ~/.claude/skills/
cp -r interaction-recorder/commands/* ~/.claude/commands/
```

Restart Claude Code.

---

## How It Works

### Quick Demo (2 minutes)

```
You: Record a quick demo of my app at localhost:3000

Claude:
  ✓ Analyzing repo and UI structure
  ✓ Found 4 views: Dashboard, Studies, Audience Builder, Results
  ✓ Generating narration (14 segments via FAL MiniMax)
  ✓ Recording segments (audio-first, per-segment pacing)
  ✓ Assembling with Remotion (browser frame, click-zoom, transitions)
  ✓ Adding sound design (click sounds, ambient music)

  → output/demo.mp4 (4:30, 1080p, 14.2MB)
```

### Full Walkthrough

```
You: /record-demo

Claude:
  What scope? (end-to-end / chunks)
  What quality tier? (screencast / walkthrough / production)
  Any specific sections to highlight?

  [Plans storyboard, presents for approval]
  [Records and assembles after you confirm]
```

### The Pipeline

```
Phase 1-3:  Analyze repo → Map UI flows → Check limitations
Phase 4:    Plan storyboard (or auto-generate for /record-quick)
Phase 5:    Set up workspace (Playwright, Remotion, API keys)
Phase 6:    Generate ALL narration + cards + sounds + music
Phase 7:    Record each segment (duration matched to narration)
Phase 8:    Assemble in Remotion (layers, transitions, audio ducking)
Phase 9:    Deliver final video
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/record-quick` | Quick recording with smart defaults, no planning phase |
| `/record-demo` | Full interactive workflow with planning checkpoint |
| `/record-plan` | Generate storyboard only, don't record |

The skill also triggers automatically when you say things like "record a demo", "make a walkthrough video", "capture my UI", etc.

---

## Requirements

**Always needed:**
- Node.js 18+
- ffmpeg + ffprobe

**Installed automatically:**
- Playwright + Chromium (for recording)
- Remotion (for video assembly)

**Optional (for narration):**
- `FAL_KEY` in `.env` — for MiniMax or Chatterbox TTS via [fal.ai](https://fal.ai)
- `ELEVENLABS_API_KEY` in `.env` — for ElevenLabs TTS directly

Without a TTS key, the skill falls back to screencast tier (no narration).

---

## What's Inside

```
skills/interaction-recorder/
├── SKILL.md                          # Main skill instructions
├── references/
│   ├── repo-analysis.md              # How to analyze the target codebase
│   ├── flow-mapping.md               # UI flow discovery
│   ├── limitations-check.md          # What can/can't be recorded
│   ├── planning.md                   # Storyboard generation
│   ├── presets.md                     # Quality tier defaults
│   ├── tool-setup.md                 # Workspace + Remotion setup
│   ├── asset-generation.md           # TTS, cards, sounds, music
│   ├── recording.md                  # Per-segment Playwright recording
│   ├── video-assembly.md             # Remotion composition + ffmpeg fallback
│   └── remotion-docs.md              # Remotion API reference
├── assets/remotion-templates/        # Starter Remotion components
│   ├── BrowserFrame.tsx
│   ├── ClickZoomOverlay.tsx
│   ├── AnnotationOverlay.tsx
│   ├── FadeTransition.tsx            # + animated TitleCard
│   └── GradientBackground.tsx
├── scripts/                          # Setup + utility scripts
└── evals/                            # Test cases
```

---

## License

MIT — See [LICENSE](LICENSE)
