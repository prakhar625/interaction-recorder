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
- **AI sound design** — sound effects and background music generated via FAL AI models (ElevenLabs SFX, Beatoven, CassetteAI), with ffmpeg synthesis as fallback
- **Session persistence** — preferences (design tokens, TTS provider, theme) are saved between recordings so subsequent runs skip re-discovery

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
  ✓ Adding AI sound design (click effects, ambient music via FAL)

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
Phase 9:    Quality review & deliver final video
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/record-quick` | Quick recording with smart defaults, no planning phase |
| `/record-demo` | Full interactive workflow with planning checkpoint |
| `/record-plan` | Generate storyboard only, don't record |
| `/record-review` | Post-recording quality critique and re-record suggestions |

The skill also triggers automatically when you say things like "record a demo", "make a walkthrough video", "capture my UI", etc.

---

## Requirements

**Always needed:**
- Node.js 18+
- ffmpeg + ffprobe

**Installed automatically:**
- Playwright + Chromium (for recording)
- Remotion (for video assembly)

**Optional (for narration + AI sound design):**
- `FAL_KEY` in `.env` — for MiniMax or Chatterbox TTS, ElevenLabs SFX, Beatoven/CassetteAI music via [fal.ai](https://fal.ai)
- `ELEVENLABS_API_KEY` in `.env` — for ElevenLabs TTS directly

Without a TTS key, the skill falls back to screencast tier (no narration). Without a FAL key, sound effects and music fall back to ffmpeg synthesis.

---

## What's Inside

```
interaction-recorder/
├── .claude-plugin/
│   ├── plugin.json                   # Plugin manifest
│   └── marketplace.json              # Marketplace metadata
├── .claude/
│   ├── commands/                     # Slash commands
│   │   ├── record-quick.md           # /record-quick
│   │   ├── record-demo.md            # /record-demo
│   │   ├── record-plan.md            # /record-plan
│   │   └── record-review.md          # /record-review
│   └── skills/interaction-recorder/
│       ├── SKILL.md                  # Main skill instructions
│       ├── references/
│       │   ├── repo-analysis.md      # How to analyze the target codebase
│       │   ├── flow-mapping.md       # UI flow discovery
│       │   ├── limitations-check.md  # What can/can't be recorded
│       │   ├── planning.md           # Storyboard generation
│       │   ├── presets.md            # Quality tier defaults
│       │   ├── config.md             # Full config reference
│       │   ├── tool-setup.md         # Workspace + Remotion setup
│       │   ├── asset-generation.md   # TTS, cards, AI sounds, AI music
│       │   ├── recording.md          # Per-segment Playwright recording
│       │   ├── video-assembly.md     # Remotion composition + ffmpeg fallback
│       │   ├── quality-review.md     # Two-stage quality review + preferences
│       │   ├── auth-patterns.md      # Auth patterns for protected apps
│       │   └── remotion-docs.md      # Remotion API reference
│       ├── assets/remotion-templates/ # Starter Remotion components
│       ├── scripts/
│       │   ├── normalize-audio.sh    # Canonical 44100Hz stereo WAV normalization
│       │   └── validate-workspace.sh # Pre-flight workspace validation
│       └── evals/                    # Test cases
├── hooks/
│   ├── hooks.json                    # Plugin hooks (auto .env loading)
│   └── load-env.sh                   # SessionStart hook script
└── README.md
```

---

## License

MIT — See [LICENSE](LICENSE)
