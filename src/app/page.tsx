'use client';

import { useState, useCallback } from 'react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingExperience from '@/components/sections/LoadingExperience';
import Hero from '@/components/sections/Hero';
import BrandStory from '@/components/sections/BrandStory';
import InteractiveMenu from '@/components/sections/InteractiveMenu';
import EditorialGallery from '@/components/sections/EditorialGallery';
import CustomerExperience from '@/components/sections/CustomerExperience';
import ReservationExperience from '@/components/sections/ReservationExperience';
import ContactExperience from '@/components/sections/ContactExperience';
import ClosingExperience from '@/components/sections/ClosingExperience';
import ConciergeAI from '@/components/ui/ConciergeAI';

import { ScrollTrigger, registerScrollTrigger } from '@/lib/gsap';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Short delay before showing navbar for a clean transition
    setTimeout(() => {
      setShowNavbar(true);
      // Recalculate ScrollTrigger triggers once loader unmounts
      registerScrollTrigger();
      ScrollTrigger.refresh();
    }, 300);
  }, []);

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ScrollProgress />
      <ConciergeAI />
      <Navbar isVisible={showNavbar} />

      {isLoading && (
        <LoadingExperience onComplete={handleLoadingComplete} />
      )}

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <BrandStory />
        <InteractiveMenu />
        <EditorialGallery />
        <CustomerExperience />
        <ReservationExperience />
        <ContactExperience />
        <ClosingExperience />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
