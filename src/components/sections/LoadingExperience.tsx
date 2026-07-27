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
  const videoRef = useRef<HTMLVideoElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Timeout fallback: if video is not ready/playing in 2.5s, speed up preloader timeline to transition to Hero
    const timeoutId = setTimeout(() => {
      if (!videoPlaying) {
        console.warn("Preloader video failed to play within 2.5s. Speeding up exit transition.");
        setIsAutoplayBlocked(true);
      }
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [videoPlaying]);

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

      // Store reference to timeline to allow dynamic timeScale adjustments
      tlRef.current = tl;

      // Reactively apply timescale acceleration if autoplay is blocked
      if (isAutoplayBlocked) {
        tl.timeScale(2.5);
      }

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
  }, [onComplete, isAutoplayBlocked]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-60 bg-[#0D0D0D] flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {/* Background Video — source tag for better decoder MIME-type; pointer-events:none prevents native iOS play overlays */}
      <video 
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        aria-hidden="true"
        preload={isMobile ? "metadata" : "auto"}
        onPlaying={() => setVideoPlaying(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoPlaying ? 'opacity-30' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      
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
