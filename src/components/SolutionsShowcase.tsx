'use client'

import React, { useRef, useEffect, useState } from 'react'
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
    category: 'Training & Development',
    technologies: ['Pix4D', 'GIS', 'Photogrammetry', 'Drone Surveying']
  },
  {
    id: 2,
    title: 'Cooling Tower Detection System',
    img: '/projects/cooling-tower.png',
    description:
      'An automated detection system that maps cooling towers using satellite/aerial imagery, CNNs, OpenCV and Python—integrated with GIS and Google Maps for real‑time spatial analysis.',
    category: 'AI & Computer Vision',
    technologies: ['CNN', 'OpenCV', 'Python', 'GIS', 'Google Maps']
  },
  {
    id: 3,
    title: 'Advanced Disaster Early Warning System',
    img: '/projects/early-warning.png',
    description:
      'A multi‑hazard platform processing satellite + environmental data via AI/ML on cloud‑native infrastructure, generating real‑time alerts across 21 event types.',
    category: 'Disaster Management',
    technologies: ['AI/ML', 'Satellite Data', 'Cloud Infrastructure', 'Real-time Alerts']
  },
  {
    id: 4,
    title: 'Property Listing Dashboard',
    img: '/projects/property-listing-dashboard.png',
    description:
      'GIS‑based MLS dashboard combining satellite imagery and spatial metrics (terrain, vegetation, climate) with interactive analytics.',
    category: 'Real Estate Tech',
    technologies: ['GIS', 'MLS', 'Satellite Imagery', 'Analytics']
  },
  {
    id: 5,
    title: 'Property Map Interface',
    img: '/projects/property-listing-map.png',
    description:
      'Interactive map interface built with Leaflet.js and Mapbox for exploring listings by geographic and environmental context.',
    category: 'Mapping Solutions',
    technologies: ['Leaflet.js', 'Mapbox', 'Interactive Maps', 'Geospatial']
  },
]

// Deterministic particle positions to avoid hydration mismatch
const particlePositions = [
  { left: 15, top: 20 },
  { left: 85, top: 10 },
  { left: 25, top: 80 },
  { left: 70, top: 60 },
  { left: 50, top: 30 },
  { left: 90, top: 90 }
]

