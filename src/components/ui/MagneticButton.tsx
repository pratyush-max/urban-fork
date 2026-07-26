'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant: 'filled' | 'outlined';
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function MagneticButton({ 
  children, 
  variant, 
  className = '', 
  onClick, 
  href,
  type = 'button',
  disabled = false
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic strength
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = `relative overflow-hidden inline-block px-8 py-4 font-[Inter] font-medium tracking-wider uppercase text-sm transition-colors duration-300 ${className}`;
  
  const variantClasses = variant === 'filled'
    ? 'bg-[#D4AF37] text-[#0D0D0D] hover:bg-[#CFAE5B] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
    : 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]';

  const innerContent = (
    <>
      <span className="relative z-10">{children}</span>
      {/* Shimmer effect */}
      <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent hover:animate-[shimmer_1.5s_infinite]" />
    </>
  );

  const Component = href ? Link : 'button';
  const componentProps = href ? { href } : { onClick, type, disabled };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
      data-magnetic
    >
      <Component
        {...componentProps as any}
        className={`${baseClasses} ${variantClasses}`}
      >
        {innerContent}
      </Component>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </motion.div>
  );
}
