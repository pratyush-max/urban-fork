'use client';

import React from 'react';
import Image from 'next/image';
import { restaurantConfig } from '@/constants/restaurant';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] relative z-20 pt-16 pb-8 px-8" role="contentinfo">
      {/* Top Gradient Border Overlay */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-8">
        
        {/* Column 1 - Location */}
        <address className="flex flex-col items-center md:items-start text-center md:text-left flex-1 not-italic">
          <h3 className="font-serif text-[#D4AF37] text-2xl mb-4">Visit Us</h3>
          <p className="font-sans text-[#B5B5B5] mb-2 leading-relaxed max-w-[200px]">
            {restaurantConfig.address}
          </p>
          <a href={`tel:${restaurantConfig.phoneRaw}`} className="font-sans text-[#B5B5B5] hover:text-[#D4AF37] transition-colors" aria-label={`Call Urban Fork at ${restaurantConfig.phone}`}>
            {restaurantConfig.phone}
          </a>
        </address>

        {/* Column 2 - Center Logo */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="relative h-[50px] w-40 mb-6">
            <Image
              src="/images/logo.png"
              alt="Urban Fork Logo"
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>
          <p className="font-serif italic text-[#B5B5B5] text-lg text-center">
            {restaurantConfig.tagline}
          </p>
        </div>

        {/* Column 3 - Hours */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
          <h3 className="font-serif text-[#D4AF37] text-2xl mb-4">Hours</h3>
          <p className="font-sans text-[#B5B5B5] mb-1">{restaurantConfig.openingHours.weekday.days}: {restaurantConfig.openingHours.weekday.hours}</p>
          <p className="font-sans text-[#B5B5B5] mb-1">{restaurantConfig.openingHours.weekend.days}: {restaurantConfig.openingHours.weekend.hours}</p>
          <p className="font-sans text-[#B5B5B5] mb-4">{restaurantConfig.openingHours.sunday.days}: {restaurantConfig.openingHours.sunday.hours}</p>
          <p className="font-sans text-[#D4AF37] text-sm uppercase tracking-wider font-medium">Reservations Recommended</p>
        </div>

      </div>

      {/* Social & Copyright Row */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col items-center justify-center">
        
        {/* Social Icons */}
        <nav className="flex items-center gap-4 mb-6" aria-label="Social media links">
          <a href={restaurantConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors" aria-label="Urban Fork on Instagram">
            Instagram
          </a>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" aria-hidden="true"></span>
          <a href={restaurantConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors" aria-label="Urban Fork on Facebook">
            Facebook
          </a>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" aria-hidden="true"></span>
          <a href={restaurantConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors" aria-label="Urban Fork on X (formerly Twitter)">
            Twitter/X
          </a>
        </nav>

        {/* Copyright */}
        <p className="font-sans text-xs text-[#B5B5B5]">
          © {new Date().getFullYear()} {restaurantConfig.businessName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
