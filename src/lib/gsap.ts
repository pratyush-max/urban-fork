import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Safely register ScrollTrigger plugin.
 * Call this inside useEffect() in any component that uses ScrollTrigger.
 * It is idempotent — safe to call multiple times.
 */
export function registerScrollTrigger() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export { gsap, ScrollTrigger };
