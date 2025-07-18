'use client'

import React from 'react'
import { motion } from 'framer-motion'

const models = [
  {
    title: 'Pilot Program',
    description: 'Short-term proof of concept to demonstrate value.',
  },
  {
    title: 'Full-Scale Deployment',
    description: 'Comprehensive rollout across your organization.',
  },
  {
    title: 'Custom Training Packages',
    description: 'Tailored GIS and photogrammetry training.',
  },
]

export default function EngagementModels() {
  return (
    <section id="engagement" className="w-full py-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Engagement Models
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {models.map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
            className="bg-[#04110E] border border-white/20 rounded-lg p-6 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{m.title}</h3>
            <p className="text-white/70 text-sm">{m.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
