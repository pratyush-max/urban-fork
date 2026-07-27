'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

interface LoadingExperienceProps {
  onComplete: () => void;
}

export default function LoadingExperience({ onComplete }: LoadingExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !counterRef.current || !lineRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle pulsing of text
      gsap.to(textRef.current, {
        opacity: 0.6,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // Counter object for tweening
      const counterState = { value: 0 };
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimatingOut(true);
          
          // Animate out sequence
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.8,
            delay: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              onComplete();
            }
          });
        }
      });

      // Animate counter and line width
      tl.to(counterState, {
        value: 100,
        duration: 3.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = `${Math.round(counterState.value)}%`;
          }
        }
      }, 0);

      tl.fromTo(lineRef.current, 
        { width: '0%' },
        { width: '100%', duration: 3.5, ease: 'power2.inOut' },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-60 bg-[#0D0D0D] flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {/* Background Video — preload=auto required for iOS Safari autoplay; pointer-events:none prevents the native play button from overlaying the counter */}
      <video 
        src="/videos/intro.mp4"
        autoPlay
        muted
        playsInline
        loop
        aria-hidden="true"
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div 
          ref={textRef}
          role="status"
          aria-label="Loading Urban Fork"
          className="font-serif font-light text-4xl uppercase tracking-[0.3em] text-[#D4AF37] mb-8"
        >
          Urban Fork
        </div>
        
        <div 
          ref={counterRef}
          className="loading-counter font-serif text-5xl md:text-6xl text-[#D4AF37] mb-4"
        >
          0%
        </div>
        
        {/* Progress Line */}
        <div className="w-full max-w-[200px] h-[1px] bg-[#D4AF37]/20">
          <div 
            ref={lineRef}
            className="h-full bg-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );
}
