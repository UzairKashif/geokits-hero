'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlogCard from './BlogCard'
import { blogPosts } from '../lib/blogData'

gsap.registerPlugin(ScrollTrigger)

export default function BlogSection() {
  const [isClient, setIsClient] = useState(false)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const ctxRef = useRef<gsap.Context | null>(null)
  const eventListenersRef = useRef<Array<{ element: HTMLDivElement; events: Array<{ type: string; handler: EventListener }> }>>([])

  useEffect(() => {
    setIsClient(true)
    
    // Check if user is returning from a blog post
    const hasStoredPosition = sessionStorage.getItem('geokits-home-scroll-position')
    if (hasStoredPosition) {
      setIsReturningUser(true)
      // Clear the flag after a delay
      setTimeout(() => setIsReturningUser(false), 3000)
    }
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Small delay to ensure DOM is fully ready and Lenis is initialized
    const timer = setTimeout(() => {
      if (!sectionRef.current) return

      ctxRef.current = gsap.context(() => {
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

        // Cards entrance animation
        const cards = cardsRef.current
        if (cards.length > 0) {
          gsap.set(cards, {
            opacity: 0,
            y: 100,
            rotationY: 25,
            scale: 0.8
          })

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          })

          // Enhanced hover animations for each card
          cards.forEach((card: HTMLDivElement) => {
            if (card) {
              const hoverIn = () => {
                gsap.to(card, {
                  y: -10,
                  rotationX: 5,
                  scale: 1.02,
                  duration: 0.4,
                  ease: "power2.out"
                })
              }

              const hoverOut = () => {
                gsap.to(card, {
                  y: 0,
                  rotationX: 0,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.out"
                })
              }

              // Store event listeners for cleanup
              const events = [
                { type: 'mouseenter', handler: hoverIn },
                { type: 'mouseleave', handler: hoverOut }
              ]
              
              events.forEach(({ type, handler }) => {
                card.addEventListener(type, handler)
              })
              
              eventListenersRef.current.push({ element: card, events })
            }
          })
        }

        // Special animation for returning users
        if (isReturningUser && titleRef.current) {
          gsap.to(titleRef.current, {
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          })
        }
      }, sectionRef)

    }, 100) // Small delay

    return () => {
      clearTimeout(timer)
      // Cleanup event listeners
      eventListenersRef.current.forEach(({ element, events }) => {
        if (element && element.parentNode) {
          events.forEach(({ type, handler }) => {
            element.removeEventListener(type, handler)
          })
        }
      })
      eventListenersRef.current = []
      
      // Cleanup GSAP context
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }
    }
  }, [isClient, isReturningUser])

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  if (!isClient) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading...</div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef} 
      id="blog" 
      className={`w-full min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 relative overflow-hidden transition-all duration-500 ${
        isReturningUser ? 'ring-2 ring-green-500/20 ring-opacity-50' : ''
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/4 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent"
          >
            Insights & Innovation
          </h2>
          <div 
            ref={subtitleRef}
            className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-6"
          ></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore the latest trends, technologies, and insights in geospatial intelligence and smart infrastructure
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              ref={addToRefs}
              className="transform-gpu"
            >
              <BlogCard post={post} index={index} />
            </div>
          ))}
        </div>

        {/* View All Blog Button */}
        <div className="text-center mt-16">
          <Link href="/blog">
            <button className="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105">
              <span className="relative z-10">View All Articles</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>
    </section>
  )
}
