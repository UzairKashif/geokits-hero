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

  // Generate parabola path as a HILL that rises UP from the bottom
  const generateCurvePath = (width: number, height: number) => {
    if (height <= 0) return `M 0,${height} L ${width},${height}`

    const curvePoints = []
    const totalPoints = 150
    
    // Make the parabola wider
    const curveWidth = width * 1.3
    const offsetX = -width * 0.15

    // Generate hill points - start at bottom (height), curve UP to peak (0)
    const centerX = width / 2
    const a = height / Math.pow(centerX * 0.6, 2)
    
    // Create upward hill: baseline at 'height', peak at 0
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints
      const x = offsetX + t * curveWidth
      const y = height - a * Math.pow(x - centerX, 2) // Inverted to make hill curve

      const clampedX = Math.max(0, Math.min(width, x))
      curvePoints.push(`${clampedX},${y}`)
    }

    // Create the hill path
    return `M ${curvePoints.join(" L ")}`
  }

  // Calculate progress values first
  const maxCurveHeight = screenHeight * 4
  const sectionProgress = Math.min(curveHeight / maxCurveHeight, 1)
  const totalProgress = sectionProgress

  // Generate multiple parabolas with gradient consistency
  const generateMultipleCurves = () => {
    const colorSchemes = [
      { name: "orange", color: "#F97A00", innerColor: "#FFD700" }, // Yellow to orange
      { name: "green", color: "#00C853", innerColor: "#90EE90" }, // Light green to vivid green
      { name: "black", color: "#000000", innerColor: "#404040" }, // Dark gray to black
    ]
    const curveArray = []
    const totalCurves = colorSchemes.length
    const sharedEndHeight = curveHeight
    const heightRatios = [0.75, 0.9, 1.0] // More layered approach
    
    for (let i = 0; i < totalCurves; i++) {
      const currentHeight = curveHeight * heightRatios[i]
      if (currentHeight > 0) {
        const curvePath = generateCurvePath(screenWidth, currentHeight)
        curveArray.push({
          path: curvePath,
          height: currentHeight,
          color: colorSchemes[i].color,
          innerColor: colorSchemes[i].innerColor,
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
              {/* Radial gradients for each parabola to match the reference image */}
              {multipleCurves.map((curve, index) => (
                <radialGradient 
                  key={`radial-gradient-${index}`} 
                  id={`curveRadialGradient${curve.layer}`} 
                  cx="50%" 
                  cy="0%" 
                  r="100%"
                  gradientUnits="objectBoundingBox"
                >
                  <stop offset="0%" stopColor={curve.innerColor} stopOpacity="1" />
                  <stop offset="30%" stopColor={curve.color} stopOpacity="0.9" />
                  <stop offset="70%" stopColor={curve.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={curve.color} stopOpacity="0.1" />
                </radialGradient>
              ))}
              
              {/* Subtle blur filters for smoothness */}
              {multipleCurves.map((curve, index) => (
                <filter key={`blur-${index}`} id={`smoothBlur${curve.layer}`}> 
                  <feGaussianBlur stdDeviation={2 + curve.layer * 2} />
                </filter>
              ))}
            </defs>
            
            {/* Parabola rendering with smooth gradients */}
            {multipleCurves.map((curve, index) => (
              <g key={`curve-${index}`}>
                <path
                  d={`${curve.path} L ${screenWidth},${curveHeight + screenHeight * 0.5} L 0,${curveHeight + screenHeight * 0.5} Z`}
                  fill={`url(#curveRadialGradient${curve.layer})`}
                  style={{
                    filter: `url(#smoothBlur${curve.layer})`,
                    opacity: 0.8 - (curve.layer * 0.1),
                    mixBlendMode: curve.layer === 2 ? "multiply" : "screen"
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
