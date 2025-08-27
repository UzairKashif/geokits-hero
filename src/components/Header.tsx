'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <header 
        className={`fixed top-[10px] left-1/2 transform -translate-x-1/2 z-50 w-[70%] transition-all duration-300 rounded-lg ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-md border border-gray-800' 
            : 'bg-gray-900/80 backdrop-blur-sm border border-gray-700/50'
        }`}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/eng-trans-black.png"
                alt="Geokits Logo"
                width={120}
                height={40}
                className="h-8 w-auto filter invert"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('solutions')}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase"
              >
                Solutions
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('blog')}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase"
              >
                Insights
              </button>
              <button
                onClick={() => scrollToSection('timeline')}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase"
              >
                Process
              </button>
            </nav>

            {/* Right Side - Contact & Menu */}
            <div className="flex items-center space-x-4">
              {/* Contact Button */}
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-300 text-sm font-light tracking-wide"
              >
                <Mail className="w-4 h-4" />
                Contact us
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden bg-gray-900/98 backdrop-blur-md border-t border-gray-800 transition-all duration-300 rounded-b-lg ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <nav className="px-6 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('solutions')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase py-2"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase py-2"
            >
              Insights
            </button>
            <button
              onClick={() => scrollToSection('timeline')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide uppercase py-2"
            >
              Process
            </button>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-light tracking-wide py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-4 h-4" />
              Contact us
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
