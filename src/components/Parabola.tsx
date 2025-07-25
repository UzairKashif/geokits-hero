"use client"

import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "./LenisProvider"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ParabolaScrollPage() {
  const [parabolaHeight, setParabolaHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(800)
  const [windowWidth, setWindowWidth] = useState(1200)
  const [isClient, setIsClient] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    // Set client-side flag and initial window dimensions
    setIsClient(true)
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)

      const handleResize = () => {
        setWindowHeight(window.innerHeight)
        setWindowWidth(window.innerWidth)
        ScrollTrigger.refresh()
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current || !heroSectionRef.current) return

    const animation = gsap.to({ height: 0 }, {
      height: windowHeight,
      ease: "none",
      onUpdate: function () {
        setParabolaHeight(this.targets()[0].height)
      },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${windowHeight}`,
        scrub: true,
        pin: heroSectionRef.current,
        pinSpacing: true,
      },
    })

    return () => {
      animation.kill()
    }
  }, [isClient, windowHeight, lenis])

  // Generate parabola path with proper curve - endpoints at a fixed height
  const generateParabolaPath = (width: number, height: number, endpointHeight: number) => {
    if (height <= 0) return `M 0,0 L ${width},0`

    const points = []
    const numPoints = 100 // More points for smoother curve

    // Generate points for a sine wave from 270° to 630° to create upright parabola
    // x=0 maps to 270°, x=width/2 maps to 90° (360°), x=width maps to 630°
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width // x goes from 0 to width
      
      // Map x position to angle range: 270° to 630° (in radians)
      // This creates: x=0→270°(sin=-1), x=center→90°/450°(sin=1), x=width→630°(sin=-1)
      const startAngle = (270 * Math.PI) / 180 // 270° in radians
      const endAngle = (630 * Math.PI) / 180   // 630° in radians  
      const angle = startAngle + (i / numPoints) * (endAngle - startAngle)
      
      // Calculate sine wave value and invert for upright parabola
      const sineValue = Math.sin(angle) // This gives us -1 at edges, 1 at center
      // Invert and normalize: (-1 becomes 0, 1 becomes height) for upright U-shape
      const y = endpointHeight - (height * (sineValue + 1) / 2) // Start from endpointHeight and go up
      
      points.push(`${x},${y}`)
    }

    // All waves start and end at the SAME height (endpointHeight)
    const firstPoint = `0,${endpointHeight}`
    const lastPoint = `${width},${endpointHeight}`
    
    return `M ${firstPoint} L ${points.slice(1, -1).join(" L ")} L ${lastPoint}`
  }

  // Calculate progress values first
  const phase1Progress = Math.min(parabolaHeight / windowHeight, 1)
  const overallProgress = phase1Progress

  // Generate multiple parabolas with different peak heights but same endpoints
  const generateMultipleParabolas = () => {
    // Each parabola is a single color: green, #F97A00, black
    const colors = [
      { name: "green", color: "#00C853" }, // vivid green
      { name: "orange", color: "#F97A00" },
      { name: "black", color: "#000000" },
    ]
    const parabolas = []
    const numParabolas = colors.length
    const sharedEndpointHeight = parabolaHeight
    const heightMultipliers = [0.7, 0.85, 1.0] // tallest = black
    const blurs = [8, 16, 32] // more blur for lower layers
    const opacities = [0.7, 0.6, 0.5]
    for (let i = 0; i < numParabolas; i++) {
      const currentHeight = parabolaHeight * heightMultipliers[i]
      if (currentHeight > 0) {
        const path = generateParabolaPath(windowWidth, currentHeight, sharedEndpointHeight)
        parabolas.push({
          path,
          height: currentHeight,
          color: colors[i].color,
          opacity: opacities[i],
          blur: blurs[i],
          layer: i
        })
      }
    }
    return parabolas
  }

  const multipleParabolas = generateMultipleParabolas()

  // Generate deterministic particles to avoid hydration mismatch
  const particles = Array.from({ length: 15 }, (_, i) => {
    // Use index-based deterministic values instead of Math.random()
    const seed1 = (i * 73) % 100
    const seed2 = (i * 37 + 23) % 100
    const seed3 = (i * 61 + 11) % 100
    
    return {
      id: i,
      left: `${seed1}%`,
      top: `${seed2}%`,
      duration: 2 + (seed3 / 100) * 3, // 2-5 seconds
      delay: (seed1 / 100) * 3, // 0-3 seconds delay
    }
  })

  return (
    <div ref={containerRef} className="relative">
      {/* First Section */}
      <section ref={heroSectionRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
 

        {/* Floating particles - only render on client to avoid hydration mismatch */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animation: `pulse ${particle.duration}s infinite`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Multiple Parabolas SVG - positioned to start from top of lower section */}
        {parabolaHeight > 0 && (
          <svg
            className="absolute top-full left-0 w-full pointer-events-none z-20"
            style={{
              height: `${Math.min(parabolaHeight + windowHeight * 0.3, windowHeight * 4)}px`,
              transform: `translateY(-${parabolaHeight}px)`,
            }}
            viewBox={`0 0 ${windowWidth} ${parabolaHeight + windowHeight * 0.3}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Each parabola gets a solid color gradient for blending */}
              {multipleParabolas.map((parabola, index) => (
                <linearGradient key={`gradient-${index}`} id={`parabolaSolidGradient${parabola.layer}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={parabola.color} stopOpacity={parabola.opacity} />
                  <stop offset="100%" stopColor={parabola.color} stopOpacity="0.1" />
                </linearGradient>
              ))}
              {/* Blur filters for each parabola */}
              {multipleParabolas.map((parabola, index) => (
                <filter key={`blur-${index}`} id={`simpleBlur${parabola.layer}`}> 
                  <feGaussianBlur stdDeviation={parabola.blur} />
                </filter>
              ))}
            </defs>
            {/* Parabola rendering with blending and blur */}
            {multipleParabolas.map((parabola, index) => (
              <g key={`parabola-${index}`}>
                <path
                  d={`${parabola.path} L ${windowWidth},${parabolaHeight + windowHeight * 0.3} L 0,${parabolaHeight + windowHeight * 0.3} Z`}
                  fill={`url(#parabolaSolidGradient${parabola.layer})`}
                  style={{
                    filter: `url(#simpleBlur${parabola.layer})`,
                    opacity: parabola.opacity,
                    mixBlendMode: "lighten"
                  }}
                />
              </g>
            ))}
          </svg>
        )}

        {/* Phase indicator */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white opacity-60 z-30">
          <div className="text-center">
            <div className="text-sm mb-2">
              Phase:{" "}
              {phase1Progress < 1
                ? "1 - Growing Parabola"
                : "2 - Normal Scroll"}
            </div>
            <div className="w-48 bg-white/20 rounded-full h-1 mb-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${phase1Progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Debug info */}
        <div className="absolute top-20 left-8 text-white opacity-40 text-xs z-30">
          <div>
            Parabola: {Math.round(parabolaHeight)}px / {windowHeight}px
          </div>
          <div>Phase 1: {phase1Progress < 1 ? Math.round(phase1Progress * 100) + "%" : "✓"}</div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-60 z-30">
          <div className="text-sm mb-2 text-center">
            {phase1Progress < 1
              ? "Scroll down to grow the parabola"
              : "Parabola complete - normal scrolling active"}
          </div>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div
              className="w-1 bg-white rounded-full mt-2 transition-all duration-300"
              style={{ height: `${8 + overallProgress * 16}px` }}
            />
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-gray-900/80 via-gray-900 to-black text-white">
        
      </section>
    </div>
  )
}
