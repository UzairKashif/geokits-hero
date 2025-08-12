'use client'

import React from 'react'
import { Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Name */}
          <div className="lg:col-span-2">
            <h2 className="text-6xl font-bold text-black mb-4">
              geokits
            </h2>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="font-semibold text-black mb-4">Home</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Locations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Criteria</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Our work</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black flex items-center">
                  The Fundamentals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black flex items-center">
                  The Creative
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black flex items-center">
                  The Collective
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Story</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Team</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Careers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Culture</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Apply</a></li>
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold text-black mb-4">Investor Portal</h3>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-black mb-4">Contact</h3>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Left side - Links */}
            <div className="flex flex-wrap items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-black">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-black flex items-center">
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </a>
            </div>

            {/* Right side - Addresses and Copyright */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-2 lg:space-y-0 text-gray-600 text-sm">
              <span>575 5th Ave, NY 10017</span>
              <span>1284 Beacon St, Brookline, MA 02446</span>
              <span>FY © 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
