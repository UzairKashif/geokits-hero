'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const SCROLL_POSITION_KEY = 'geokits-home-scroll-position'
const BLOG_SECTION_ID = 'blog'

export function useScrollPositionMemory() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const hasStoredPosition = useRef(false)
  const isRestoring = useRef(false)

  // Save scroll position when leaving home page
  useEffect(() => {
    if (isHomePage) {
      // We're on the home page, check if we should restore position
      const storedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY)
      
      if (storedPosition && !hasStoredPosition.current && !isRestoring.current) {
        hasStoredPosition.current = true
        isRestoring.current = true
        
        // Small delay to ensure the page is fully rendered and animations are ready
        setTimeout(() => {
          try {
            const targetSection = document.getElementById(BLOG_SECTION_ID)
            if (targetSection) {
              // Smooth scroll to the blog section
              targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
              
              // Clear the stored position after using it
              sessionStorage.removeItem(SCROLL_POSITION_KEY)
              
              // Reset the restoring flag after a delay
              setTimeout(() => {
                isRestoring.current = false
              }, 1000)
            }
          } catch (error) {
            console.warn('Failed to restore scroll position:', error)
            sessionStorage.removeItem(SCROLL_POSITION_KEY)
            isRestoring.current = false
          }
        }, 800) // Increased delay for better reliability
      }
    } else {
      // We're leaving the home page, save current scroll position
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        // Only save if we're actually scrolled down (not at the top)
        if (currentScrollY > 100) {
          sessionStorage.setItem(SCROLL_POSITION_KEY, currentScrollY.toString())
        }
      }
    }
  }, [pathname])

  // Function to manually save scroll position (useful for programmatic navigation)
  const saveScrollPosition = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY
      if (currentScrollY > 100) {
        sessionStorage.setItem(SCROLL_POSITION_KEY, currentScrollY.toString())
      }
    }
  }

  // Function to manually restore scroll position
  const restoreScrollPosition = () => {
    const storedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY)
    if (storedPosition) {
      try {
        const targetSection = document.getElementById(BLOG_SECTION_ID)
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
          sessionStorage.removeItem(SCROLL_POSITION_KEY)
          return true
        }
      } catch (error) {
        console.warn('Failed to restore scroll position:', error)
        sessionStorage.removeItem(SCROLL_POSITION_KEY)
      }
    }
    return false
  }

  return {
    saveScrollPosition,
    restoreScrollPosition,
    hasStoredPosition: hasStoredPosition.current,
    isRestoring: isRestoring.current
  }
}
