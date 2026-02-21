import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Annotation = {
  text: string;
  x: number;
  y: number;
  startFrame: number;
  durationFrames: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  type?: 'callout' | 'highlight' | 'arrow';
};

type AnnotationOverlayProps = {
  annotations: Annotation[];
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
};

/**
 * AnnotationOverlay displays timed callout annotations over the video.
 * Each annotation fades/springs in at its start frame and fades out when done.
 *
 * Usage:
 *   <AnnotationOverlay annotations={[
 *     { text: "Click here to create", x: 450, y: 300, startFrame: 60, durationFrames: 90 }
 *   ]} />
 */
export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  annotations,
  bgColor = 'rgba(0, 0, 0, 0.75)',
  textColor = '#FFFFFF',
  borderRadius = 8,
  fontSize = 16,
}) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {annotations.map((annotation, i) => (
        <Sequence
          key={i}
          from={annotation.startFrame}
          durationInFrames={annotation.durationFrames}
          layout="none"
        >
          <AnnotationBubble
            annotation={annotation}
            bgColor={bgColor}
            textColor={textColor}
            borderRadius={borderRadius}
            fontSize={fontSize}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const AnnotationBubble: React.FC<{
  annotation: Annotation;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
}> = ({ annotation, bgColor, textColor, borderRadius, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeInFrames = 10;
  const fadeOutFrames = 10;

  // Spring-based entrance
  const enterProgress = spring({
    fps,
    frame,
    config: { damping: 100, mass: 0.8 },
  });

  // Fade-out near the end
  const fadeOut = interpolate(
    frame,
    [annotation.durationFrames - fadeOutFrames, annotation.durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = Math.min(enterProgress, fadeOut);
  const slideY = interpolate(enterProgress, [0, 1], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Position the annotation relative to the target point
  const pos = annotation.position || 'top';
  let left = annotation.x;
  let top = annotation.y;
  const offset = 16;

  switch (pos) {
    case 'top':
      top = annotation.y - offset;
      break;
    case 'bottom':
      top = annotation.y + offset;
      break;
    case 'left':
      left = annotation.x - offset;
      break;
    case 'right':
      left = annotation.x + offset;
      break;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translate(-50%, ${pos === 'bottom' ? '0' : '-100%'}) translateY(${slideY}px)`,
        opacity,
        backgroundColor: bgColor,
        color: textColor,
        padding: '8px 16px',
        borderRadius,
        fontSize,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 500,
        maxWidth: 300,
        textAlign: 'center',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {annotation.text}

      {/* Small arrow pointing to the target */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          [pos === 'bottom' ? 'top' : 'bottom']: -6,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          [pos === 'bottom' ? 'borderBottom' : 'borderTop']: `6px solid ${bgColor}`,
        }}
      />
    </div>
  );
};
