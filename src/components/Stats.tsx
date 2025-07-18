'use client'

import React from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: 5,   label: 'Projects Delivered' },
  { value: 21,  label: 'Hazard Types Monitored' },
  { value: 100, label: 'Professionals Trained+' },
]

export default function Stats() {
  return (
    <section id="stats" className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="text-5xl font-bold text-[#00FF9E]">
              {stat.value}
            </div>
            <div className="mt-2 text-lg text-white">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
