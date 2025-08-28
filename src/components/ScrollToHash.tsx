'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    // Only handle hash scrolling on the home page
    if (pathname !== '/') return

    const hash = window.location.hash
    if (hash) {
      // Remove the # from the hash
      const sectionId = hash.slice(1)
      
      // Use a timeout to ensure the page has fully loaded
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  // Also handle hash changes while on the page
  useEffect(() => {
    if (pathname !== '/') return

    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const sectionId = hash.slice(1)
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [pathname])

  return null
}
