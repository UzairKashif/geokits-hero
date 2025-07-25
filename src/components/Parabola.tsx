"use client"

import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "./LenisProvider"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ParabolaScrollPage() {
  const [curveHeight, setCurveHeight] = useState(0)
  const [screenHeight, setScreenHeight] = useState(800)
  const [screenWidth, setScreenWidth] = useState(1200)
  const [isClientReady, setIsClientReady] = useState(false)
  
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const firstSectionRef = useRef<HTMLDivElement>(null)
  const lenisInstance = useLenis()

  useEffect(() => {
    // Set client-side flag and initial window dimensions
    setIsClientReady(true)
    if (typeof window !== "undefined") {
      setScreenHeight(window.innerHeight)
      setScreenWidth(window.innerWidth)

      const handleResize = () => {
        setScreenHeight(window.innerHeight)
        setScreenWidth(window.innerWidth)
        ScrollTrigger.refresh()
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isClientReady || !mainContainerRef.current || !firstSectionRef.current) return

    // Kill any existing ScrollTriggers on this element to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === firstSectionRef.current) {
        trigger.kill()
      }
    })

    const scrollAnimation = gsap.to({ height: 0 }, {
      height: screenHeight * 2, // Allow parabola to grow to 2x screen height
      ease: "none",
      onUpdate: function () {
        setCurveHeight(this.targets()[0].height)
      },
      scrollTrigger: {
        trigger: firstSectionRef.current,
        start: "top top",
        end: `+=${screenHeight * 2}`, // Pin for 2x screen height worth of scroll
        scrub: 1,
        pin: firstSectionRef.current,
        pinSpacing: true,
        id: "parabola-scroll",
        refreshPriority: -1,
      },
    })

    return () => {
      scrollAnimation.kill()
    }
  }, [isClientReady, screenHeight, lenisInstance])

  // Generate parabola path with proper curve - endpoints at a fixed height
  const generateCurvePath = (width: number, height: number, endpointHeight: number) => {
    if (height <= 0) return `M 0,0 L ${width},0`

    const curvePoints = []
    const totalPoints = 100 // More points for smoother curve

    // Generate points for a sine wave from 270° to 630° to create upright parabola
    // x=0 maps to 270°, x=width/2 maps to 90° (360°), x=width maps to 630°
    for (let i = 0; i <= totalPoints; i++) {
      const x = (i / totalPoints) * width // x goes from 0 to width
      
      // Map x position to angle range: 270° to 630° (in radians)
      // This creates: x=0→270°(sin=-1), x=center→90°/450°(sin=1), x=width→630°(sin=-1)
      const startAngle = (270 * Math.PI) / 180 // 270° in radians
      const endAngle = (630 * Math.PI) / 180   // 630° in radians  
      const angle = startAngle + (i / totalPoints) * (endAngle - startAngle)
      
      // Calculate sine wave value and invert for upright parabola
      const sineValue = Math.sin(angle) // This gives us -1 at edges, 1 at center
      // Invert and normalize: (-1 becomes 0, 1 becomes height) for upright U-shape
      const y = endpointHeight - (height * (sineValue + 1) / 2) // Start from endpointHeight and go up
      
      curvePoints.push(`${x},${y}`)
    }

    // All waves start and end at the SAME height (endpointHeight)
    const firstPoint = `0,${endpointHeight}`
    const lastPoint = `${width},${endpointHeight}`
    
    return `M ${firstPoint} L ${curvePoints.slice(1, -1).join(" L ")} L ${lastPoint}`
  }

  // Calculate progress values first
  const maxCurveHeight = screenHeight * 2
  const sectionProgress = Math.min(curveHeight / maxCurveHeight, 1)
  const totalProgress = sectionProgress

  // Generate multiple parabolas with different peak heights but same endpoints
  const generateMultipleCurves = () => {
    // Each parabola is a single color: green, #F97A00, black
    const colorSchemes = [
      { name: "orange", color: "#F97A00" },
      { name: "green", color: "#00C853" }, // vivid green
      { name: "black", color: "#000000" },
    ]
    const curveArray = []
    const totalCurves = colorSchemes.length
    const sharedEndHeight = curveHeight
    const heightRatios = [0.7, 0.85, 1.0] // tallest = black
    const blurLevels = [8, 16, 32] // more blur for lower layers
    const alphaValues = [0.7, 0.6, 0.5]
    for (let i = 0; i < totalCurves; i++) {
      const currentHeight = curveHeight * heightRatios[i]
      if (currentHeight > 0) {
        const curvePath = generateCurvePath(screenWidth, currentHeight, sharedEndHeight)
        curveArray.push({
          path: curvePath,
          height: currentHeight,
          color: colorSchemes[i].color,
          opacity: alphaValues[i],
          blur: blurLevels[i],
          layer: i
        })
      }
    }
    return curveArray
  }

  const multipleCurves = generateMultipleCurves()

  // Generate deterministic particles to avoid hydration mismatch
  const floatingElements = Array.from({ length: 15 }, (_, i) => {
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
    <div ref={mainContainerRef} className="relative">
      {/* First Section */}
      <section ref={firstSectionRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
 

        {/* Floating particles - only render on client to avoid hydration mismatch */}
        {isClientReady && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingElements.map((element) => (
              <div
                key={element.id}
                className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
                style={{
                  left: element.left,
                  top: element.top,
                  animation: `pulse ${element.duration}s infinite`,
                  animationDelay: `${element.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Multiple Parabolas SVG - positioned to start from top of lower section */}
        {curveHeight > 0 && (
          <svg
            className="absolute top-full left-0 w-full pointer-events-none z-20"
            style={{
              height: `${Math.min(curveHeight + screenHeight * 0.5, screenHeight * 5)}px`,
              transform: `translateY(-${curveHeight}px)`,
            }}
            viewBox={`0 0 ${screenWidth} ${curveHeight + screenHeight * 0.5}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Each parabola gets a solid color gradient for blending */}
              {multipleCurves.map((curve, index) => (
                <linearGradient key={`gradient-${index}`} id={`curveSolidGradient${curve.layer}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={curve.color} stopOpacity={curve.opacity} />
                  <stop offset="100%" stopColor={curve.color} stopOpacity="0.1" />
                </linearGradient>
              ))}
              {/* Blur filters for each parabola */}
              {multipleCurves.map((curve, index) => (
                <filter key={`blur-${index}`} id={`simpleBlur${curve.layer}`}> 
                  <feGaussianBlur stdDeviation={curve.blur} />
                </filter>
              ))}
            </defs>
            {/* Parabola rendering with blending and blur */}
            {multipleCurves.map((curve, index) => (
              <g key={`curve-${index}`}>
                <path
                  d={`${curve.path} L ${screenWidth},${curveHeight + screenHeight * 0.5} L 0,${curveHeight + screenHeight * 0.5} Z`}
                  fill={`url(#curveSolidGradient${curve.layer})`}
                  style={{
                    filter: `url(#simpleBlur${curve.layer})`,
                    opacity: curve.opacity,
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

            <div className="w-48 bg-white/20 rounded-full h-1 mb-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${sectionProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

      </section>

      {/* Second Section */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-gray-900/80 via-gray-900 to-black text-white">
        
      </section>
    </div>
  )
}
