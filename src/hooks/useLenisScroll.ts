'use client'
import { useEffect, useRef } from 'react'
import { useScroll } from 'framer-motion'
import Lenis from 'lenis'

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Animation loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return lenisRef.current
}

export function useScrollWithLenis(target?: React.RefObject<HTMLElement>) {
  const lenis = useLenisScroll()
  
  return useScroll({
    target,
    offset: ['start start', 'end start'],
  })
}
