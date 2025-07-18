'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: 'Pix4D & GIS Training Initiative – NSA Oman',
    img: '/projects/pix4d-oman.png',
    description:
      'GeoKits delivered a GIS and photogrammetry training initiative for the National Survey Authority of Oman, with full knowledge transfer across drone‑based surveying, spatial data processing, and image analysis.',
  },
  {
    id: 2,
    title: 'Cooling Tower Detection System',
    img: '/projects/cooling-tower.png',
    description:
      'An automated detection system that maps cooling towers using satellite/aerial imagery, CNNs, OpenCV and Python—integrated with GIS and Google Maps for real‑time spatial analysis.',
  },
  {
    id: 3,
    title: 'Advanced Disaster Early Warning System',
    img: '/projects/early-warning.png',
    description:
      'A multi‑hazard platform processing satellite + environmental data via AI/ML on cloud‑native infrastructure, generating real‑time alerts across 21 event types.',
  },
  {
    id: 4,
    title: 'Property Listing Dashboard',
    img: '/projects/property-listing-dashboard.png',
    description:
      'GIS‑based MLS dashboard combining satellite imagery and spatial metrics (terrain, vegetation, climate) with interactive analytics.',
  },
  {
    id: 5,
    title: 'Property Map Interface',
    img: '/projects/property-listing-map.png',
    description:
      'Interactive map interface built with Leaflet.js and Mapbox for exploring listings by geographic and environmental context.',
  },
]

export default function SolutionsShowcase() {
  return (
    <section id="solutions" className="w-full py-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Our Systems in Action
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-lg cursor-pointer"
          >
            <Image
              src={project.img}
              alt={project.title}
              width={400}
              height={300}
              className="object-cover w-full h-64"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <h3 className="text-white text-lg font-semibold px-4 text-center">
                {project.title}
              </h3>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
)
}
