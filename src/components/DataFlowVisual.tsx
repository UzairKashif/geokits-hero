'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function DataFlowVisual() {
  return (
    <section id="data-flow" className="w-full py-16 px-4 overflow-hidden">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Data Flow Visual
      </h2>
      <div className="relative w-full h-32">
        <motion.div
          className="absolute top-0 left-0 w-[200%] h-full"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          style={{
            background:
              'linear-gradient(90deg, #00FF9E 0%, rgba(0,255,158,0) 50%, #00FF9E 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-16">
          <span className="text-white font-semibold">Data</span>
          <span className="text-white font-semibold">Insights</span>
          <span className="text-white font-semibold">Action</span>
        </div>
      </div>
    </section>
  )
}
