  "use client"
  import { useRef, useEffect, useState, useCallback } from "react"
  import mapboxgl from "mapbox-gl"
  import { gsap } from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"
  import { useLenis } from "./LenisProvider"
  import "mapbox-gl/dist/mapbox-gl.css"
  import { Plus_Jakarta_Sans } from 'next/font/google'


  import CompanyDescriptionSection from "./misc"
  import type { GSAPTween } from "gsap" // Declare GSAPTween variable
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  const plusJakartaSans = Plus_Jakarta_Sans({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
  })

  // Set mapbox access token
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

  export default function MapboxHeroGSAP() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [mapError, setMapError] = useState<string | null>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const autoRotationRef = useRef<GSAPTween | null>(null)
    const [isStart, setIsStart] = useState(true)
    const lenis = useLenis()

    // Text element refs for GSAP animations - single container approach
    const textContainerRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const subtextRef = useRef<HTMLDivElement>(null)
    const finalTextRef = useRef<HTMLDivElement>(null)
    const scrollIndicatorRef = useRef<HTMLDivElement>(null)

    // Initialize map
    useEffect(() => {
      if (!mapContainerRef.current) return

      // Check WebGL support
      if (!mapboxgl.supported()) {
        console.error("Your browser does not support Mapbox GL JS")
        setMapError("Your browser does not support WebGL. Please update your browser or enable hardware acceleration.")
        return
      }

      // Check for access token
      if (!mapboxgl.accessToken) {
        console.error("Mapbox access token is missing")
        setMapError("Mapbox access token is missing. Please check your environment variables.")
        return
      }

      try {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/satellite-v9",
          center: [0, 0],
          zoom: 0.3,
          bearing: 0,
          pitch: 0,
          interactive: false,
          attributionControl: false,
          logoPosition: "bottom-right",
          projection: "globe",
        })

        map.on("load", () => {
          try {
            map.addLayer({
              id: "overlay",
              type: "background",
              paint: {
                "background-color": "rgba(0, 0, 0, 0.1)",
              },
            })
            setMapLoaded(true)
          } catch (error) {
            console.error("Error adding map layer:", error)
          }
        })

        map.on("error", (e) => {
          console.error("Mapbox error:", e.error)
          setMapError(`Map loading error: ${e.error?.message || "Unknown error"}`)
        })

        mapRef.current = map

        return () => {
          map.remove()
        }
      } catch (error) {
        console.error("Error initializing Mapbox:", error)
        setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }, [])

    // Auto-rotation animation with GSAP
    useEffect(() => {
      if (!mapRef.current || !mapLoaded) return

      const startAutoRotation = () => {
        if (autoRotationRef.current) {
          autoRotationRef.current.kill()
        }
        autoRotationRef.current = gsap.to(
          {},
          {
            duration: 60, // 60 seconds for full rotation
            repeat: -1,
            ease: "none",
            onUpdate: function () {
              if (mapRef.current && !isScrolling) {
                const rotation = (this.progress() * 360) % 360
                mapRef.current.setBearing(rotation)
              }
            },
          },
        )
      }

      if (!isScrolling && isStart) {
        startAutoRotation()
      }

      return () => {
        if (autoRotationRef.current) {
          autoRotationRef.current.kill()
        }
      }
    }, [mapLoaded, isScrolling, isStart])

    // GSAP ScrollTrigger animations
    useEffect(() => {
      if (!mapRef.current || !mapLoaded || !containerRef.current) return

      const map = mapRef.current
      const container = containerRef.current

      // Create timeline for map animations
      const mapTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            // Only set scrolling state when actually scrolling, not just on scroll events
            const velocity = Math.abs(self.getVelocity())
            setIsScrolling(velocity > 0.1)
            setIsStart(false) // Set isStart to false as soon as ScrollTrigger detects any scroll
          },
        },
      })

      // Map zoom animation
      mapTimeline.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            const zoom = gsap.utils.interpolate(0.3, 8, progress)
            map.setZoom(zoom)
          },
        },
      )

      // Map rotation animation (only when scrolling)
      mapTimeline.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            const rotation = gsap.utils.interpolate(0, 360, progress)
            map.setBearing(rotation)
          },
        },
        0,
      ) // Start at same time as zoom

      // Map pitch animation
      mapTimeline.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            let pitch = 0
            if (progress > 0.7) {
              pitch = gsap.utils.interpolate(0, 60, (progress - 0.7) / 0.3)
            }
            map.setPitch(pitch)
          },
        },
        0,
      )

      // Map center animation
      mapTimeline.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            const startLng = 0
            const startLat = 0
            const endLng = -74.006
            const endLat = 40.7128
            const currentLng = gsap.utils.interpolate(startLng, endLng, progress)
            const currentLat = gsap.utils.interpolate(startLat, endLat, progress)
            map.setCenter([currentLng, currentLat])
          },
        },
        0,
      )

      // Single text animation controller
      if (textContainerRef.current && headingRef.current && subtextRef.current && finalTextRef.current) {
        // Set initial states
        gsap.set(headingRef.current, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" })
        gsap.set(subtextRef.current, { opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" })
        gsap.set(finalTextRef.current, { opacity: 0, y: 40, scale: 0.8, filter: "blur(8px)" })

        // Create a single timeline that controls all text transitions
        const textTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })

        // Phase 1: Main heading visible (0% - 16.5%) - same duration as others
        textTimeline.to(headingRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.165,
        })

        // Phase 2: Fade out heading, fade in subtext (16.5% - 25%) - increased transition time
        textTimeline
          .to(headingRef.current, {
            opacity: 0,
            y: -50,
            scale: 0.95,
            filter: "blur(5px)",
            duration: 0.085,
          })
          .to(
            subtextRef.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.085,
            },
            "-=0.085",
          )

        // Phase 3: Subtext visible (25% - 41.5%) - same duration as main heading (16.5%)
        textTimeline.to(subtextRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.165,
        })

        // Phase 4: Fade out subtext, fade in final text (41.5% - 50%) - increased transition time
        textTimeline
          .to(subtextRef.current, {
            opacity: 0,
            y: -30,
            scale: 0.9,
            filter: "blur(5px)",
            duration: 0.085,
          })
          .to(
            finalTextRef.current,
            {
              opacity: 1,
              y: -10,
              scale: 1.02,
              filter: "blur(0px)",
              duration: 0.085,
            },
            "-=0.085",
          )

        // Phase 5: Final text visible (50% - 66.5%) - same duration as others (16.5%)
        textTimeline.to(finalTextRef.current, {
          opacity: 1,
          y: -10,
          scale: 1.02,
          filter: "blur(0px)",
          duration: 0.165,
        })

        // Phase 6: Final fade out (66.5% - 75%) - smooth exit
        textTimeline.to(finalTextRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          filter: "blur(3px)",
          duration: 0.085,
        })

        // Phase 7: Empty space for map focus (75% - 100%)
        textTimeline.to(
          {},
          {
            duration: 0.25,
          },
        )
      }

      if (scrollIndicatorRef.current) {
        // Fade out scroll indicator early to avoid conflicts
        gsap
          .timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "15% top", // Fade out earlier
              scrub: 1,
            },
          })
          .to(scrollIndicatorRef.current, {
            opacity: 0,
            duration: 1,
          })
      }

      // Initial text animation
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        gsap.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
        })
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }, [mapLoaded])

    // Scroll detection
    useEffect(() => {
      let scrollTimer: NodeJS.Timeout

      const handleScroll = () => {
        setIsScrolling(true)
        setIsStart(false) // Set isStart to false as soon as scrolling begins
        clearTimeout(scrollTimer)

        scrollTimer = setTimeout(() => {
          setIsScrolling(false)
        }, 1000)
      }

      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
        clearTimeout(scrollTimer)
      }
    }, [])

    return (
      <>
        <div ref={containerRef} className="relative h-[300vh] bg-gradient-to-b from-black/30 via-transparent to-black/50">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Mapbox Container */}
            <div
              ref={mapContainerRef}
                  className="absolute inset-0 w-full h-full bg-gradient-to-t  from-green-800/30 via-green-400/20 to-yellow-400/30 "
              style={{ filter: "brightness(0.8) contrast(1.2)" }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

            {/* Text Container - Single container to prevent overlapping */}
            <div
              ref={textContainerRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
            >
              {/* Main Heading */}
              <div
                ref={headingRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max"
              >
                <h1
                  className={`${plusJakartaSans.className} text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-8 drop-shadow-2xl whitespace-nowrap`}
                >
                  Need a go-to solution for all <div className="text-[#32de84] inline">GIS</div> problems?
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                  Experience the world through geospatial intelligence
                </p>
              </div>

              {/* Mid-scroll content */}
              <div
                ref={subtextRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl whitespace-nowrap">
                  Explore Our Data
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
                  From satellite imagery to street-level detail, we provide comprehensive geospatial solutions
                </p>
              </div>

              {/* Final content */}
              <div
                ref={finalTextRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max"
              >
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl whitespace-nowrap">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                  Explore our portfolio of projects that combine spatial intelligence, system design and data
                  infrastructure
                </p>
              </div>
            </div>

            {/* Scroll indicator - Hidden */}
            <div
              ref={scrollIndicatorRef}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 pointer-events-none hidden"
            >
              <div className="flex flex-col items-center">
                <span className="text-sm mb-2">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
                </div>
              </div>
            </div>

            {/* Map loading state */}
            {!mapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
                  <p>Loading map...</p>
                </div>
              </div>
            )}

            {/* Map error state */}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-white text-center max-w-md px-4">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold mb-2">Map Loading Error</h3>
                  <p className="text-white/70 mb-4">{mapError}</p>
                  <div className="text-sm text-white/50">
                    <p>Try:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Refreshing the page</li>
                      <li>Enabling hardware acceleration in your browser</li>
                      <li>Updating your browser to the latest version</li>
                      <li>Checking your graphics drivers</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <CompanyDescriptionSection />
      </>
    )
  }
