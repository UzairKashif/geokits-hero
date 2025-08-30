"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, X } from "lucide-react"
import {usePathname} from "next/navigation"

export default function FloatingContactButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [display, setDisplay] = useState(true)

    const pathname = usePathname()

  useEffect(() => {
    const hasContact = pathname.includes("/contact")
    if (hasContact) {
      setDisplay(false)
    } else {
      setDisplay(true)
    }
    
    // Ensure visibility on mobile by forcing a reflow
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000) // Reduced from 1500ms to 1000ms
    
    return () => clearTimeout(timer)
  }, [pathname])

  if (isDismissed || !display) return null

  return (
    
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-16 md:right-16 z-[9999] transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ position: 'fixed', zIndex: 9999 }}
    >
      <div className="relative">
        <Link
          href="/contact"
          className="btn-floating group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 border-2 border-white/20"
          aria-label="Email us"
        >
          <Mail className="w-6 h-6 text-white" />

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping opacity-75" />
        </Link>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="btn-floating absolute -top-2 -left-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white text-xs focus:outline-none focus:ring-2 focus:ring-gray-500/30"
          aria-label="Dismiss contact button"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
