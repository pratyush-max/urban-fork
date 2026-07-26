import { ImageResponse } from 'next/og';
import { seoConfig } from '@/constants/seo';

export const runtime = 'edge';
export const alt = seoConfig.ogImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.08) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Top gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Bottom gold accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Diamond separator above title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(212,175,55,0.5)',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#D4AF37',
              transform: 'rotate(45deg)',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(212,175,55,0.5)',
              display: 'flex',
            }}
          />
        </div>

        {/* Restaurant Name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 300,
            color: '#FFFFFF',
            letterSpacing: '12px',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'serif',
            display: 'flex',
          }}
        >
          Urban Fork
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 300,
            color: '#D4AF37',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom: '32px',
            fontFamily: 'serif',
            display: 'flex',
          }}
        >
          Where Every Bite Becomes A Memory
        </div>

        {/* Diamond separator below tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(212,175,55,0.5)',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#D4AF37',
              transform: 'rotate(45deg)',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(212,175,55,0.5)',
              display: 'flex',
            }}
          />
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(181,181,181,0.7)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          Manhattan · New York
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
