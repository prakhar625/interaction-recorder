# Remotion Knowledge Base

Local reference for Remotion — the React framework for programmatic video creation.
Source: https://www.remotion.dev/llms.txt and official docs.

---

## Overview

Remotion creates videos programmatically using React.js. All output should be valid React/TypeScript.

## Project Structure

A Remotion project needs: an entry file, a Root file, and component files.

**Scaffold a new project:**
```bash
npx create-video@latest --blank
```

**Entry file** (`src/index.ts`):
```ts
import { registerRoot } from 'remotion';
import { Root } from './Root';
registerRoot(Root);
```

**Root file** (`src/Root.tsx`):
```tsx
import { Composition } from 'remotion';
import { MyComp } from './MyComp';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComp}
        durationInFrames={120}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
```

A `<Composition>` defines a renderable video. It consists of:
- `component` — the React component
- `id` — unique identifier (used for rendering)
- `durationInFrames` — total length
- `width` / `height` — dimensions (default: 1920×1080)
- `fps` — frame rate (default: 30)
- `defaultProps` — must match the component's prop shape

## Core Hooks

### useCurrentFrame()
Returns the current frame number (0-indexed). Inside a `<Sequence>`, returns the frame relative to
that sequence's start.

```tsx
import { useCurrentFrame } from 'remotion';

export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  return <div>Frame {frame}</div>;
};
```

### useVideoConfig()
Returns `{ fps, durationInFrames, height, width }` of the current composition.

```tsx
import { useVideoConfig } from 'remotion';
const { fps, durationInFrames, height, width } = useVideoConfig();
```

## Core Components

### AbsoluteFill
Layers elements on top of each other (position: absolute, full size).
Last child renders on top.

```tsx
import { AbsoluteFill } from 'remotion';

<AbsoluteFill>
  <AbsoluteFill style={{ background: 'blue' }}>Back layer</AbsoluteFill>
  <AbsoluteFill>Front layer</AbsoluteFill>
</AbsoluteFill>
```

### Sequence
Time-shifts children. `from` specifies when it appears. Children's `useCurrentFrame()` starts at 0
relative to the sequence start.

```tsx
import { Sequence } from 'remotion';

<Sequence from={30} durationInFrames={60}>
  <MyComponent /> {/* useCurrentFrame() returns 0 at global frame 30 */}
</Sequence>
```

- `from` can be negative (trims the beginning of the content)
- `durationInFrames` controls how long it's mounted
- Sequences nest and cascade (a sequence at 30 inside one at 60 starts at 90)
- `layout="none"` removes the default AbsoluteFill wrapper

### Series
Displays elements after one another (no manual `from` calculation needed):

```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={30}>
    <SceneOne />
  </Series.Sequence>
  <Series.Sequence durationInFrames={45}>
    <SceneTwo />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30} offset={-10}>
    <SceneThree /> {/* Starts 10 frames earlier — overlaps with SceneTwo */}
  </Series.Sequence>
</Series>
```

### TransitionSeries
Like Series, but with animated transitions between sequences:

```tsx
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneOne />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={springTiming({ config: { damping: 200 } })}
    presentation={fade()}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneTwo />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={linearTiming({ durationInFrames: 30 })}
    presentation={wipe()}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneThree />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Order matters: `TransitionSeries.Transition` must be between `TransitionSeries.Sequence` tags.

## Media Components

### Video
```tsx
import { Video } from '@remotion/media';

<Video
  src="https://example.com/video.mp4"
  style={{ width: '100%' }}
  trimBefore={60}    // Trim first 2s (at 30fps)
  trimAfter={120}    // Stop at 4s mark
  volume={0.8}       // 0 to 1
/>
```

### Audio
```tsx
import { Audio } from '@remotion/media';

<Audio
  src={staticFile('voice.mp3')}
  volume={(f) => interpolate(f, [0, 30], [0, 1], { extrapolateLeft: 'clamp' })}
  trimBefore={0}
  trimAfter={300}
/>
```

### Img
```tsx
import { Img } from 'remotion';
<Img src={staticFile('diagram.png')} style={{ width: '100%' }} />
```

### Static files
Reference files from the `public/` folder:
```tsx
import { staticFile } from 'remotion';
<Audio src={staticFile('audio.mp3')} />
```

## Animation Primitives

### interpolate()
Maps a range of values to another range. Always use `clamp` by default.

```tsx
import { interpolate } from 'remotion';

const opacity = interpolate(frame, [0, 60], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

const scale = interpolate(frame, [0, 30], [0.5, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

### spring()
Physics-based animation. Animates from 0 to 1 by default with natural overshoot.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  fps,
  frame,
  config: { damping: 200 },
});

// Delayed spring (starts at frame 20):
const delayedScale = spring({
  fps,
  frame: frame - 20,
  config: { damping: 200 },
});
```

### interpolateColors()
Map a range of values to colors:
```tsx
import { interpolateColors } from 'remotion';
const color = interpolateColors(frame, [0, 60], ['#ff0000', '#0000ff']);
```

### random()
Deterministic random — Remotion forbids `Math.random()`. Always use a seed:
```tsx
import { random } from 'remotion';
const value = random('my-seed'); // Returns 0-1, always the same for the same seed
```

## Rendering

**Render a video:**
```bash
npx remotion render MyComp --output=output.mp4 --codec=h264
```

**Render a still image:**
```bash
npx remotion still MyComp --frame=0 --output=thumbnail.png
```

**Preview:**
```bash
npx remotion preview
```

**Key CLI flags:**
- `--codec=h264` — output codec
- `--crf=18` — quality (lower = better, 18 is high quality)
- `--fps=30` — frame rate
- `--output=path` — output file path

## Important Rules

1. **Deterministic code only** — no `Math.random()`, use `random()` with seeds
2. **No CSS transitions/animations** — use `useCurrentFrame()` + `interpolate()` instead
3. **All animations must be frame-driven** — via `useCurrentFrame()`, not time-based
4. **Use special media tags** — `<Video>`, `<Audio>`, `<Img>` instead of HTML equivalents
5. **Assets from public/** — use `staticFile()` to reference them

## Package Reference

| Package | Contents |
|---------|----------|
| `remotion` | Core: Composition, Sequence, Series, AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile, random |
| `@remotion/media` | Video and Audio components |
| `@remotion/transitions` | TransitionSeries, fade, wipe, slide, springTiming, linearTiming |
| `@remotion/gif` | Gif component for animated GIFs |
| `@remotion/cli` | CLI for rendering (npx remotion render/still/preview) |
