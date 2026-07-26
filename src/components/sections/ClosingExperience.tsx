'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import MagneticButton from '../ui/MagneticButton';

export default function ClosingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    const ctaBar = ctaBarRef.current;

    if (!section || !video || !content || !ctaBar) return;

    const ctx = gsap.context(() => {
      // Ken Burns slow zoom effect
      gsap.fromTo(
        video,
        { scale: 1 },
        {
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );

      // Animate headline words using class selectors
      gsap.from('.closing-word', {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: content,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Sticky CTA Bar fade in
      gsap.fromTo(
        ctaBar,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '80% center',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  // Viewport observer to play/pause video when off-screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

  const line1 = "Reserve Your Experience";
  const line2 = "Luxury Never Tasted Better";

  return (
    <section id="closing" ref={sectionRef} className="relative min-h-[150vh] bg-[#0D0D0D] z-10">
      {/* Video Background Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0D0D0D] z-0">
        <video
          ref={videoRef}
          src="/videos/closing.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content Overlay */}
        <div 
          ref={contentRef}
          className="absolute inset-0 z-20 flex h-full items-center justify-center"
        >
          <div className="text-center px-4">
            <p className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              THE EXPERIENCE
            </p>
            <h2 className="font-serif text-4xl font-light text-white md:text-5xl lg:text-7xl overflow-hidden py-1">
              {line1.split(' ').map((word, idx) => (
                <span key={idx} className="closing-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h2>
            <h3 className="font-serif text-4xl font-light md:text-5xl lg:text-7xl gold-shimmer overflow-hidden py-1">
              {line2.split(' ').map((word, idx) => (
                <span key={idx} className="closing-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h3>
            <div className="mx-auto my-8 h-[1px] w-[80px] bg-[#D4AF37]" />
            <p className="mx-auto max-w-xl font-sans text-lg font-light text-[#B5B5B5]">
              An unforgettable journey through flavor, ambiance, and artistry awaits
            </p>
            <div className="mt-10 flex justify-center">
              <MagneticButton variant="filled" href="#reservations" className="px-8 py-4">
                Book Your Table
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA Bar */}
      <div 
        ref={ctaBarRef}
        className="fixed bottom-0 left-0 right-0 z-20 flex w-full items-center justify-between border-t border-[#D4AF37]/30 bg-[rgba(13,13,13,0.9)] px-8 py-4 backdrop-blur-xl md:px-16 pointer-events-none opacity-0"
      >
        <span className="font-sans text-sm text-[#B5B5B5]">
          Ready to experience Urban Fork?
        </span>
        <MagneticButton variant="filled" href="#reservations" className="px-6 py-2 text-sm">
          Reserve Now
        </MagneticButton>
      </div>
    </section>
  );
}
