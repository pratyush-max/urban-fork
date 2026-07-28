'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';
import MagneticButton from '../ui/MagneticButton';
import ScrollIndicator from '../ui/ScrollIndicator';
import AmbientParticles from '../ui/AmbientParticles';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    registerScrollTrigger();

    const ctx = gsap.context(() => {
      // Ensure elements are invisible before animation
      gsap.set([lineRef.current, subtextRef.current, buttonsRef.current], { autoAlpha: 0 });
      gsap.set('.hero-char', { autoAlpha: 0, y: 40 });
      gsap.set(lineRef.current, { scaleX: 0 });

      // Create sequence timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate headline characters
      tl.to('.hero-char', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.04,
        ease: 'power3.out',
      })
      // Animate gold decorative line
      .to(lineRef.current, {
        autoAlpha: 1,
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '-=0.4')
      // Animate subtext
      .fromTo(subtextRef.current, 
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      // Animate buttons
      .fromTo(buttonsRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );

      // Parallax ScrollTrigger for background video
      if (videoRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          animation: gsap.to(videoRef.current, {
            scale: 1.15,
            ease: 'none',
          }),
        });
      }
    }, sectionRef);

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

  const headline = "Urban Fork";

  return (
    <section 
      id="hero" 
      ref={sectionRef} 
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      {/* Background Video — source tag for better decoder MIME-type; pointer-events:none prevents native iOS play overlays */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        preload="none"
        onPlaying={() => setVideoPlaying(true)}
        className={`absolute inset-0 w-full h-full object-cover transform origin-center transition-opacity duration-700 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />
      
      {/* Ambient Particles */}
      <AmbientParticles className="absolute inset-0 z-20 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Main Headline with native character split */}
        <h1 
          className="font-serif font-light uppercase tracking-[0.15em] text-[#FFFFFF] mb-6 overflow-visible py-2 leading-none"
          style={{ fontSize: 'clamp(2rem, 10vw, 7rem)', wordBreak: 'keep-all' }}
        >
          {headline.split('').map((char, idx) => (
            <span key={idx} className="hero-char inline-block whitespace-pre">
              {char}
            </span>
          ))}
        </h1>

        {/* Decorative Gold Line */}
        <div 
          ref={lineRef}
          className="w-[60px] h-[1px] bg-[#D4AF37] mb-8 transform origin-center"
        />

        {/* Subtext */}
        <p 
          ref={subtextRef}
          className="font-sans text-lg md:text-xl font-light text-[#B5B5B5] tracking-wide mb-10"
        >
          Where Every Bite Becomes A Memory
        </p>

        {/* Buttons */}
        <div 
          ref={buttonsRef}
          className="flex flex-row gap-6 mt-2"
        >
          <MagneticButton variant="filled" href="#reservations">
            Reserve a Table
          </MagneticButton>
          <MagneticButton variant="outlined" href="#menu">
            Explore Menu
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
