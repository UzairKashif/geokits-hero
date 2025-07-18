'use client'

import React from 'react'
import Image from 'next/image'
import { Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#04110E] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <Image src="/GEOKITSWHITE.png" alt="GeoKits" width={150} height={40} />
        </div>

        {/* Links */}
        <nav className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="text-white hover:underline">
            About
          </a>
          <a href="#" className="text-white hover:underline">
            Services
          </a>
          <a href="#" className="text-white hover:underline">
            Projects
          </a>
          <a href="#" className="text-white hover:underline">
            Careers
          </a>
          <a href="#" className="text-white hover:underline">
            Contact
          </a>
        </nav>

        {/* Social */}
        <div className="flex space-x-4">
          <a href="#" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5 text-white" />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter className="w-5 h-5 text-white" />
          </a>
       

        </div>
      </div>
    </footer>
  )
}
