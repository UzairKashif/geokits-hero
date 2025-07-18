'use client'

import React from 'react'

const milestones = [
  { title: 'Training Initiative' },
  { title: 'Tower Detection' },
  { title: 'Early Warning' },
  { title: 'Dashboard' },
  { title: 'Interactive Map' },
]

export default function ProjectTimeline() {
  return (
    <section id="timeline" className="w-full py-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Project Lifecycle Timeline
      </h2>
      <div className="relative max-w-6xl mx-auto">
        {/* horizontal line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/20" />
        <div className="relative flex justify-between items-center">
          {milestones.map((m, i) => (
            <div key={i} className="flex flex-col items-center z-10">
              <div className="h-6 w-6 bg-[#00FF9E] rounded-full mb-2" />
              <span className="text-white text-sm text-center">{m.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
