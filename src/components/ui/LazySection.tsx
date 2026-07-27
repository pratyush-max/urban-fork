'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
}

/**
 * LazySection component optimizes mobile performance by deferring
 * the rendering and mounting of below-the-fold components until
 * they are about to scroll into the viewport.
 */
export default function LazySection({ children, minHeight = '50vh' }: LazySectionProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // Load 300px before coming into viewport for a seamless transition
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight }} className="w-full">
      {inView ? children : null}
    </div>
  );
}
