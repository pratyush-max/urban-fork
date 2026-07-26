import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D',
          borderRadius: '36px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* UF Monogram */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 300,
            color: '#D4AF37',
            fontFamily: 'serif',
            letterSpacing: '4px',
            display: 'flex',
          }}
        >
          UF
        </div>
      </div>
    ),
    { ...size }
  );
}
