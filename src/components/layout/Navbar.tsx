'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import MagneticButton from '../ui/MagneticButton';

interface NavbarProps {
  isVisible?: boolean;
}

const navLinks = [
  { name: 'Home', href: '/#hero' },
  { name: 'Menu', href: '/#menu' },
  { name: 'Our Story', href: '/#our-story' },
  { name: 'Reserve', href: '/#reservations' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar({ isVisible = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
            scrolled ? 'bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#D4AF37]/10' : 'bg-transparent border-b border-transparent'
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main Navigation">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0 relative group">
                <Link href="/">
                  <div className="relative h-10 w-32">
                    <Image
                      src="/images/logo.png"
                      alt="Urban Fork Logo"
                      fill
                      sizes="128px"
                      className="object-contain"
                      priority
                    />
                    <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 rounded-full mix-blend-screen" />
                  </div>
                </Link>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative group font-sans text-sm font-medium uppercase tracking-wider text-[#B5B5B5] hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#D4AF37] scale-x-0 origin-center transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                ))}
              </div>

              {/* Book a Table Button */}
              <div className="hidden md:block">
                <MagneticButton variant="outlined" href="#reservations">
                  Book a Table
                </MagneticButton>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-[#D4AF37] focus:outline-none flex flex-col space-y-1.5 z-50 p-2"
                  aria-label="Toggle Menu"
                >
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    className="block w-6 h-[2px] bg-[#D4AF37] transition-all"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block w-6 h-[2px] bg-[#D4AF37] transition-all"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    className="block w-6 h-[2px] bg-[#D4AF37] transition-all"
                  />
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Full Screen Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0D0D0D] z-40 flex flex-col items-center justify-center min-h-[100dvh]"
              >
                <div className="flex flex-col items-center space-y-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-sans font-medium uppercase tracking-wider text-[#B5B5B5] hover:text-[#D4AF37] transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-8"
                  >
                    <MagneticButton variant="outlined" href="#reservations" onClick={() => setMobileMenuOpen(false)}>
                      Book a Table
                    </MagneticButton>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
