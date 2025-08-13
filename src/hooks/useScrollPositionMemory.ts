'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

const BLOG_SECTION_ID = 'blog'

export function useScrollPositionMemory() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isHomePage = pathname === '/'
  const hasScrolled = useRef(false)

  useEffect(() => {
    if (!isHomePage) return

    const scrollTo = searchParams.get('scrollTo')
    
    if (scrollTo === 'blog' && !hasScrolled.current) {
      hasScrolled.current = true
      
      // Clear the URL parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('scrollTo')
      router.replace(newUrl.pathname, { scroll: false })
      
      // Wait a bit for the page to load, then scroll to blog section
      setTimeout(() => {
        const targetSection = document.getElementById(BLOG_SECTION_ID)
        if (targetSection) {
          // Use instant scroll to avoid animation conflicts
          window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'auto'
          })
        }
      }, 300)
    }
  }, [isHomePage, searchParams, router])

  // Reset the hasScrolled flag when leaving the home page
  useEffect(() => {
    if (!isHomePage) {
      hasScrolled.current = false
    }
  }, [isHomePage])

  return {
    // Keep these for backward compatibility if needed elsewhere
    saveScrollPosition: () => {},
    restoreScrollPosition: () => false,
    hasStoredPosition: false,
    isRestoring: false
  }
}
