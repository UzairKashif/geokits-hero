'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

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
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(titleRef.current, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate cards with stagger
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.8,
          rotationX: 15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Add hover animations for each card
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const overlay = card.querySelector('.overlay')
          const image = card.querySelector('.card-image')
          const content = card.querySelector('.card-content')
          const badge = card.querySelector('.card-badge')

          // Hover in
          const hoverIn = () => {
            gsap.to(image, { scale: 1.1, duration: 0.4, ease: "power2.out" })
            gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
            gsap.to(content, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.1 })
            gsap.to(badge, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" })
          }

          // Hover out
          const hoverOut = () => {
            gsap.to(image, { scale: 1, duration: 0.4, ease: "power2.out" })
            gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.out" })
            gsap.to(content, { y: 20, opacity: 0, duration: 0.3, ease: "power2.out" })
            gsap.to(badge, { scale: 1, duration: 0.3, ease: "power2.out" })
          }

          card.addEventListener('mouseenter', hoverIn)
          card.addEventListener('mouseleave', hoverOut)
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} id="solutions" className="w-full py-24 px-4 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent"
          >
            Systems in Action
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 cursor-pointer transform-gpu"
            >
              {/* Project Badge
              <div className="card-badge absolute top-4 left-4 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Project {String(index + 1).padStart(2, '0')}
              </div> */}

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.img}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="card-image object-cover w-full h-full transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-green-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Hover Content */}
                <div className="card-content absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 transform translate-y-5">
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm font-medium">View Details</span>
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 cursor-pointer">
            <span>Explore All Projects</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div> */}
      </div>
    </section>
  )
}
