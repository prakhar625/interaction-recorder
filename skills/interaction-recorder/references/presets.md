# Presets

Default configurations for each quality tier.

## Quick-demo

Minimal config, maximum speed. Just a clean screen recording.

```json
{
  "quality_tier": "quick-demo",
  "recording": {
    "resolution": { "width": 1920, "height": 1080 },
    "browser": "chromium",
    "show_cursor": true,
    "click_zoom": false,
    "browser_frame": false
  },
  "narration": {
    "enabled": false
  },
  "start_card": {
    "enabled": false
  },
  "end_card": {
    "enabled": false
  },
  "graphics": {
    "enabled": false
  },
  "sounds": {
    "enabled": false
  },
  "background_music": {
    "enabled": false
  },
  "visual": {
    "background": "none",
    "theme": "none",
    "annotations": false,
    "transitions": "cut"
  },
  "output": {
    "format": "mp4",
    "quality": "balanced",
    "combine_chunks": true
  }
}
```

**When to suggest**: Internal demos, Slack shares, PR reviews, quick bug reproduction.
Remotion is not needed — raw Playwright output + light ffmpeg post-processing suffices.

## Walkthrough

The "sensible defaults" tier. Polished enough for external sharing without a lengthy planning phase.
This is what `/record-quick` uses.

**NON-OPTIONAL** features at this tier (do not skip any of these):
- Narration (TTS)
- Start card (animated, HTML-rendered)
- End card (animated, HTML-rendered)
- Browser frame (with rounded corners, shadow)
- Click-zoom overlay
- Fade transitions
- Sound effects (click, transition)
- Background music (ambient, ducked under narration)
- Gradient background

```json
{
  "quality_tier": "walkthrough",
  "recording": {
    "resolution": { "width": 1920, "height": 1080 },
    "browser": "chromium",
    "show_cursor": true,
    "click_zoom": true,
    "click_zoom_level": 1.3,
    "browser_frame": true,
    "browser_frame_style": "minimal"
  },
  "narration": {
    "enabled": true,
    "provider": "fal-minimax",
    "fallback_provider": "local",
    "style": "conversational",
    "auto_generate_script": true
  },
  "start_card": {
    "enabled": true,
    "title": "auto",
    "subtitle": "auto",
    "duration_seconds": 3,
    "generation": "html"
  },
  "end_card": {
    "enabled": true,
    "text": "Thanks for watching",
    "duration_seconds": 3,
    "generation": "html"
  },
  "graphics": {
    "enabled": false
  },
  "sounds": {
    "enabled": true,
    "engine": "ffmpeg",
    "style": "subtle",
    "types": ["click", "transition"]
  },
  "background_music": {
    "enabled": true,
    "style": "ambient",
    "volume": 0.08,
    "duck_under_narration": true
  },
  "visual": {
    "background": "gradient",
    "background_colors": "auto",
    "theme": "auto",
    "annotations": true,
    "annotation_style": "minimal",
    "transitions": "fade",
    "transition_duration_ms": 300
  },
  "output": {
    "format": "mp4",
    "quality": "balanced",
    "combine_chunks": true
  }
}
```

**Auto behaviors**:
- `title: "auto"` — use the repo's package.json name or directory name
- `subtitle: "auto"` — use the repo's package.json description, or a short auto-generated summary
- `background_colors: "auto"` — extract primary colors from the app's CSS/theme and generate
  a complementary gradient. If extraction fails, use `["#080a0e", "#0c1118", "#101420"]`.
- `theme: "auto"` — derive from app's visual style (light → "minimal", dark → "dark")
- `annotation_style: "minimal"` — simple callouts using the app's accent color
- `auto_generate_script: true` — narration from the flow map, conversational tone
- `provider: "fal-minimax"` — requires FAL_KEY. Falls back to "local" if unavailable.

**When to suggest**: README demos, onboarding videos, stakeholder updates, documentation.

## Production

Full creative control. Every config option is surfaced to the Asker during planning.

```json
{
  "quality_tier": "production",
  "recording": {
    "resolution": { "width": 1920, "height": 1080 },
    "browser": "chromium",
    "show_cursor": true,
    "click_zoom": true,
    "click_zoom_level": "ask",
    "browser_frame": true,
    "browser_frame_style": "ask"
  },
  "narration": {
    "enabled": "ask",
    "provider": "ask",
    "voice_id": "ask",
    "style": "ask",
    "script": "ask"
  },
  "start_card": {
    "enabled": true,
    "title": "ask",
    "subtitle": "ask",
    "duration_seconds": "ask",
    "generation": "ask"
  },
  "end_card": {
    "enabled": true,
    "text": "ask",
    "duration_seconds": "ask"
  },
  "graphics": {
    "enabled": "ask",
    "provider": "ask",
    "items": "ask"
  },
  "sounds": {
    "enabled": "ask",
    "style": "ask",
    "types": "ask"
  },
  "background_music": {
    "enabled": "ask",
    "style": "ask",
    "volume": "ask"
  },
  "visual": {
    "background": "ask",
    "background_colors": "ask",
    "theme": "ask",
    "annotations": "ask",
    "transitions": "ask"
  },
  "output": {
    "format": "mp4",
    "quality": "ask",
    "combine_chunks": "ask"
  }
}
```

Fields marked `"ask"` are presented to the Asker during Phase 4. If the Asker says
"just pick something good", fall back to walkthrough defaults for that field.

**When to suggest**: Product launches, marketing, investor decks, conference demos.

## Theme Presets

Mix with any quality tier (walkthrough or production):

### Bright & Poppy
```json
{
  "background_colors": ["#FF6B6B", "#4ECDC4", "#FFE66D"],
  "accent_color": "#FF6B6B",
  "annotation_bg": "#FFE66D",
  "annotation_text": "#2C3E50",
  "transition": "slide",
  "browser_frame_color": "#FFFFFF"
}
```

### Minimal & Professional
```json
{
  "background_colors": ["#F8F9FA", "#E9ECEF"],
  "accent_color": "#0066FF",
  "annotation_bg": "rgba(0,0,0,0.75)",
  "annotation_text": "#FFFFFF",
  "transition": "fade",
  "browser_frame_color": "#F8F9FA"
}
```

### Dark & Technical
```json
{
  "background_colors": ["#0D1117", "#161B22"],
  "accent_color": "#58A6FF",
  "annotation_bg": "rgba(88,166,255,0.15)",
  "annotation_text": "#58A6FF",
  "transition": "cut",
  "browser_frame_color": "#21262D"
}
```

### Warm & Friendly
```json
{
  "background_colors": ["#FFF5EB", "#FFE0CC"],
  "accent_color": "#FF6B35",
  "annotation_bg": "rgba(255,165,89,0.2)",
  "annotation_text": "#8B4513",
  "transition": "fade",
  "browser_frame_color": "#FFFAF5"
}
```
