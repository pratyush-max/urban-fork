'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollIndicator() {
  const { scrollY } = useScroll();
  
  // Fade out between 0 and 200px of scroll
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div 
      style={{ opacity }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
    >
      <div className="font-[Inter] text-xs uppercase tracking-widest text-[#B5B5B5]">
        Scroll to Explore
      </div>
      <div className="relative h-[20px] w-[1px] bg-[rgba(212,175,55,0.3)] overflow-hidden">
        <motion.div
          className="absolute top-0 left-[-1px] w-[3px] h-[6px] bg-[#D4AF37] rounded-full"
          animate={{
            y: [-6, 20]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </motion.div>
  );
}
