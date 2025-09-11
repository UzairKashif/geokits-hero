'use client'

import React from 'react'
import Image from 'next/image'
import { Linkedin, Instagram, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Logo */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start">
              <Image
                src="/img/eng-trans.png"
                alt="Geokits Logo"
                width={300}
                height={80}
                className="h-[300px] w-auto"
                priority
              />
            </div>

          {/* Navigation columns */}
          <div>
            <h3 className="font-semibold text-black mb-4">Home</h3>
            <ul className="space-y-2">
              <li><a href="https://maps.google.com/maps?q=Daftarkhwan,+I-10/2,+Islamabad,+Pakistan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">Locations</a></li>
              {/* <li><a href="#" className="text-gray-600 hover:text-black">Criteria</a></li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Our work</h3>
            <ul className="space-y-2">
              <li>
                <a href="#systems-in-action" className="text-gray-600 hover:text-black flex items-center">
                  The Fundamentals
                </a>
              </li>
              <li>
                <a href="#systems-in-action" className="text-gray-600 hover:text-black flex items-center">
                  The Creative
                </a>
              </li>
              <li>
                <a href="#systems-in-action" className="text-gray-600 hover:text-black flex items-center">
                  The Collective
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Story</a></li>
              <li><a href="/teams" className="text-gray-600 hover:text-black">Team</a></li>
              <li><a href="/technologies" className="text-gray-600 hover:text-black">Technologies</a></li>
              {/*<li><a href="/testimonials" className="text-gray-600 hover:text-black">Testimonials</a></li>*/}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@geokits.com" className="text-gray-600 hover:text-black flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@geokits.com
                </a>
              </li>
              <li>
                <a href="tel:+923037239083" className="text-gray-600 hover:text-black flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +44 7446284191
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Left side - Links */}
            <div className="flex flex-wrap items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-black">Privacy Policy</a>
              <a href="https://www.linkedin.com/company/geokits" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black flex items-center">
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </a>
              <a href="https://www.instagram.com/geokits_" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black flex items-center">
                <Instagram className="w-4 h-4 mr-1" />
                Instagram
              </a>
            </div>

            {/* Right side - Address and Copyright */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-2 lg:space-y-0 text-gray-600 text-sm">
              <span>I10, Plot No, 94, 3 Street 7, I-10/3 sector, Islamabad, 44800</span>
              <span>© 2025 Geokits. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
