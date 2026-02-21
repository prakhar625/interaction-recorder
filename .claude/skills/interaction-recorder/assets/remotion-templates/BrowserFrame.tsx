import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

type BrowserFrameProps = {
  url?: string;
  style?: 'minimal' | 'full';
  frameColor?: string;
  scale?: number;
  children: React.ReactNode;
};

/**
 * BrowserFrame wraps content in a macOS-style browser chrome.
 * Used to make raw screen recordings look polished and professional.
 *
 * Usage:
 *   <BrowserFrame url="localhost:3000" style="minimal">
 *     <Video src={staticFile('recording.mp4')} />
 *   </BrowserFrame>
 */
export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url = 'localhost:3000',
  style = 'minimal',
  frameColor = '#F8F9FA',
  scale = 0.85,
  children,
}) => {
  const titleBarHeight = style === 'full' ? 52 : 40;
  const borderRadius = 12;
  const shadowSize = 30;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          borderRadius,
          overflow: 'hidden',
          boxShadow: `0 ${shadowSize / 2}px ${shadowSize}px rgba(0, 0, 0, 0.25)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: titleBarHeight,
            backgroundColor: frameColor,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 16,
            flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FF5F57',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FEBC2E',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#28C840',
              }}
            />
          </div>

          {/* URL bar */}
          {style === 'full' && (
            <div
              style={{
                flex: 1,
                marginLeft: 24,
                marginRight: 24,
                height: 28,
                backgroundColor: 'rgba(0,0,0,0.06)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              {url}
            </div>
          )}

          {style === 'minimal' && (
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'rgba(0,0,0,0.4)',
              }}
            >
              {url}
            </div>
          )}
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
