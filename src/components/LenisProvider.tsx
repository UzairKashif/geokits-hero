'use client'
import { useEffect, useRef, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Create context for Lenis instance
const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  const lenis = useContext(LenisContext)
  return lenis
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
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

    // Delay to ensure DOM is ready after route change
    const timer = setTimeout(() => {
      // Initialize Lenis
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        infinite: false,
      })

      lenisRef.current = lenis

      // Animation loop
      function raf(time: number) {
        if (lenisRef.current) {
          lenisRef.current.raf(time)
          rafRef.current = requestAnimationFrame(raf)
        }
      }

      rafRef.current = requestAnimationFrame(raf)

      // Refresh ScrollTrigger to recalculate positions after route change
      // This helps with GSAP animations after navigation
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }, 150)

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
