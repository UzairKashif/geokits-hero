'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const logos = ['nsa-oman', 'aws', 'xprize']  // place these in /public/logos/*.png
const testimonials = [
  {
    quote:
      '“GeoKits’ early warning alerts saved lives during the Cyclone Alpha event—our team couldn’t have responded so quickly without them.”',
    author: 'Emergency Response Coordinator, Country X',
  },
  {
    quote:
      '“The cooling tower detection system revolutionized our inspection workflow, reducing manual checks by 80%.”',
    author: 'Public Health Inspector, Country Y',
  },
  {
    quote:
      '“Their training initiative upskilled our surveyors in Pix4D and GIS, enabling us to launch autonomous drone missions.”',
    author: 'Lead Surveyor, NSA Oman',
  },
]

export default function ClientsTestimonials() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(iv)
  }, [])

  return (
    <section id="testimonials" className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-8 mb-8">
          {logos.map((name) => (
            <div key={name} className="h-12 w-auto">
              <Image
                src={`/logos/${name}.png`}
                alt={name}
                width={100}
                height={48}
              />
            </div>
          ))}
        </div>
        <div className="relative h-40">
          <AnimatePresence initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 px-4"
            >
              <p className="italic text-lg text-white/80">
                {testimonials[idx].quote}
              </p>
              <p className="mt-4 font-semibold text-white">
                — {testimonials[idx].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
