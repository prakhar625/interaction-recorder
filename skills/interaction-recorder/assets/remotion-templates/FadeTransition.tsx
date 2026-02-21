import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

type FadeTransitionProps = {
  durationFrames?: number;
  type?: 'fade' | 'fadeToBlack';
  color?: string;
  children: React.ReactNode;
};

/**
 * FadeTransition applies a fade-in effect at the start of a segment.
 * Wrap any content in this component within a Sequence.
 *
 * Usage:
 *   <Sequence from={90} durationInFrames={60}>
 *     <FadeTransition durationFrames={9}>
 *       <MyScene />
 *     </FadeTransition>
 *   </Sequence>
 */
export const FadeTransition: React.FC<FadeTransitionProps> = ({
  durationFrames = 9,
  type = 'fade',
  color = '#000000',
  children,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (type === 'fadeToBlack') {
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill style={{ backgroundColor: color, opacity: 1 - fadeIn }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * TitleCard displays an animated title/intro card with:
 * - Optional background image
 * - Accent line that fades in
 * - Title that slides up with spring animation
 * - Subtitle that fades in with delay
 * - Everything fades out near the end
 *
 * Used for start cards and end cards. The background can be a gradient
 * (rendered by GradientBackground behind this component) or a static
 * image (from Playwright-rendered HTML or FAL AI generation).
 *
 * Usage:
 *   <Sequence durationInFrames={90}>
 *     <TitleCard
 *       title="SyntheticAudiences Demo"
 *       subtitle="AI-powered audience testing"
 *       backgroundImage={staticFile('assets/cards/start-card.png')}
 *       accentColor="#3ee8b5"
 *     />
 *   </Sequence>
 */
type TitleCardProps = {
  title: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  backgroundImage?: string;
  durationFrames?: number;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  bgColor = '#1a1a2e',
  textColor = '#FFFFFF',
  accentColor = '#4ECDC4',
  backgroundImage,
  durationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance for title
  const titleSpring = spring({
    fps,
    frame,
    config: { damping: 100, mass: 0.8 },
  });

  // Delayed spring for subtitle
  const subtitleSpring = spring({
    fps,
    frame: Math.max(0, frame - 8),
    config: { damping: 100, mass: 0.8 },
  });

  // Accent line width animation
  const accentWidth = interpolate(titleSpring, [0, 1], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out near end
  const fadeOut = interpolate(frame, [durationFrames - 15, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = Math.min(titleSpring, fadeOut);

  // Title slide up
  const titleY = interpolate(titleSpring, [0, 1], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle slide up (delayed)
  const subtitleY = interpolate(subtitleSpring, [0, 1], [25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Optional background image */}
      {backgroundImage && (
        <AbsoluteFill>
          <Img
            src={backgroundImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Dark overlay for text readability */}
          <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
        </AbsoluteFill>
      )}

      {/* Animated text content */}
      <div
        style={{
          textAlign: 'center',
          opacity,
          zIndex: 1,
          position: 'relative',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: accentWidth,
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
            margin: '0 auto 28px',
          }}
        />

        {/* Title */}
        <h1
          style={{
            color: textColor,
            fontSize: title.length > 30 ? 48 : 56,
            fontWeight: 700,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            margin: 0,
            letterSpacing: -1,
            transform: `translateY(${titleY}px)`,
            textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              color: textColor,
              opacity: subtitleSpring * 0.7,
              fontSize: 24,
              fontWeight: 400,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              marginTop: 16,
              maxWidth: 700,
              transform: `translateY(${subtitleY}px)`,
              textShadow: backgroundImage ? '0 1px 4px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
