"use client"

import { useEffect, useState, useRef } from "react"

export default function ParabolaScrollPage() {
  const [parabolaHeight, setParabolaHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(800)
  const [windowWidth, setWindowWidth] = useState(1200)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate phases
  const maxParabolaHeight = windowHeight * 2 // Parabola can grow to 2x screen height
  const maxScrollPosition = windowHeight // Scroll one full screen height to reveal second section

  const phase1Complete = parabolaHeight >= windowHeight // First phase: parabola reaches screen height
  const phase2Complete = scrollPosition >= maxScrollPosition && parabolaHeight >= maxParabolaHeight // Second phase: fully scrolled and parabola at max

  useEffect(() => {
    // Set client-side flag and initial window dimensions
    setIsClient(true)
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)

      const handleResize = () => {
        setWindowHeight(window.innerHeight)
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Use Intersection Observer for better detection of when component is active
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { 
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50% 0px' // Only trigger when in upper half of viewport
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  // Reset parabola state when component is no longer intersecting and no active phases
  useEffect(() => {
    if (!isIntersecting && parabolaHeight === 0 && scrollPosition === 0) {
      // Component is not visible and not in active state - ensure clean state
      setParabolaHeight(0)
      setScrollPosition(0)
    }
  }, [isIntersecting, parabolaHeight, scrollPosition])

  useEffect(() => {
    // Only add wheel listener when component is in view and needs custom behavior
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return

      // Only handle wheel events if we're intersecting OR in an active parabola phase
      const shouldHandle = isIntersecting || parabolaHeight > 0 || scrollPosition > 0
      
      if (!shouldHandle) {
        return // Let normal scroll behavior handle it
      }

      const scrollSensitivity = 2
      const deltaY = e.deltaY * scrollSensitivity

      // Only prevent default if we're actively in a parabola phase or starting one
      if (parabolaHeight > 0 || scrollPosition > 0 || (isIntersecting && deltaY > 0)) {
        // But don't prevent default if both phases are complete - let normal scroll take over
        if (phase1Complete && phase2Complete) {
          return // Let browser handle normal scrolling
        }
        
        e.preventDefault()

        if (deltaY > 0) {
          // Scrolling down
          if (!phase1Complete) {
            // Phase 1: Only grow parabola
            setParabolaHeight((prev) => Math.min(prev + deltaY, windowHeight))
          } else if (!phase2Complete) {
            // Phase 2: Grow parabola AND scroll page
            setParabolaHeight((prev) => Math.min(prev + deltaY, maxParabolaHeight))
            setScrollPosition((prev) => {
              const newScrollPos = Math.min(prev + deltaY, maxScrollPosition)
              window.scrollTo(0, newScrollPos)
              return newScrollPos
            })
          } else {
            // Phase 3: Let normal scrolling take over - don't interfere
            return
          }
        } else {
          // Scrolling up
          if (scrollPosition > 0) {
            setScrollPosition((prev) => {
              const newScrollPos = Math.max(prev + deltaY, 0)
              window.scrollTo(0, newScrollPos)
              return newScrollPos
            })
            if (parabolaHeight > windowHeight) {
              setParabolaHeight((prev) => Math.max(prev + deltaY, windowHeight))
            }
          } else {
            setParabolaHeight((prev) => Math.max(prev + deltaY, 0))
          }
        }
      }
    }

    // Only add listener when component is mounted
    if (typeof window !== "undefined" && containerRef.current) {
      window.addEventListener("wheel", handleWheel, { passive: false })
      
      return () => {
        window.removeEventListener("wheel", handleWheel)
      }
    }
  }, [
    isIntersecting,
    parabolaHeight,
    scrollPosition,
    phase1Complete,
    phase2Complete,
    windowHeight,
    maxParabolaHeight,
    maxScrollPosition,
  ])

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
  const phase2Progress = Math.min(scrollPosition / maxScrollPosition, 1)
  const overallProgress = (phase1Progress + phase2Progress) / 2

  // Generate multiple parabolas with different peak heights but same endpoints
  const generateMultipleParabolas = () => {
    const parabolas = []
    const numParabolas = 5 // Number of layered parabolas
    
    // All parabolas should end at the same height - endpoints at the top of the second section
    const sharedEndpointHeight = parabolaHeight // Endpoints align with top of second section
    
    for (let i = 0; i < numParabolas; i++) {
      // Different height growth rates for each parabola
      // Reversed order: shortest (slowest) first, tallest (fastest) last
      const heightMultipliers = [0.4, 0.55, 0.7, 0.85, 1.0] // Ascending order
      const heightMultiplier = heightMultipliers[i] || 1.0
      const currentHeight = parabolaHeight * heightMultiplier
      
      if (currentHeight > 0) {
        const path = generateParabolaPath(windowWidth, currentHeight, sharedEndpointHeight)
        parabolas.push({
          path,
          height: currentHeight,
          opacity: 0.5 + (i * 0.1), // Increasing opacity (shortest has lowest opacity)
          blur: (numParabolas - 1 - i) * 2, // Decreasing blur (shortest has most blur)
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
      <section className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
 

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
              height: `${Math.min(parabolaHeight + windowHeight * 0.3, windowHeight * 4)}px`, // Extended height for blending
              transform: `translateY(-${parabolaHeight}px)`, // Move up by wave height so wave peaks into first section
            }}
            viewBox={`0 0 ${windowWidth} ${parabolaHeight + windowHeight * 0.3}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="parabolaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#16a34a" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#15803d" stopOpacity="0.7" />
                <stop offset="75%" stopColor="#166534" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#14532d" stopOpacity="0.5" />
              </linearGradient>
              
              {/* Multiple radial gradients for different layers */}
              {multipleParabolas.map((parabola, index) => (
                <radialGradient key={`gradient-${index}`} id={`parabolaRadialGradient${index}`} cx="50%" cy="0%" r="120%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9 * parabola.opacity} />
                  <stop offset="20%" stopColor="#22c55e" stopOpacity={0.8 * parabola.opacity} />
                  <stop offset="40%" stopColor="#16a34a" stopOpacity={0.7 * parabola.opacity} />
                  <stop offset="60%" stopColor="#15803d" stopOpacity={0.6 * parabola.opacity} />
                  <stop offset="80%" stopColor="#166534" stopOpacity={0.4 * parabola.opacity} />
                  <stop offset="100%" stopColor="#14532d" stopOpacity={0.2 * parabola.opacity} />
                </radialGradient>
              ))}
              
              <linearGradient id="blendingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14532d" stopOpacity="0.3" />
                <stop offset="30%" stopColor="#166534" stopOpacity="0.2" />
                <stop offset="60%" stopColor="#1f2937" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0" />
              </linearGradient>
              
              {/* Multiple blur filters for different layers */}
              {multipleParabolas.map((parabola, index) => (
                <filter key={`glow-${index}`} id={`glow${index}`}>
                  <feGaussianBlur stdDeviation={4 + parabola.blur} result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>
            
            {/* Render multiple parabolas from back to front (tallest to shortest) */}
            {multipleParabolas.map((parabola, index) => (
              <g key={`parabola-${index}`}>
                {/* Main wave fill - fill below the wave curve */}
                <path 
                  d={`${parabola.path} L ${windowWidth},${parabolaHeight + windowHeight * 0.3} L 0,${parabolaHeight + windowHeight * 0.3} Z`} 
                  fill={`url(#parabolaRadialGradient${parabola.layer})`}
                  style={{ filter: `blur(${parabola.blur}px)` }}
                />
                
                {/* Wave stroke effects */}
                <path
                  d={parabola.path}
                  stroke={`rgba(34, 197, 94, ${0.9 * parabola.opacity})`}
                  strokeWidth="3"
                  fill="none"
                  filter={`url(#glow${parabola.layer})`}
                  className="drop-shadow-lg"
                />
                
                {/* Additional glow effect */}
                <path
                  d={parabola.path}
                  stroke={`rgba(74, 222, 128, ${0.6 * parabola.opacity})`}
                  strokeWidth="6"
                  fill="none"
                  style={{ 
                    opacity: 0.5 * parabola.opacity,
                    filter: `blur(${parabola.blur * 0.5}px)`
                  }}
                />
              </g>
            ))}
            
            {/* Blending gradient rectangle extending below the wave */}
            <rect 
              x="0" 
              y={parabolaHeight} 
              width={windowWidth} 
              height={windowHeight * 0.3} 
              fill="url(#blendingGradient)" 
            />
          </svg>
        )}

        {/* Phase indicator */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white opacity-60 z-30">
          <div className="text-center">
            <div className="text-sm mb-2">
              Phase:{" "}
              {!phase1Complete
                ? "1 - Growing Parabola"
                : !phase2Complete
                  ? "2 - Growing + Scrolling"
                  : "3 - Normal Scroll"}
            </div>
            <div className="w-48 bg-white/20 rounded-full h-1 mb-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${phase1Progress * 100}%` }}
              />
            </div>
            {phase1Complete && (
              <div className="w-48 bg-white/20 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${phase2Progress * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Debug info */}
        <div className="absolute top-20 left-8 text-white opacity-40 text-xs z-30">
          <div>
            Parabola: {Math.round(parabolaHeight)}px / {maxParabolaHeight}px
          </div>
          <div>
            Scroll: {Math.round(scrollPosition)}px / {maxScrollPosition}px
          </div>
          <div>Phase 1: {phase1Complete ? "✓" : Math.round(phase1Progress * 100) + "%"}</div>
          <div>Phase 2: {phase2Complete ? "✓" : Math.round(phase2Progress * 100) + "%"}</div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-60 z-30">
          <div className="text-sm mb-2 text-center">
            {!phase1Complete
              ? "Scroll down to grow the parabola"
              : !phase2Complete
                ? "Keep scrolling - parabola grows while page scrolls"
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
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Transform Reality
            </h3>
            <p className="text-lg md:text-xl lg:text-2xl opacity-80 leading-relaxed mb-12">
              Step into a world where limitations dissolve and possibilities become infinite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Mindset Revolution",
                description: "Rewire your thinking patterns and unlock mental barriers.",
                icon: "🧠",
              },
              {
                title: "Energy Mastery",
                description: "Harness your inner energy and channel it towards your goals.",
                icon: "⚡",
              },
              {
                title: "Reality Shaping",
                description: "Learn to influence your environment and create your vision.",
                icon: "🌟",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-3xl md:text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl md:text-2xl font-bold mb-4 text-green-300">{item.title}</h4>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-20">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Begin Your Transformation
            </button>
          </div>

          {/* Status indicator */}
          <div className="text-center mb-16">
            <div className="text-green-300 mb-4">
              Current Phase:{" "}
              {!phase1Complete
                ? "Growing Parabola"
                : !phase2Complete
                  ? "Simultaneous Growth & Scroll"
                  : "Complete - Normal Scrolling"}
            </div>
          </div>

          {/* Additional content */}
          <div className="space-y-16">
            <div className="text-center">
              <h4 className="text-2xl md:text-3xl font-bold mb-8 text-green-300">Multi-Phase Interaction</h4>
              <p className="text-base md:text-lg opacity-75 max-w-3xl mx-auto leading-relaxed">
                Experience a unique three-phase scroll interaction: first the parabola grows, then it continues growing
                while the page scrolls, finally normal scrolling takes over.
              </p>
            </div>

            <div className="h-64 md:h-96 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-3xl flex items-center justify-center">
              <p className="text-xl md:text-2xl font-light opacity-60 text-center px-4">
                {!phase1Complete
                  ? "Phase 1: Parabola is growing to screen height"
                  : !phase2Complete
                    ? "Phase 2: Parabola growing while page scrolls"
                    : "Phase 3: All animations complete!"}
              </p>
            </div>

            <div className="h-64 md:h-96 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-3xl flex items-center justify-center">
              <p className="text-xl md:text-2xl font-light opacity-60 text-center px-4">
                The advanced parabola creates a seamless transition experience!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
