'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const dataStages = [
  {
    id: 1,
    title: 'Data Acquisition',
    description: 'Multi-source satellite imagery, sensor networks, and real-time environmental data streams',
    metrics: ['50+ Data Sources', 'Real-time Processing', '99.9% Uptime']
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Advanced machine learning algorithms process and analyze spatial patterns with computer vision',
    metrics: ['Deep Learning', 'Pattern Recognition', 'Automated Detection']
  },
  {
    id: 3,
    title: 'Intelligence Output',
    description: 'Actionable insights, predictive analytics, and automated alerts for decision making',
    metrics: ['Predictive Models', 'Risk Assessment', 'Decision Support']
  }
]

export default function DataFlowVisual() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} id="data-flow" className="w-full py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Data Intelligence Pipeline
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Transform raw geospatial data into actionable intelligence through our systematic three-stage processing pipeline
          </p>
        </motion.div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {dataStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Stage Number */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#00FF9E] rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-xl">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#00FF9E]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.7 }}
                    />
                  </div>
                </div>

                {/* Content Card */}
                <motion.div 
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-full hover:border-[#00FF9E]/30 transition-colors duration-300"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {stage.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 text-center leading-relaxed">
                    {stage.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="space-y-2">
                    {stage.metrics.map((metric, metricIndex) => (
                      <motion.div
                        key={metricIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + metricIndex * 0.1 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00FF9E] rounded-full" />
                        <span className="text-gray-300 text-sm">{metric}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Connection Arrow */}
                {index < dataStages.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                      className="text-[#00FF9E]"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M5 12h14m-6-6l6 6-6 6" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-6 bg-gray-900/30 rounded-xl border border-gray-800"
        >
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Real-time Data Processing
          </h3>
          <div className="relative h-16 overflow-hidden rounded-lg bg-gray-800/50">
            <div className="absolute inset-0 flex items-center justify-between px-6 text-sm text-gray-400">
              <span>Input</span>
              <span>Processing</span>
              <span>Output</span>
            </div>
            
            {/* Flowing data streams */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00FF9E] to-transparent"
              style={{ width: '120%' }}
              animate={{ x: ['-20%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00FF9E]/60 to-transparent"
              style={{ width: '120%' }}
              animate={{ x: ['-20%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
