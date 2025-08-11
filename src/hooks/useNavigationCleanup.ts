'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLenis } from '@/components/LenisProvider'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SCROLL_POSITION_KEY = 'geokits-home-scroll-position'
const BLOG_SECTION_ID = 'blog'

export function useNavigationCleanup() {
  const router = useRouter()
  const lenis = useLenis()

  const cleanupAndNavigate = useCallback((href: string) => {
    // Save current scroll position if we're on the home page and navigating to a blog post
    if (typeof window !== 'undefined' && window.location.pathname === '/' && href.startsWith('/blog/')) {
      const currentScrollY = window.scrollY
      if (currentScrollY > 100) {
        sessionStorage.setItem(SCROLL_POSITION_KEY, currentScrollY.toString())
      }
    }

    // 1. Kill all GSAP animations and timelines
    gsap.killTweensOf("*")
    gsap.globalTimeline.kill()
    
    // 2. Clear all ScrollTriggers
    if (typeof window !== 'undefined') {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
    
    // 3. Stop Lenis smooth scrolling
    if (lenis) {
      lenis.stop()
    }

    // 4. Small delay to ensure all cleanup is complete, then navigate
    setTimeout(() => {
      router.push(href)
    }, 100)
  }, [router, lenis])

  return cleanupAndNavigate
}
