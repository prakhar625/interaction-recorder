# Configuration Reference

Complete reference for all configuration options.

## Config Structure

```
scope: "end-to-end" | "chunks"
quality_tier: "quick-demo" | "walkthrough" | "production"

recording:
  resolution: "1920x1080"
  browser: "chromium"
  show_cursor: true
  click_zoom: true | false
  click_zoom_level: 1.3
  browser_frame: true | false
  browser_frame_style: "minimal" | "full"

narration:
  enabled: true | false
  provider: "fal-minimax" | "elevenlabs" | "local"
  voice_id: string
  style: "conversational" | "professional" | "energetic"

start_card:
  enabled: true | false
  title: string
  subtitle: string
  duration_seconds: 3
  generation: "html" | "fal"

end_card:
  enabled: true | false
  text: string
  cta: string
  duration_seconds: 3
  generation: "html" | "fal"

sounds:
  enabled: true | false
  provider: "fal-elevenlabs-sfx" | "fal-beatoven-sfx" | "fal-cassetteai-sfx" | "ffmpeg"
  style: "subtle" | "playful" | "minimal"
  types: ["click", "transition", "success"]

background_music:
  enabled: true | false
  provider: "fal-beatoven-music" | "fal-cassetteai-music" | "fal-stable-audio" | "ffmpeg"
  style: "ambient" | "upbeat" | "minimal"
  prompt: string  # Custom prompt for AI music generation
  volume: 0.08
  duck_under_narration: true

visual:
  background: "gradient" | "solid" | "none"
  background_colors: [string]
  theme: "auto" | "bright" | "minimal" | "dark" | "warm" | "custom"
  annotations: true | false
  transitions: "cut" | "fade" | "slide"
  transition_duration_ms: 300

output:
  format: "mp4"
  quality: "draft" | "balanced" | "high"
  combine_chunks: true | false
```

## Walkthrough Tier Defaults (used by /record-quick)

- TTS: enabled, FAL MiniMax (if FAL_KEY) or local fallback, conversational style
- Start card: enabled, HTML-rendered, auto title from repo
- End card: enabled, "Thanks for watching"
- Annotations: enabled, auto-generated, minimal style
- Click-zoom: enabled, 1.3x
- Sounds: enabled, FAL ElevenLabs SFX (if FAL_KEY) or ffmpeg fallback, subtle click + transition
- Background music: enabled, FAL Beatoven (if FAL_KEY) or ffmpeg fallback, ambient, volume 0.08
- Browser frame: enabled, minimal chrome
- Background: gradient (auto from app CSS colors)
- Transitions: fade, 300ms
- Resolution: 1920x1080
- Output: MP4, balanced quality

## Workspace Directory Layout

```
interaction-recorder-workspace/
├── config.json
├── timing-manifest.json
├── storyboard.md
├── flow-map.md
├── recordings/
│   ├── segment-01.mp4
│   ├── segment-01-manifest.json
│   ├── segment-01-screenshot.png
│   └── ...
├── assets/
│   ├── narration/
│   │   ├── segment-01.wav
│   │   └── ...
│   ├── cards/
│   │   ├── start-card.png
│   │   └── end-card.png
│   ├── sounds/
│   │   ├── click.wav
│   │   ├── transition.wav
│   │   └── sound-map.json
│   └── music/
│       └── ambient-loop.wav
├── remotion/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── Root.tsx
│       ├── DemoVideo.tsx
│       ├── composition-config.json
│       └── components/
└── output/
    ├── demo.mp4
    ├── demo-thumbnail.png
    └── chunks/
```
