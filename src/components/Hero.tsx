'use client'
import React, { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Animation timeline - adjusted for better sizing
  const animations = {
    // Globe scale: starts large, stays large, then shrinks to medium (not too small)
    globeScale: useTransform(scrollYProgress, 
      [0, 0.15, 0.35], 
      [2.5, 2.5, 0.8]  // Increased sizes
    ),
    
    // Globe vertical position
    globeY: useTransform(scrollYProgress,
      [0, 0.3, 0.5],
      [0, 0, -50]
    ),
    
    // Background: black -> green gradient
    bgGreen: useTransform(scrollYProgress,
      [0, 0.3, 0.7],
      ['#000000', '#0a3a28', '#0d5a3d']
    ),
    
    // Silhouette: enters from bottom
    silhouetteY: useTransform(scrollYProgress,
      [0, 0.3, 0.6],
      ['100%', '100%', '10%']
    ),
    
    // Main heading
    headingOpacity: useTransform(scrollYProgress,
      [0, 0.3, 0.5],
      [0, 0.3, 1]
    ),
    
    // Subtext
    subtextOpacity: useTransform(scrollYProgress,
      [0, 0.5, 0.7],
      [0, 0, 1]
    ),
    
    // Glow behind silhouette
    glowOpacity: useTransform(scrollYProgress,
      [0, 0.7, 0.9],
      [0, 0, 0.8]
    ),
    
    // Background text behind globe
    bgTextOpacity: useTransform(scrollYProgress,
      [0, 0.5, 0.7],
      [0, 0, 0.15]
    )
  }

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dynamic background */}
        <motion.div 
          className="absolute inset-0"
          style={{ backgroundColor: animations.bgGreen }}
        />
        
        {/* Radial glow effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: animations.glowOpacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] rounded-full bg-green-500/30 blur-[150px]" />
        </motion.div>

        {/* Background descriptive text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-8 pointer-events-none"
          style={{ opacity: animations.bgTextOpacity }}
        >
          <div className="max-w-4xl text-green-300/30 text-sm md:text-base leading-relaxed">
            <p>ENVIRONMENTAL MONITORING • URBAN PLANNING • DISASTER RESPONSE</p>
            <p>INFRASTRUCTURE MAPPING • AGRICULTURAL OPTIMIZATION • CLIMATE ANALYSIS</p>
            <p>NATURAL RESOURCE MANAGEMENT • SMART CITY SOLUTIONS</p>
            <p>GEOSPATIAL INTELLIGENCE • DATA VISUALIZATION • PREDICTIVE MODELING</p>
          </div>
        </motion.div>

        {/* Globe Container - No box, just the globe */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ y: animations.globeY }}
        >
          <Canvas 
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={<LoadingGlobe />}>
              <GlobeScene 
                scaleValue={animations.globeScale}
                scrollProgress={scrollYProgress} 
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Silhouette */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-full pointer-events-none"
          style={{ y: animations.silhouetteY }}
        >
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40vh] h-[70vh] bg-black">
              <img 
                src="/silhouette.png" 
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.style.clipPath = 'ellipse(50% 35% at 50% 65%)'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="absolute top-0 left-0 right-0 pt-20 px-6 text-center pointer-events-none">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
            style={{ opacity: animations.headingOpacity }}
          >
            Your go‑to for all GIS Solutions
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto"
            style={{ opacity: animations.subtextOpacity }}
          >
            Explore our portfolio of projects that combine spatial intelligence,
            system design and data infrastructure to create impactful solutions.
          </motion.p>
        </div>
      </div>
    </div>
  )
}

// Loading state
function LoadingGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#0a3a28" wireframe />
    </mesh>
  )
}

// Globe scene component
function GlobeScene({ scaleValue, scrollProgress }: { scaleValue: any, scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      const scale = scaleValue.get()
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#00ff88" />
      <group ref={groupRef}>
        <EarthGlobe scrollProgress={scrollProgress} />
      </group>
    </>
  )
}

// Earth Globe with realistic texture
function EarthGlobe({ scrollProgress }: { scrollProgress: any }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  
  // Create Earth texture - you can replace this with a real Earth texture URL
  const earthTexture = useMemo(() => {
    // Option 1: Use a public Earth texture (replace with your own)
    // return useLoader(TextureLoader, '/earth-texture.jpg')
    
    // Option 2: Create a styled Earth-like texture procedurally
    const canvas = document.createElement('canvas')
    canvas.width = 4096
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!
    
    // Ocean base
    const oceanGradient = ctx.createLinearGradient(0, 0, 4096, 0)
    oceanGradient.addColorStop(0, '#001f3f')
    oceanGradient.addColorStop(0.5, '#003366')
    oceanGradient.addColorStop(1, '#001f3f')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, 4096, 2048)
    
    // Land masses with more realistic shapes
    ctx.fillStyle = '#228B22'
    
    // Africa
    ctx.beginPath()
    ctx.ellipse(2048, 1200, 300, 400, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Eurasia
    ctx.beginPath()
    ctx.ellipse(2600, 600, 500, 300, -0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Americas
    ctx.beginPath()
    ctx.ellipse(1000, 800, 200, 600, 0.2, 0, Math.PI * 2)
    ctx.fill()
    
    // Australia
    ctx.beginPath()
    ctx.ellipse(3200, 1400, 200, 150, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Add terrain variation
    const gradient = ctx.createRadialGradient(2048, 1024, 0, 2048, 1024, 2048)
    gradient.addColorStop(0, 'rgba(255,255,255,0.05)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 4096, 2048)
    
    // Add subtle grid for GIS feel
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)'
    ctx.lineWidth = 1
    
    // Latitude lines
    for (let i = 0; i <= 2048; i += 128) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(4096, i)
      ctx.stroke()
    }
    
    // Longitude lines
    for (let i = 0; i <= 4096; i += 256) {
      ctx.beginPath()
      const curve = Math.sin((i / 4096) * Math.PI) * 50
      ctx.moveTo(i, 0 - curve)
      ctx.lineTo(i, 2048 + curve)
      ctx.stroke()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])
  
  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Very slow rotation
      meshRef.current.rotation.y += delta * 0.05
      
      // Slight tilt based on scroll
      const progress = scrollProgress.get()
      meshRef.current.rotation.x = progress * 0.15
    }
    
    if (cloudsRef.current) {
      // Clouds rotate slightly faster
      cloudsRef.current.rotation.y += delta * 0.08
    }
  })
  
  return (
    <>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          map={earthTexture}
          bumpScale={0.05}
          specular={new THREE.Color('#010101')}
          shininess={20}
        />
      </mesh>
      
      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial 
          opacity={0.2}
          transparent
          color="#ffffff"
        />
      </mesh>
      
      {/* Atmosphere */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color(0x00ff88) },
            viewVector: { value: new THREE.Vector3() }
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(glowColor, intensity * 0.3);
            }
          `}
        />
      </mesh>
    </>
  )
}