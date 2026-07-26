'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  aspect: string;
  width: number;
  height: number;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function GalleryLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}: GalleryLightboxProps) {
  const currentImage = images[currentIndex];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe support for mobile via framer-motion drag gestures
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrev();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8"
          onClick={onClose}
        >
          {/* Top Bar (Close and Progress) */}
          <div className="flex items-center justify-between w-full h-16 z-20">
            <span className="font-sans text-sm text-[#B5B5B5]/60 tracking-wider">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors cursor-none md:cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden my-4">
            
            {/* Desktop Navigation Chevrons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 z-20 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Previous Image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 z-20 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Next Image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Drag Container for mobile swipe */}
            <div className="relative w-full h-full max-w-5xl max-h-[70vh] flex items-center justify-center select-none">
              <motion.div
                key={currentIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
              >
                <div className={`relative w-full h-full ${currentImage.aspect}`}>
                  <Image
                    src={currentImage.src}
                    alt={currentImage.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-contain pointer-events-none"
                    priority
                  />
                  {/* Subtle Elegant Placeholder overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent mix-blend-overlay pointer-events-none" />
                </div>
              </motion.div>
            </div>

          </div>

          {/* Bottom Bar (Caption & Progress Bar) */}
          <div 
            className="w-full flex flex-col items-center gap-4 text-center z-20 pb-4 max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.p 
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-lg md:text-xl text-white font-light leading-relaxed px-4"
            >
              {currentImage.caption}
            </motion.p>
            
            {/* Minimal Progress line */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full mt-2">
              <motion.div 
                className="absolute left-0 top-0 h-full bg-[#D4AF37]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
