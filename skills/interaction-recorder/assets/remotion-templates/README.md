# Remotion Starter Templates

Copy these into your Remotion project's `src/components/` directory during Phase 5.

## Components

### BrowserFrame.tsx
macOS-style browser chrome that wraps the screen recording.
- Props: `url`, `style` (minimal/full), `frameColor`, `scale`, `accentColor`
- For dark apps: set `frameColor="#13161c"` and the traffic light dots auto-adjust
- Default scale 0.85 leaves room for gradient background behind the frame

### ClickZoomOverlay.tsx
Reads the action manifest from Phase 7 recordings and applies spring-based zoom on clicks.
- Props: `actions` (from segment manifest), `fps`, `zoomLevel` (default 1.3), `holdFrames`
- Zooms into click coordinates, holds briefly, eases back
- Optional click ripple indicator

### GradientBackground.tsx
Animated gradient background that fills the full canvas behind the browser frame.
- Props: `colors` (array), `style` (linear/radial/mesh), `speed`
- Subtle angle rotation over time for visual interest

### AnnotationOverlay.tsx
Timed callout bubbles with spring entrance animation.
- Props: `annotations` array with `{ text, position, startFrame, durationFrames }`
- Configurable position (top/bottom/left/right)
- Arrow pointer toward target area

### FadeTransition.tsx
Two sub-components:
- **FadeTransition**: opacity fade for segment transitions. Props: `durationFrames`, `type` (fade/fadeToBlack)
- **TitleCard**: animated card with spring entrance, accent line, title, subtitle.
  Supports optional `backgroundImage` (from Playwright-rendered HTML or FAL AI generation).
  Spring-animated text entry with staggered subtitle. Fades out near end of duration.
  Props: `title`, `subtitle`, `bgColor`, `accentColor`, `backgroundImage`, `durationFrames`

## Layer Order in DemoVideo.tsx

```
1. GradientBackground       — fills entire canvas
2. Start card (Sequence)    — shown for first N frames
3. BrowserFrame             — wraps each segment's recording
   └── Video (segment)      — the actual screen recording
   └── ClickZoomOverlay     — zoom effect on clicks
4. AnnotationOverlay        — callout bubbles over the frame
5. FadeTransition           — between segments
6. Audio (narration)        — per-segment, synced by construction
7. Audio (background music) — full duration, ducked under narration
8. Audio (click sounds)     — triggered by action manifest timestamps
9. End card (Sequence)      — shown for last N frames
```

## Customization

- **Dark theme**: Set `frameColor="#13161c"`, gradient colors `["#080a0e", "#0c1118"]`
- **Light theme**: Default colors work well, or use `frameColor="#F8F9FA"`, gradient `["#F8F9FA", "#E9ECEF"]`
- **Accent color**: Pass the app's accent color to BrowserFrame and AnnotationOverlay
  to ensure visual consistency with the recorded UI

## File References in Remotion

Remotion serves static files from `public/`. During Phase 5 setup, symlinks are created:
```
remotion/public/recordings → ../../recordings
remotion/public/assets → ../../assets
```

Reference files as:
```tsx
import { staticFile } from 'remotion';
<Video src={staticFile('recordings/segment-01.mp4')} />
<Audio src={staticFile('assets/narration/segment-01.wav')} />
<Img src={staticFile('assets/cards/start-card.png')} />
```
