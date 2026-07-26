'use client';

import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  opacity: number;
  duration: number;
  delay: number;
  blur: number;
  xMove: number;
}

interface AmbientParticlesProps {
  className?: string;
}

export default function AmbientParticles({ className = '' }: AmbientParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      generated.push({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * -40,
        blur: Math.random() > 0.5 ? Math.random() * 2 : 0,
        xMove: (Math.random() - 0.5) * 100,
      });
    }
    setParticles(generated);
  }, []);

  if (particles.length === 0) {
    return <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`} />;
  }

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            filter: p.blur ? `blur(${p.blur}px)` : 'none',
            animation: `floatUp${p.id} ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: particles.map(p => `
          @keyframes floatUp${p.id} {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(${p.xMove / 2}px, -30vh);
            }
            100% {
              transform: translate(${p.xMove}px, -60vh);
            }
          }
        `).join('\n')
      }} />
    </div>
  );
}
