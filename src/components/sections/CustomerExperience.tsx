'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import AmbientParticles from '../ui/AmbientParticles';

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  review: string;
  rating: number;
  visitDate: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Alexander Dumont',
    initials: 'AD',
    review: 'The A5 Wagyu is transcendently prepared. But it is the level of quiet, anticipatory service that defines Urban Fork. An absolute triumph.',
    rating: 5,
    visitDate: 'October 2025',
  },
  {
    id: 't-2',
    name: 'Elena Rostova',
    initials: 'ER',
    review: 'Each category on the menu tells a story. The Meyer Lemon Tart is a masterclass in balance and acidity. A sensory experience unlike any other.',
    rating: 5,
    visitDate: 'November 2025',
  },
  {
    id: 't-3',
    name: 'Marcus Vance',
    initials: 'MV',
    review: 'A masterclass in culinary restraint. The citrus cured scallop was pristine. The dining room balances contemporary chic with timeless comfort.',
    rating: 5,
    visitDate: 'December 2025',
  },
  {
    id: 't-4',
    name: 'Charlotte Sterling',
    initials: 'CS',
    review: 'The Smoked Sage Old Fashioned is culinary theater in a glass. The aromas alone are worth the visit. Exceptional sommelier wine pairings.',
    rating: 5,
    visitDate: 'January 2026',
  },
  {
    id: 't-5',
    name: 'Dr. Julian Ward',
    initials: 'JW',
    review: 'From the rotating gold loading animation to the final dessert pour, every detail is considered. It is culinary poetry in motion.',
    rating: 5,
    visitDate: 'February 2026',
  },
];

export default function CustomerExperience() {
  const [isTabActive, setIsTabActive] = useState(true);

  // HTML5 Visibility API to pause animation when browser tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Double list to create seamless looping marquee
  const marqueeList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="experiences" className="relative bg-[#0D0D0D] py-32 overflow-hidden border-b border-white/5">
      <AmbientParticles className="absolute inset-0 z-0 pointer-events-none opacity-20" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-20 px-4">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
          Refined Reviews
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Voices of Urban Fork
        </h2>
        <div className="w-[60px] h-[1px] bg-[#D4AF37] mx-auto mt-6" />
      </div>

      {/* Infinite Marquee Track wrapper */}
      <div className="relative z-10 w-full overflow-hidden py-4 select-none">
        
        {/* Left & Right luxury gradient vignette fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-r from-[#0D0D0D] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-l from-[#0D0D0D] to-transparent z-20 pointer-events-none" />

        {/* Marquee Motion Container */}
        <div 
          className="animate-marquee hover:[animation-play-state:paused] flex gap-8 px-4"
          style={{ 
            animationPlayState: isTabActive ? undefined : 'paused'
          }}
        >
          {marqueeList.map((item, index) => (
            <TestimonialCard 
              key={`${item.id}-${index}`} 
              item={item} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// Testimonial Card Component
interface TestimonialCardProps {
  item: Testimonial;
}

function TestimonialCard({ item }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card w-[350px] md:w-[420px] p-8 rounded-xl flex flex-col justify-between shrink-0 relative overflow-hidden group border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300"
    >
      {/* Quotation mark glaze */}
      <span className="absolute -top-6 -right-2 font-serif text-[10rem] font-light text-white/5 pointer-events-none select-none italic">
        “
      </span>

      {/* Content */}
      <div className="space-y-6 relative z-10">
        
        {/* Stars block */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-1"
        >
          {[...Array(item.rating)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: (idx: number) => ({
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                  },
                }),
              }}
            >
              <Star size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
            </motion.div>
          ))}
        </motion.div>

        {/* Review body */}
        <p className="font-sans text-sm text-[#B5B5B5] font-light leading-relaxed italic">
          "{item.review}"
        </p>

      </div>

      {/* Profile detail */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
        
        {/* Luxury initials Profile Badge */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#171717] via-[#221c10] to-[#171717] border border-[#D4AF37]/30 flex items-center justify-center text-xs font-serif font-light text-[#D4AF37] tracking-wider shrink-0 select-none shadow-[0_0_15px_rgba(212,175,55,0.1)]">
          {item.initials}
        </div>

        <div>
          <h4 className="font-serif text-base text-white font-light tracking-wide">
            {item.name}
          </h4>
          <span className="font-sans text-[10px] text-[#B5B5B5]/60 uppercase tracking-widest block mt-0.5">
            Visit Date: {item.visitDate}
          </span>
        </div>

      </div>

    </motion.div>
  );
}
