'use client'
import { useEffect, useRef, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Lazy load Lenis only when needed
let Lenis: typeof import('lenis').default | null = null;

// Create context for Lenis instance
const LenisContext = createContext<import('lenis').default | null>(null)

export function useLenis() {
  const lenis = useContext(LenisContext)
  return lenis
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<import('lenis').default | null>(null)
  const rafRef = useRef<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Detect mobile devices and disable smooth scroll on low-end devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    // Skip Lenis on very low-end mobile devices for better performance
    if (isMobile && isLowEndDevice) {
      return;
    }

    // Clean up existing Lenis instance if it exists
    if (lenisRef.current) {
      lenisRef.current.destroy()
      lenisRef.current = null
    }

    // Cancel existing animation frame if it exists
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    // Kill all GSAP animations and ScrollTriggers before reinitializing
    gsap.killTweensOf("*")
    gsap.globalTimeline.kill()
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    // Lazy load Lenis to reduce initial bundle size
    const initLenis = async () => {
      if (!Lenis) {
        const LenisModule = await import('lenis');
        Lenis = LenisModule.default;
      }

      // Initialize Lenis with performance-optimized settings
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2, // Shorter duration for better performance
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !isMobile, // Disable smooth wheel on mobile
        wheelMultiplier: isMobile ? 0.6 : 1.0, // Reduced multiplier
        touchMultiplier: isMobile ? 1.2 : 1.8, // Optimized for touch
        infinite: false,
        autoResize: true,
        syncTouch: isMobile,
      })

      lenisRef.current = lenis

      // Connect Lenis to GSAP ScrollTrigger for better performance
      lenis.on('scroll', ScrollTrigger.update)

      // Optimized animation loop with frame rate control
      let lastTime = 0;
      const targetFPS = isMobile ? 30 : 60;
      const frameInterval = 1000 / targetFPS;
      
      function raf(time: number) {
        if (lenisRef.current) {
          // Throttle frame rate for better performance
          if (time - lastTime >= frameInterval) {
            lenisRef.current.raf(time)
            lastTime = time;
          }
          rafRef.current = requestAnimationFrame(raf)
        }
      }

      rafRef.current = requestAnimationFrame(raf)

      // Debounced ScrollTrigger refresh
      let refreshTimeout: NodeJS.Timeout;
      const debouncedRefresh = () => {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
          ScrollTrigger.refresh()
        }, isMobile ? 300 : 150);
      };

      // Listen for resize events
      window.addEventListener('resize', debouncedRefresh);

      // Initial refresh after a short delay
      setTimeout(debouncedRefresh, isMobile ? 500 : 200);

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener('resize', debouncedRefresh);
        lenis.off('scroll', ScrollTrigger.update);
      };
    }

    // Delay initialization slightly to prevent blocking
    const timer = setTimeout(initLenis, isMobile ? 300 : 150)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      // Ensure GSAP cleanup on unmount
      gsap.killTweensOf("*")
      gsap.globalTimeline.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [pathname]) // Re-initialize when pathname changes

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
