"use client"

import { useEffect, useState, useRef } from "react"

export default function ParabolaScrollSections() {
  const [parabolaHeight, setParabolaHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(800)
  const [windowWidth, setWindowWidth] = useState(1200)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{left: string, top: string, animationDuration: string, animationDelay: string}>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate phases
  const maxParabolaHeight = windowHeight * 2 // Parabola can grow to 2x screen height
  const maxScrollPosition = windowHeight // Scroll one full screen height to reveal second section

  const phase1Complete = parabolaHeight >= windowHeight // First phase: parabola reaches screen height
  const phase2Complete = scrollPosition >= maxScrollPosition && parabolaHeight >= maxParabolaHeight // Second phase: fully scrolled and parabola at max

  useEffect(() => {
    // Set initial window dimensions and generate particles on client only
    if (typeof window !== "undefined") {
      setIsClient(true)
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
      
      // Generate particles on client side only
      const generatedParticles = [...Array(15)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 3}s`
      }))
      setParticles(generatedParticles)

      const handleResize = () => {
        setWindowHeight(window.innerHeight)
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate how much of the section is actually visible
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      
      // Calculate visible portion of the section
      const visibleTop = Math.max(0, -rect.top)
      const visibleBottom = Math.min(sectionHeight, viewportHeight - rect.top)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)
      const sectionVisibility = visibleHeight / sectionHeight
      
      const shouldActivateParabola = sectionVisibility >= 0.5 // Temporarily lowered to 50% for testing
      
      // Add debug logging
      console.log('Section visibility:', sectionVisibility, 'Should activate:', shouldActivateParabola)
      
      const scrollSensitivity = 2
      const deltaY = e.deltaY * scrollSensitivity

      // If parabola exists or user is scrolling down AND section is 95% visible, handle custom behavior
      if ((parabolaHeight > 0 || scrollPosition > 0 || (deltaY > 0 && shouldActivateParabola))) {
        e.preventDefault()

        if (deltaY > 0) {
          // Scrolling down
          if (!phase1Complete) {
            // Phase 1: Only grow parabola, don't scroll page
            setParabolaHeight((prev) => Math.min(prev + deltaY, windowHeight))
          } else if (!phase2Complete) {
            // Phase 2: Grow parabola AND scroll page simultaneously
            setParabolaHeight((prev) => Math.min(prev + deltaY, maxParabolaHeight))
            setScrollPosition((prev) => {
              const newScrollPos = Math.min(prev + deltaY, maxScrollPosition)
              return newScrollPos
            })
          } else {
            // Phase 3: Normal scrolling (parabola at max height)
            window.scrollTo(0, window.scrollY + deltaY)
          }
        } else {
          // Scrolling up - reverse through phases
          if (phase2Complete || scrollPosition > 0) {
            // First reduce scroll position and parabola height simultaneously
            const scrollReduction = Math.min(-deltaY, scrollPosition)
            const parabolaReduction = Math.min(-deltaY, parabolaHeight - windowHeight)

            setScrollPosition((prev) => {
              const newScrollPos = Math.max(prev + deltaY, 0)
              return newScrollPos
            })

            if (parabolaHeight > windowHeight) {
              setParabolaHeight((prev) => Math.max(prev + deltaY, windowHeight))
            }
          } else {
            // Phase 1 reverse: Only shrink parabola
            setParabolaHeight((prev) => Math.max(prev + deltaY, 0))
          }
        }
      }
    }

    const handleScroll = (e: Event) => {
      // Prevent default scroll behavior during custom phases
      if (parabolaHeight > 0 && !phase2Complete) {
        e.preventDefault()
        // Don't call scrollTo here to prevent jumping
        return false
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("wheel", handleWheel, { passive: false })
      window.addEventListener("scroll", handleScroll, { passive: false })

      return () => {
        window.removeEventListener("wheel", handleWheel)
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [
    isClient,
    parabolaHeight,
    scrollPosition,
    phase1Complete,
    phase2Complete,
    windowHeight,
    maxParabolaHeight,
    maxScrollPosition,
  ])

  // Generate parabola path with proper curve
  const generateParabolaPath = (width: number, height: number) => {
    if (height <= 0) return `M 0,0 L ${width},0`

    const points = []
    const numPoints = 50

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width
      const normalizedX = (x - width / 2) / (width / 2)
      const y = -height * (1 - normalizedX * normalizedX)
      points.push(`${x},${y}`)
    }

    return `M ${points.join(" L ")}`
  }

  const parabolaPath = generateParabolaPath(windowWidth, parabolaHeight)
  const phase1Progress = Math.min(parabolaHeight / windowHeight, 1)
  const phase2Progress = Math.min(scrollPosition / maxScrollPosition, 1)
  const overallProgress = (phase1Progress + phase2Progress) / 2

  // Don't render until client hydration is complete
  if (!isClient) {
    return (
      <div className="relative">
        <section className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Unlock Your
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-light mb-8 opacity-90">True Potential</h2>
            <p className="text-lg md:text-xl lg:text-2xl opacity-75 max-w-2xl mx-auto leading-relaxed">
              Discover the power within you and transform your reality
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* First Section */}
      <section className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Unlock Your
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-light mb-8 opacity-90">True Potential</h2>
          <p className="text-lg md:text-xl lg:text-2xl opacity-75 max-w-2xl mx-auto leading-relaxed">
            Discover the power within you and transform your reality
          </p>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isClient && particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
              style={{
                left: particle.left,
                top: particle.top,
                animation: `pulse ${particle.animationDuration} infinite`,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Parabola SVG - can grow beyond screen height */}
        {parabolaHeight > 0 && (
          <svg
            className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
            style={{
              height: `${Math.min(parabolaHeight, windowHeight * 3)}px`,
              transform: `translateY(${Math.max(0, windowHeight - parabolaHeight)}px)`,
            }}
            viewBox={`0 ${-parabolaHeight} ${windowWidth} ${parabolaHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="parabolaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" stopOpacity="1" />
                <stop offset="100%" stopColor="#111827" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d={`${parabolaPath} L ${windowWidth},0 L 0,0 Z`} fill="url(#parabolaGradient)" />
            <path
              d={parabolaPath}
              stroke="rgba(147, 51, 234, 0.9)"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
              className="drop-shadow-lg"
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
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${phase1Progress * 100}%` }}
              />
            </div>
            {phase1Complete && (
              <div className="w-48 bg-white/20 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-pink-400 to-red-400 h-1 rounded-full transition-all duration-300"
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
          <div>Section visibility: {containerRef.current ? 
            (() => {
              const rect = containerRef.current.getBoundingClientRect()
              const visibleTop = Math.max(0, -rect.top)
              const visibleBottom = Math.min(rect.height, window.innerHeight - rect.top)
              const visibleHeight = Math.max(0, visibleBottom - visibleTop)
              return Math.round((visibleHeight / rect.height) * 100)
            })()
            : 0}%</div>
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
      <section 
        className="relative w-full min-h-screen bg-gradient-to-br from-[#021400] to-black text-white"
        style={{
          transform: `translateY(${windowHeight - scrollPosition}px)`
        }}
      >
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-3xl md:text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl md:text-2xl font-bold mb-4 text-purple-300">{item.title}</h4>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-20">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Begin Your Transformation
            </button>
          </div>

          {/* Status indicator */}
          <div className="text-center mb-16">
            <div className="text-purple-300 mb-4">
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
              <h4 className="text-2xl md:text-3xl font-bold mb-8 text-purple-300">Multi-Phase Interaction</h4>
              <p className="text-base md:text-lg opacity-75 max-w-3xl mx-auto leading-relaxed">
                Experience a unique three-phase scroll interaction: first the parabola grows, then it continues growing
                while the page scrolls, finally normal scrolling takes over.
              </p>
            </div>

            <div className="h-64 md:h-96 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl flex items-center justify-center">
              <p className="text-xl md:text-2xl font-light opacity-60 text-center px-4">
                {!phase1Complete
                  ? "Phase 1: Parabola is growing to screen height"
                  : !phase2Complete
                    ? "Phase 2: Parabola growing while page scrolls"
                    : "Phase 3: All animations complete!"}
              </p>
            </div>

            <div className="h-64 md:h-96 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl flex items-center justify-center">
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
