'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, DownloadCloud, Cpu, CloudCog } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Needs Assessment',
    description:
      'We collaborate with you to define objectives, risk profiles, and spatial requirements.',
  },
  {
    icon: DownloadCloud,
    title: 'Data Acquisition',
    description:
      'Gathering satellite, aerial, drone, and sensor data to build a comprehensive spatial dataset.',
  },
  {
    icon: Cpu,
    title: 'Modeling & ML',
    description:
      'Applying AI, machine learning, and geospatial analytics to uncover insights and patterns.',
  },
  {
    icon: CloudCog,
    title: 'Deployment & Support',
    description:
      'Integrating solutions into your environment and providing ongoing maintenance and training.',
  },
]

export default function Workflow() {
  return (
    <section id="workflow" className="w-full py-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Our Workflow
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
            className="bg-[#04110E] border border-[#00FF9E] rounded-lg p-6 cursor-pointer transition"
          >
            <Icon className="w-12 h-12 text-[#00FF9E] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-white/70 text-sm">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
