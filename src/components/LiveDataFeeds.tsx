'use client'

import React from 'react'
import { motion } from 'framer-motion'

const feeds = [
  'Sentinel‑2',
  'Landsat 8',
  'OpenStreetMap',
  'Drone Imagery',
  'LiDAR',
  'Google Earth Engine',
]

export default function LiveDataFeeds() {
  return (
    <section id="live-data" className="w-full py-8 px-4">
      <div className="overflow-hidden">
        <motion.div
          className="flex space-x-8 whitespace-nowrap text-white text-xl"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          {feeds.map((feed, i) => (
            <span key={i} className="mx-4">
              {feed}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
