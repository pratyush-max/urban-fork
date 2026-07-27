'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerScrollTrigger } from '@/lib/gsap'

const counters = [
  { value: 15, suffix: '+', label: 'Years of Excellence' },
  { value: 3, suffix: '', label: 'Michelin Stars' },
  { value: 200, suffix: '+', label: 'Signature Dishes' },
]

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textElementsRef = useRef<HTMLDivElement>(null)
  const statsRowRef = useRef<HTMLDivElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [videoPlaying, setVideoPlaying] = useState(false);

  // Play/pause background video based on viewport intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial play check
    video.play()
      .then(() => setVideoPlaying(true))
      .catch((err) => {
        console.warn("BrandStory video autoplay blocked or failed:", err);
        setVideoPlaying(false);
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
              .then(() => setVideoPlaying(true))
              .catch(() => setVideoPlaying(false));
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

  useEffect(() => {
    registerScrollTrigger()
    const ctx = gsap.context(() => {
      // 1. Text elements slide in
      if (textElementsRef.current) {
        const children = textElementsRef.current.children
        gsap.fromTo(
          children,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 2. Gold line scaleX
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 3. Counters animation
      if (statsRowRef.current) {
        const proxy = { val0: 0, val1: 0, val2: 0 }
        
        gsap.to(proxy, {
          val0: counters[0].value,
          val1: counters[1].value,
          val2: counters[2].value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (counterRefs.current[0]) counterRefs.current[0].innerHTML = Math.floor(proxy.val0).toString()
            if (counterRefs.current[1]) counterRefs.current[1].innerHTML = Math.floor(proxy.val1).toString()
            if (counterRefs.current[2]) counterRefs.current[2].innerHTML = Math.floor(proxy.val2).toString()
          },
        })
      }

      // 4. Video clip-path reveal
      if (videoContainerRef.current) {
        gsap.fromTo(
          videoContainerRef.current,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 1,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8 overflow-hidden bg-[#0D0D0D]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <div ref={lineRef} className="w-[40px] h-[2px] bg-[#D4AF37] origin-left" />
          
          <div ref={textElementsRef}>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mt-6">
              OUR STORY
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mt-4 whitespace-pre-line">
              {'A Legacy of\nCulinary Excellence'}
            </h2>
            <p className="font-sans text-base text-[#B5B5B5] font-light leading-relaxed mt-8 max-w-lg">
              For over fifteen years, Urban Fork has been redefining the art of fine dining in the heart of Manhattan. Our philosophy is simple — source the finest ingredients, honor time-tested techniques, and create moments that linger long after the last bite.
            </p>
          </div>

          {/* Stats Row */}
          <div ref={statsRowRef} className="flex flex-row gap-12 mt-12 overflow-hidden">
            {counters.map((counter, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="font-serif text-4xl text-[#D4AF37] flex items-baseline">
                  <span ref={(el) => { counterRefs.current[idx] = el }}>0</span>
                  <span>{counter.suffix}</span>
                </div>
                <p className="font-sans text-xs uppercase tracking-wider text-[#B5B5B5] mt-1 max-w-[100px]">
                  {counter.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full flex justify-center lg:justify-end h-full">
          <div
            ref={videoContainerRef}
            className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden border border-[#D4AF37]/20"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              preload="none"
              className={`w-full h-full object-cover transition-opacity duration-700 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
              style={{ pointerEvents: 'none' }}
            >
              <source src="/videos/brand-story.mp4" type="video/mp4" />
            </video>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent to-30% pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