export default function SolutionsShowcase() {
  const [isClient, setIsClient] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const ctx = gsap.context(() => {
      // Title entrance animation
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      })

      titleTl
        .fromTo(titleRef.current, 
          { 
            opacity: 0, 
            y: 80,
            scale: 0.8,
            rotationX: 20
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: "power4.out",
          }
        )
        .fromTo(subtitleRef.current,
          {
            opacity: 0,
            scaleX: 0,
            transformOrigin: "center"
          },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.4"
        )

      // Horizontal scroll setup
      if (scrollContainerRef.current && cardsRef.current.length > 0) {
        // Wait for layout to complete
        setTimeout(() => {
          const scrollContainer = scrollContainerRef.current
          const cards = cardsRef.current
          
          if (!scrollContainer) return
          
          // Calculate total width needed for horizontal scroll
          const cardWidth = window.innerWidth * 0.7 // 70vw per card
          const gap = 32 // 8 * 4 = 32px gap between cards
          const padding = 64 // 32px padding on each side
          const totalContentWidth = (cards.length * cardWidth) + ((cards.length - 1) * gap) + padding
          const containerWidth = totalContentWidth - window.innerWidth

          // Set the actual width of the container
          gsap.set(scrollContainer, { width: totalContentWidth })

          // Create horizontal scroll trigger with proper height
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.max(containerWidth, window.innerHeight * 2)}`, // Minimum scroll distance
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress
              const scrollX = progress * containerWidth
              gsap.set(scrollContainer, { x: -scrollX })
              
              // Update progress bar
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, { scaleX: progress })
              }
            },
            onRefresh: () => {
              // Recalculate on window resize
              const newCardWidth = window.innerWidth * 0.7
              const newTotalContentWidth = (cards.length * newCardWidth) + ((cards.length - 1) * gap) + padding
              const newContainerWidth = newTotalContentWidth - window.innerWidth
              gsap.set(scrollContainer, { width: newTotalContentWidth })
              return Math.max(newContainerWidth, window.innerHeight * 2)
            }
          })
        }, 100)
      }

      // Cards entrance animation - moved outside to access cards properly
      const cards = cardsRef.current
      if (cards.length > 0) {
        gsap.set(cards, {
          opacity: 0,
          y: 100,
          rotationY: 25,
          scale: 0.8
        })

        ScrollTrigger.batch(cards, {
          onEnter: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              rotationY: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.1
            })
          },
          start: "left 80%",
          once: true
        })

        // Enhanced hover animations for each card
        cards.forEach((card: HTMLDivElement, index: number) => {
          if (card) {
            const image = card.querySelector('.card-image')
            const overlay = card.querySelector('.overlay')
            const content = card.querySelector('.card-content')
            const badge = card.querySelector('.card-badge')
            const glow = card.querySelector('.glow-effect')

            const hoverIn = () => {
              const tl = gsap.timeline()
              
              tl.to(card, {
                y: -15,
                rotationX: 8,
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
              })
              .to(image, { 
                scale: 1.1, 
                rotation: 1,
                duration: 0.6, 
                ease: "power3.out" 
              }, 0)
              .to(overlay, { 
                opacity: 1, 
                duration: 0.4, 
                ease: "power2.out" 
              }, 0)
              .to(glow, {
                opacity: 0.8,
                scale: 1.05,
                duration: 0.5,
                ease: "power2.out"
              }, 0)
              .fromTo(content, 
                { y: 30, opacity: 0 },
                { 
                  y: 0, 
                  opacity: 1, 
                  duration: 0.5, 
                  ease: "back.out(1.7)" 
                }, 
                0.2
              )
              .to(badge, { 
                scale: 1.1, 
                rotation: 5,
                duration: 0.4, 
                ease: "elastic.out(1, 0.3)" 
              }, 0.1)
            }

            const hoverOut = () => {
              const tl = gsap.timeline()
              
              tl.to(card, {
                y: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
              })
              .to(image, { 
                scale: 1, 
                rotation: 0,
                duration: 0.6, 
                ease: "power3.out" 
              }, 0)
              .to(overlay, { 
                opacity: 0, 
                duration: 0.4, 
                ease: "power2.out" 
              }, 0)
              .to(glow, {
                opacity: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
              }, 0)
              .to(content, { 
                y: 20, 
                opacity: 0, 
                duration: 0.3, 
                ease: "power2.out" 
              }, 0)
              .to(badge, { 
                scale: 1, 
                rotation: 0,
                duration: 0.4, 
                ease: "power2.out" 
              }, 0)
            }

            card.addEventListener('mouseenter', hoverIn)
            card.addEventListener('mouseleave', hoverOut)
          }
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [isClient])

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  if (!isClient) {
    return (
      <section className="w-full h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading...</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="solutions" className="w-full h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Title Section */}
      <div className="absolute top-0 left-0 w-full z-20">
        <div className="text-center">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent"
          >
            Systems in Action
          </h2>
          <div 
            ref={subtitleRef}
            className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"
          ></div>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto px-4">
            Scroll to explore our innovative projects and solutions
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 z-30">
        <div 
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 origin-left scale-x-0"
        ></div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="absolute inset-0 pt-[250px] pb-20">
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 px-8 h-full items-center"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="flex-shrink-0 w-[70vw] max-w-2xl"
            >
              <div className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 h-[600px] cursor-pointer transform-gpu">
                {/* Deterministic particles - no hydration mismatch */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {particlePositions.map((pos, i) => (
                    <div
                      key={i}
                      className="particle absolute w-1 h-1 bg-green-400 rounded-full opacity-30"
                      style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>

                {/* Project Badge */}
                <div className="card-badge absolute top-6 left-6 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                  {project.category}
                </div>

                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={project.img}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="card-image object-cover w-full h-full"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Content */}
                <div className="p-6 h-52 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Hover Content */}
                  <div className="card-content absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent opacity-0">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm font-medium">View Project Details</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="glow-effect absolute inset-0 rounded-2xl opacity-0 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 blur-xl"></div>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border border-green-500/0 group-hover:border-green-500/50 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-green-400 text-sm font-medium z-20">
        <div className="flex items-center gap-2">
          <span>Scroll to explore</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
