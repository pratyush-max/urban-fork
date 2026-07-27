'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerScrollTrigger();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    let rafId: number;
    const rafCallback = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(rafCallback);
    };
    rafId = requestAnimationFrame(rafCallback);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
