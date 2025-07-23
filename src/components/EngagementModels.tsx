'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const models = [
  {
    title: 'Pilot Program',
    description: 'Short-term proof of concept to demonstrate value and feasibility.',
    features: ['Risk Assessment', 'ROI Analysis', 'Technical Validation', 'Team Training'],
    timeline: '2-4 weeks',
  },
  {
    title: 'Full-Scale Deployment',
    description: 'Comprehensive rollout across your organization with complete integration.',
    features: ['Enterprise Integration', 'Workflow Automation', 'Data Migration', 'Support & Maintenance'],
    timeline: '3-6 months',
  },
  {
    title: 'Custom Training Packages',
    description: 'Tailored GIS and photogrammetry training for your technical teams.',
    features: ['Hands-on Workshops', 'Certification Programs', 'Best Practices', 'Ongoing Support'],
    timeline: '1-2 months',
  },
]

export default function EngagementModels() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  return (
    <section ref={ref} id="engagement" className="w-full py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Engagement Models
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Choose the engagement model that best fits your organizational needs and project timeline
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {models.map((model, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Background glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF9E]/20 to-[#00FF9E]/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card content */}
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full transition-all duration-300 group-hover:border-[#00FF9E]/30">
                {/* Timeline badge */}
                <div className="relative inline-flex items-center px-3 py-1 rounded-full bg-[#00FF9E]/10 border border-[#00FF9E]/20 mb-6">
                  <span className="text-[#00FF9E] text-sm font-medium">{model.timeline}</span>
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#00FF9E]/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00FF9E] transition-colors duration-300">
                  {model.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  {model.description}
                </p>

                {/* Features list */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                    Key Features
                  </h4>
                  {model.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + (index * 0.2) + (featureIndex * 0.1) 
                      }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9E] flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FF9E] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
