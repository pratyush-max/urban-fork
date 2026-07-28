'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Maximize2 } from 'lucide-react';
import AmbientParticles from '../ui/AmbientParticles';

// Dynamic import the Lightbox component to reduce bundle size and speed up page load
const GalleryLightbox = dynamic(() => import('../ui/GalleryLightbox'), {
  ssr: false,
});

interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  aspect: string;
  width: number;
  height: number;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    src: '/images/gallery/gallery-1.png',
    caption: 'An interplay of warm golden light, hand-blown glass pendants, and rich walnut textures.',
    aspect: 'aspect-[3/4]',
    width: 800,
    height: 1066,
  },
  {
    id: 'gal-2',
    src: '/images/gallery/gallery-2.png',
    caption: 'Precision in every detail: Chef dusting smoked sea salt over seared A5 Wagyu.',
    aspect: 'aspect-[4/3]',
    width: 1000,
    height: 750,
  },
  {
    id: 'gal-3',
    src: '/images/gallery/gallery-3.png',
    caption: 'Raw Persian saffron threads steeping slowly to extract their signature golden amber essence.',
    aspect: 'aspect-[1/1]',
    width: 900,
    height: 900,
  },
  {
    id: 'gal-4',
    src: '/images/gallery/gallery-4.png',
    caption: 'Our Smoked Sage Old Fashioned presented under a smoke-filled crystal cloche.',
    aspect: 'aspect-[3/4]',
    width: 800,
    height: 1066,
  },
  {
    id: 'gal-5',
    src: '/images/gallery/gallery-5.png',
    caption: 'Under the warm glow of the kitchen pass, dishes receive their final botanical garnishes.',
    aspect: 'aspect-[4/3]',
    width: 1000,
    height: 750,
  },
  {
    id: 'gal-6',
    src: '/images/gallery/gallery-6.png',
    caption: 'Hand-torched Italian meringue peaks dusting our deconstructed Meyer Lemon Tart.',
    aspect: 'aspect-[3/4]',
    width: 800,
    height: 1066,
  },
  {
    id: 'gal-7',
    src: '/images/gallery/gallery-7.png',
    caption: 'Curated vintages resting in our temperature-controlled cellar vaults.',
    aspect: 'aspect-[1/1]',
    width: 900,
    height: 900,
  },
  {
    id: 'gal-8',
    src: '/images/gallery/gallery-8.png',
    caption: 'Butter-poached claws resting on a bed of sea asparagus and lemon verbena foam.',
    aspect: 'aspect-[3/4]',
    width: 800,
    height: 1066,
  },
];

export default function EditorialGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <section id="gallery" className="relative bg-[#0D0D0D] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[100dvh]">
      <AmbientParticles className="absolute inset-0 z-0 pointer-events-none opacity-20" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-20">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
          Atmosphere & Artistry
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Editorial Gallery
        </h2>
        <div className="w-[60px] h-[1px] bg-[#D4AF37] mx-auto mt-6" />
      </div>

      {/* Masonry Columns Grid Layout (causes no layout shifts, fully responsive) */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-8 [column-fill:_balance]">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' }}
              className="break-inside-avoid mb-8 relative group rounded-xl overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-[#D4AF37]/30 transition-colors duration-500"
              onClick={() => handleOpen(idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(idx); } }}
              role="button"
              tabIndex={0}
              aria-label={`View gallery image: ${item.caption.slice(0, 60)}`}
            >
              {/* Aspect Ratio Box */}
              <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gold luxury shading overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6" />

                {/* Caption / Interactive hover UI */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#D4AF37] uppercase tracking-widest font-medium mb-2">
                    <Sparkles size={10} /> View Experience
                  </div>
                  <p className="font-serif text-sm text-white font-light leading-relaxed line-clamp-3">
                    {item.caption}
                  </p>
                </div>

                {/* Minimal Expand Icon top-right */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 size={14} className="text-[#D4AF37]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox instance */}
      <GalleryLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={galleryItems}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </section>
  );
}
