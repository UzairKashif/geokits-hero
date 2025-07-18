'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLenis } from './LenisProvider'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export default function MapboxHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const lenis = useLenis()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Animation values for scroll-based zoom
  const zoomValue = useTransform(scrollYProgress, [0, 1], [0.3, 8]) // From globe view to street level
  const rotationValue = useTransform(scrollYProgress, [0, 1], [0, 360])
  const pitchValue = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 60])

  // Text animations with enhanced transitions
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0])
  const headingScale = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1.05, 0.95])
  const headingY = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, -20, -50])
  
  const subtextOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0])
  const subtextScale = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0.9, 1, 1, 0.9])
  const subtextY = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [30, 0, 0, -30])
  
  const finalTextOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1])
  const finalTextScale = useTransform(scrollYProgress, [0.7, 0.85, 1], [0.8, 1, 1.02])
  const finalTextY = useTransform(scrollYProgress, [0.7, 0.85, 1], [40, 0, -10])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [0, 0], // Start centered on the globe
      zoom: 0.3, // Lower zoom for more globe-like appearance
      bearing: 0,
      pitch: 0,
      interactive: false, // Disable default interactions
      attributionControl: false,
      logoPosition: 'bottom-right',
      projection: 'globe', // Use globe projection for true globe appearance
    })

    // Add subtle styling
    map.on('load', () => {
      // Add a subtle overlay to make text more readable
      map.addLayer({
        id: 'overlay',
        type: 'background',
        paint: {
          'background-color': 'rgba(0, 0, 0, 0.2)',
        },
      })
      
      setMapLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  // Handle scroll-based animations
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    const unsubscribeZoom = zoomValue.on('change', (zoom) => {
      mapRef.current?.setZoom(zoom)
    })

    const unsubscribeRotation = rotationValue.on('change', (rotation) => {
      mapRef.current?.setBearing(rotation)
    })

    const unsubscribePitch = pitchValue.on('change', (pitch) => {
      mapRef.current?.setPitch(pitch)
    })

    return () => {
      unsubscribeZoom()
      unsubscribeRotation()
      unsubscribePitch()
    }
  }, [mapLoaded, zoomValue, rotationValue, pitchValue])

  // Handle center point changes as we zoom in
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    const unsubscribeScroll = scrollYProgress.on('change', (progress) => {
      const map = mapRef.current
      if (!map) return

      // Smoothly transition from global view to a specific location
      // You can change these coordinates to focus on any location
      const startLng = 0
      const startLat = 0 // Start from equator for better globe view
      const endLng = -74.006 // Example: New York
      const endLat = 40.7128

      const currentLng = startLng + (endLng - startLng) * progress
      const currentLat = startLat + (endLat - startLat) * progress

      map.setCenter([currentLng, currentLat])
    })

    return () => {
      unsubscribeScroll()
    }
  }, [mapLoaded, scrollYProgress])

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Mapbox Container */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'brightness(0.8) contrast(1.2)' }}
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

        {/* Main Heading - Visible at the start */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
          style={{ 
            opacity: headingOpacity,
            scale: headingScale,
            y: headingY
          }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            Your go‑to for all GIS Solutions
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            Experience the world through geospatial intelligence
          </motion.p>
        </motion.div>

        {/* Mid-scroll content */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
          style={{ 
            opacity: subtextOpacity,
            scale: subtextScale,
            y: subtextY
          }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl"
            style={{ 
              filter: useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [
                "blur(10px)", "blur(0px)", "blur(0px)", "blur(5px)"
              ])
            }}
          >
            Explore Our Data
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg"
            style={{ 
              filter: useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [
                "blur(8px)", "blur(0px)", "blur(0px)", "blur(4px)"
              ])
            }}
          >
            From satellite imagery to street-level detail, we provide comprehensive geospatial solutions
          </motion.p>
        </motion.div>

        {/* Final content - Visible at the end */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10"
          style={{ 
            opacity: finalTextOpacity,
            scale: finalTextScale,
            y: finalTextY
          }}
        >
          <motion.h2 
            className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl"
            style={{ 
              filter: useTransform(scrollYProgress, [0.7, 0.85, 1], [
                "blur(8px)", "blur(0px)", "blur(0px)"
              ])
            }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg"
            style={{ 
              filter: useTransform(scrollYProgress, [0.7, 0.85, 1], [
                "blur(6px)", "blur(0px)", "blur(0px)"
              ])
            }}
          >
            Explore our portfolio of projects that combine spatial intelligence, system design and data infrastructure
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>

        {/* Map loading state */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
              <p>Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
