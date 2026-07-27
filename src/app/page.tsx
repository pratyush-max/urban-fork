'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import LoadingExperience from '@/components/sections/LoadingExperience';
import Hero from '@/components/sections/Hero';
import LazySection from '@/components/ui/LazySection';

// ── Dynamic Imports for Below-the-fold / Non-critical Components ──
// ssr: true keeps SEO intact for key sections, but splits JS chunks
const BrandStory = dynamic(() => import('@/components/sections/BrandStory'), { ssr: true });
const InteractiveMenu = dynamic(() => import('@/components/sections/InteractiveMenu'), { ssr: true });
const EditorialGallery = dynamic(() => import('@/components/sections/EditorialGallery'), { ssr: true });

// ssr: false for highly interactive/client-heavy components to optimize SSR size
const CustomerExperience = dynamic(() => import('@/components/sections/CustomerExperience'), { ssr: false });
const ReservationExperience = dynamic(() => import('@/components/sections/ReservationExperience'), { ssr: false });
const ContactExperience = dynamic(() => import('@/components/sections/ContactExperience'), { ssr: false });
const ClosingExperience = dynamic(() => import('@/components/sections/ClosingExperience'), { ssr: false });
const ConciergeAI = dynamic(() => import('@/components/ui/ConciergeAI'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: true });

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
        
        <LazySection minHeight="100vh">
          <BrandStory />
        </LazySection>

        <LazySection minHeight="100vh">
          <InteractiveMenu />
        </LazySection>

        <LazySection minHeight="100vh">
          <EditorialGallery />
        </LazySection>

        <LazySection minHeight="50vh">
          <CustomerExperience />
        </LazySection>

        <LazySection minHeight="80vh">
          <ReservationExperience />
        </LazySection>

        <LazySection minHeight="80vh">
          <ContactExperience />
        </LazySection>

        <LazySection minHeight="100vh">
          <ClosingExperience />
        </LazySection>
      </main>

      <LazySection minHeight="20vh">
        <Footer />
      </LazySection>
    </SmoothScrollProvider>
  );
}
