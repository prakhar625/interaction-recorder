import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

type GradientBackgroundProps = {
  colors?: string[];
  animationSpeed?: number;
  angle?: number;
  style?: 'linear' | 'radial' | 'mesh';
};

/**
 * GradientBackground renders an animated gradient behind the browser frame.
 * The gradient subtly shifts over time so it doesn't look static in the video.
 *
 * Usage:
 *   <GradientBackground colors={['#1a1a2e', '#16213e', '#0f3460']} />
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ['#1a1a2e', '#16213e', '#0f3460'],
  animationSpeed = 0.5,
  angle = 135,
  style = 'linear',
}) => {
  const frame = useCurrentFrame();

  // Subtle angle rotation over time
  const animatedAngle = angle + interpolate(
    frame,
    [0, 300],
    [0, 15 * animationSpeed],
    { extrapolateRight: 'extend' }
  );

  // Subtle gradient position shift
  const shift = interpolate(
    frame,
    [0, 600],
    [0, 10 * animationSpeed],
    { extrapolateRight: 'extend' }
  );

  let background: string;

  if (style === 'radial') {
    const x = 50 + Math.sin(shift * 0.01) * 10;
    const y = 50 + Math.cos(shift * 0.01) * 10;
    background = `radial-gradient(ellipse at ${x}% ${y}%, ${colors.join(', ')})`;
  } else if (style === 'mesh') {
    // Simulated mesh gradient using multiple radial gradients
    background = [
      `radial-gradient(at ${30 + shift}% ${20 + shift * 0.5}%, ${colors[0]}88 0%, transparent 50%)`,
      `radial-gradient(at ${70 - shift * 0.3}% ${80 - shift * 0.2}%, ${colors[1] || colors[0]}88 0%, transparent 50%)`,
      `radial-gradient(at ${50}% ${50}%, ${colors[2] || colors[1] || colors[0]}44 0%, transparent 70%)`,
      `linear-gradient(${animatedAngle}deg, ${colors[0]}, ${colors[colors.length - 1]})`,
    ].join(', ');
  } else {
    // Linear gradient with animated angle
    const colorStops = colors.map((c, i) => {
      const pos = (i / (colors.length - 1)) * 100 + shift * (i % 2 === 0 ? 1 : -1) * 0.1;
      return `${c} ${Math.max(0, Math.min(100, pos))}%`;
    });
    background = `linear-gradient(${animatedAngle}deg, ${colorStops.join(', ')})`;
  }

  return (
    <AbsoluteFill
      style={{
        background,
        transition: 'none', // Remotion: no CSS transitions
      }}
    />
  );
};
