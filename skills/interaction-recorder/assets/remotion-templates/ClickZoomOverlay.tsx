import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';

type ClickAction = {
  timestamp_ms: number;
  x: number;
  y: number;
  description?: string;
};

type ClickZoomOverlayProps = {
  actions: ClickAction[];
  zoomLevel?: number;
  zoomDurationFrames?: number;
  holdFrames?: number;
  showCursor?: boolean;
  cursorColor?: string;
  children: React.ReactNode;
};

/**
 * ClickZoomOverlay reads the action manifest and applies a smooth
 * zoom-to-click effect. On each click event:
 * 1. Smoothly zoom in (spring) centered on click coordinates
 * 2. Hold the zoom briefly
 * 3. Ease back to normal view
 *
 * Also optionally renders a click indicator (ripple) at the click point.
 *
 * Usage:
 *   <ClickZoomOverlay actions={manifest.actions} zoomLevel={1.3}>
 *     <Video src={staticFile('recording.mp4')} />
 *   </ClickZoomOverlay>
 */
export const ClickZoomOverlay: React.FC<ClickZoomOverlayProps> = ({
  actions,
  zoomLevel = 1.3,
  zoomDurationFrames = 8,
  holdFrames = 12,
  showCursor = true,
  cursorColor = 'rgba(255, 120, 50, 0.6)',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Convert click actions to frame-based timing
  const clickFrames = actions
    .filter((a) => a.type === 'click' || a.x !== undefined)
    .map((a) => ({
      frame: Math.round((a.timestamp_ms / 1000) * fps),
      x: a.x,
      y: a.y,
    }));

  // Find the current active zoom (if any)
  let currentZoom = 1;
  let currentOffsetX = 0;
  let currentOffsetY = 0;
  let activeClickX = 0;
  let activeClickY = 0;
  let clickProgress = 0;

  const totalZoomFrames = zoomDurationFrames + holdFrames + zoomDurationFrames;

  for (const click of clickFrames) {
    const zoomStart = click.frame - zoomDurationFrames; // Start zooming before the click
    const zoomEnd = click.frame + holdFrames + zoomDurationFrames;

    if (frame >= zoomStart && frame <= zoomEnd) {
      const relativeFrame = frame - zoomStart;

      if (relativeFrame < zoomDurationFrames) {
        // Zooming in
        const progress = spring({
          fps,
          frame: relativeFrame,
          config: { damping: 100, mass: 0.5 },
        });
        currentZoom = interpolate(progress, [0, 1], [1, zoomLevel]);
      } else if (relativeFrame < zoomDurationFrames + holdFrames) {
        // Holding
        currentZoom = zoomLevel;
      } else {
        // Zooming out
        const outFrame = relativeFrame - zoomDurationFrames - holdFrames;
        const progress = interpolate(outFrame, [0, zoomDurationFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        currentZoom = interpolate(progress, [0, 1], [zoomLevel, 1]);
      }

      // Calculate offset to center the zoom on the click point
      const zoomFactor = currentZoom - 1;
      currentOffsetX = -(click.x / width - 0.5) * zoomFactor * width;
      currentOffsetY = -(click.y / height - 0.5) * zoomFactor * height;
      activeClickX = click.x;
      activeClickY = click.y;

      // Click ripple progress
      const clickRelative = frame - click.frame;
      if (clickRelative >= 0 && clickRelative < 20) {
        clickProgress = clickRelative / 20;
      }

      break; // Only one zoom at a time
    }
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${currentZoom}) translate(${currentOffsetX / currentZoom}px, ${currentOffsetY / currentZoom}px)`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>

      {/* Click ripple indicator */}
      {showCursor && clickProgress > 0 && clickProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            left: activeClickX - 20,
            top: activeClickY - 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `3px solid ${cursorColor}`,
            backgroundColor: interpolateOpacity(cursorColor, 1 - clickProgress),
            transform: `scale(${interpolate(clickProgress, [0, 1], [0.5, 2])})`,
            opacity: 1 - clickProgress,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

function interpolateOpacity(color: string, opacity: number): string {
  // Simple opacity adjustment for rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  return color;
}
