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

  // Generate cosine curve path as a HILL that rises UP from the bottom
  const generateCurvePath = (width: number, amplitude: number, peakY: number) => {
    if (amplitude <= 0) return `M 0,${peakY + amplitude} L ${width},${peakY + amplitude}`

    const curvePoints = []
    const totalPoints = 150

    // Create upward hill using a cosine curve
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints
      const x = t * width

      // Map x from [0, width] to angle from [-PI, PI]
      const angle = (t * 2 - 1) * Math.PI

      // Calculate y using cosine.
      // y is scaled to be between peakY (peak) and peakY + amplitude (base).
      const y = peakY + (amplitude / 2) * (1 - Math.cos(angle))

      curvePoints.push(`${x},${y}`)
    }

    // Create the hill path
    return `M ${curvePoints.join(" L ")}`
  }

  // Calculate progress values first
  const maxCurveHeight = screenHeight * 4
  const sectionProgress = Math.min(curveHeight / maxCurveHeight, 1)
  const totalProgress = sectionProgress

  // Generate multiple parabolas with solid colors
  const generateMultipleCurves = () => {
    const colorSchemes = [
      { name: "black", color: "#000000" }, // Black (bottom-most, largest)
      { name: "orange", color: "#F97A00" }, // Orange (middle)
      { name: "white", color: "#FFFFFF" }, // White (top-most, smallest)
    ]
    const curveArray = []
    const totalCurves = colorSchemes.length
    const sharedEndHeight = curveHeight
    const heightRatios = [1.0, 0.7, 0.5] // Draw largest first

    for (let i = 0; i < totalCurves; i++) {
      const amplitude = curveHeight * heightRatios[i]
      const peakY = sharedEndHeight - amplitude
      if (amplitude > 0) {
        const curvePath = generateCurvePath(screenWidth, amplitude, peakY)
        curveArray.push({
          path: curvePath,
          height: amplitude,
          color: colorSchemes[i].color,
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
      {/* First Section (Parabola) */}
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
              {/* Gradients for visual effects */}
              <radialGradient id="blackGradient" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                <stop offset="50%" stopColor="#000000" stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </radialGradient>
              
              <radialGradient id="orangeGradient" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="1" />
                <stop offset="50%" stopColor="#00CC66" stopOpacity="1" />
                <stop offset="100%" stopColor="#004D26" stopOpacity="0.8" />
              </radialGradient>
              
              <radialGradient id="whiteGradient" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="70%" stopColor="#F5F5F5" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.7" />
              </radialGradient>
              
              {/* Artistic blur filters for smooth blending */}
              <filter id="artisticBlur1">
                <feGaussianBlur stdDeviation="12" result="blur"/>
                <feColorMatrix in="blur" type="saturate" values="1"/>
              </filter>
              
              <filter id="artisticBlur2">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feColorMatrix in="blur" type="saturate" values="1.2"/>
              </filter>
              
              <filter id="artisticBlur3">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feColorMatrix in="blur" type="saturate" values="1.1"/>
              </filter>
            </defs>

            {/* Parabola rendering with artistic blur effects */}
            {multipleCurves.map((curve, index) => {
              const gradientId = index === 0 ? "orangeGradient" : index === 1 ? "whiteGradient" : "blackGradient"
              const filterId = `artisticBlur${index + 1}`
              
              return (
                <g key={`curve-${index}`}>
                  <path
                    d={`${curve.path} L ${screenWidth},${curveHeight + screenHeight * 0.5} L 0,${curveHeight + screenHeight * 0.5} Z`}
                    fill={`url(#${gradientId})`}
                    filter={`url(#${filterId})`}
                    style={{
                      mixBlendMode: "normal",
                      opacity: index === 0 ? 1.0 : index === 1 ? 0.9 : 0.8
                    }}
                  />
                </g>
              )
            })}
          </svg>
        )}
      </section>

      {/* Space Section */}
      <section className="relative w-full min-h-screen bg-black text-white">

      </section>
    </div>
  )
}
