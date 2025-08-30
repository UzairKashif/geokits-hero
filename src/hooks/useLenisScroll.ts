'use client'
import { useScroll } from 'framer-motion'
import { useLenis } from '@/components/LenisProvider'

export function useLenisScroll() {
  // Use the main Lenis instance from provider instead of creating a new one
  return useLenis()
}

export function useScrollWithLenis(target?: React.RefObject<HTMLElement>) {
  const lenis = useLenis()
  
  return useScroll({
    target,
    offset: ['start start', 'end start'],
  })
}
