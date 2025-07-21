'use client'
import React, { useEffect, useRef, useState } from 'react'

const milestones = [
  { 
    title: 'Training Initiative', 
    description: 'Building AI capabilities through specialized training programs and machine learning frameworks',
    phase: 'Phase 01'
  },
  { 
    title: 'Tower Detection', 
    description: 'Automated identification of transmission towers using computer vision and satellite imagery',
    phase: 'Phase 02'
  },
  { 
    title: 'Early Warning', 
    description: 'Advanced alert system for potential infrastructure issues and predictive maintenance',
    phase: 'Phase 03'
  },
  { 
    title: 'Dashboard', 
    description: 'Centralized monitoring and analytics platform with real-time data visualization',
    phase: 'Phase 04'
  },
  { 
    title: 'Interactive Map', 
    description: 'Geospatial visualization of critical infrastructure with interactive monitoring capabilities',
    phase: 'Phase 05'
  },
]

export default function ProjectTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [visibleMilestones, setVisibleMilestones] = useState<number[]>([])
  const [lineProgress, setLineProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerWidth = 1000
  const verticalSpacing = 400
  const horizontalAmplitude = 250
  const totalHeight = milestones.length * verticalSpacing + 400

  // Responsive dimensions
  const mobileContainerWidth = 350
  const mobileVerticalSpacing = 300
  const mobileHorizontalAmplitude = 80

// --- replace the old getPathData with this ---
const getPathData = () => {
  // Use isMobile state instead of direct window check to avoid SSR mismatch
  const currentContainerWidth = isMobile ? mobileContainerWidth : containerWidth
  const currentVerticalSpacing = isMobile ? mobileVerticalSpacing : verticalSpacing
  const currentHorizontalAmplitude = isMobile ? mobileHorizontalAmplitude : 320
  
  /* ─── 1.  Wave settings ─────────────────────────────── */
  const milestonesPerCycle  = 2;        // 2 milestones = 1 full wave period
  const wavelength          = currentVerticalSpacing * milestonesPerCycle;
  const centreX             = currentContainerWidth / 2;

  /* ─── 2.  Points along the wave ─────────────────────── */
  const points = milestones.map((_, i) => {
    const y = i * currentVerticalSpacing + 250;
    /* keep the first bend direction you already like
       (change “+” to “-” if you want to mirror horizontally) */
    const x = centreX + Math.sin((2 * Math.PI * y) / wavelength)
                       * currentHorizontalAmplitude;
    return { x, y, index: i };
  });

  /* ─── 3.  Build a vertically-flipped “S” Bézier path ── */
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    /* Mid-point between the two nodes (only for Y) */
    const midY = (prev.y + curr.y) / 2;

    /* Control points:
       – cp1 starts at prev.x and is PULLED *upward*  (invert-vertical)
       – cp2 ends at  curr.x and is PULLED *upward*   (invert-vertical)
       Using the same midY for both keeps the curve perfectly rounded. */
    path += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return { 
    path, 
    points, 
    containerWidth: currentContainerWidth,
    totalHeight: milestones.length * currentVerticalSpacing + 400
  };
};

  const { path, points, containerWidth: currentContainerWidth, totalHeight: currentTotalHeight } = getPathData()

  // Generate consistent particles for SSR
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: (i * 67 + 123) % currentContainerWidth, // Deterministic positioning
    top: (i * 89 + 456) % currentTotalHeight,
    delay: (i * 0.3) % 4,
    duration: 3 + (i * 0.2) % 4
  }))

  useEffect(() => {
    setIsClient(true)
    // Check if mobile after hydration
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Handle window resize for responsive updates
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Header animation observer
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
      }
    )

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    // Milestone animation observer
    const milestoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            
            setVisibleMilestones(prev => {
              if (!prev.includes(index)) {
                const newVisible = [...prev, index].sort((a, b) => a - b)
                const maxVisible = Math.max(...newVisible)
                setLineProgress((maxVisible + 1) / milestones.length)
                return newVisible
              }
              return prev
            })
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -200px 0px"
      }
    )

    const milestoneElements = document.querySelectorAll('.milestone')
    milestoneElements.forEach(el => milestoneObserver.observe(el))

    return () => {
      milestoneElements.forEach(el => milestoneObserver.unobserve(el))
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <section id="timeline" className="w-full py-24 px-6">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className={`text-4xl md:text-6xl font-light text-white mb-4 md:mb-6 tracking-tight transition-all duration-1200 delay-200 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-95'
          }`}>
            Project Timeline
          </h2>
          <p className={`text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed px-4 md:px-0 transition-all duration-1000 delay-500 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}>
            A comprehensive roadmap of our infrastructure monitoring initiative
          </p>
          
          {/* Animated underline */}
          <div className={`mx-auto mt-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-1500 delay-700 ease-out ${
            isHeaderVisible 
              ? 'w-32 opacity-60' 
              : 'w-0 opacity-0'
          }`} />
        </div>
        
        <div 
          ref={timelineRef} 
          className="relative mx-auto"
          style={{ 
            width: `${currentContainerWidth}px`,
            height: `${currentTotalHeight}px`,
            maxWidth: '95vw'
          }}
        >
          {/* Enhanced SVG with multiple visual layers */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${currentContainerWidth} ${currentTotalHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Enhanced gradient with green theme colors */}
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="20%" stopColor="#059669" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#047857" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#065f46" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#064e3b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="1" />
              </linearGradient>
              
              {/* Secondary gradient for accents */}
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
              </linearGradient>
              
              {/* Enhanced glow effect for rounder appearance */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feGaussianBlur stdDeviation="4" result="innerGlow"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="innerGlow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Softer shadow */}
              <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.25"/>
              </filter>
            </defs>

            {/* Background decorative path */}
            <path
              d={path}
              stroke="rgba(16, 185, 129, 0.08)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="20,20"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            
            {/* Main animated path with maximum roundedness */}
            <path
              d={path}
              stroke="url(#pathGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3000"
              strokeDashoffset={3000 * (1 - lineProgress)}
              filter="url(#glow)"
              style={{
                transition: 'stroke-dashoffset 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                paintOrder: 'stroke'
              }}
            />
          </svg>

          {/* Milestone nodes */}
          {milestones.map((milestone, index) => {
            const point = points[index]
            const isVisible = visibleMilestones.includes(index)
            const isLeft = point.x < currentContainerWidth / 2
            
            return (
              <div
                key={index}
                data-index={index}
                className="milestone absolute"
                style={{
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Central node */}
                <div className="relative flex items-center justify-center">
                  {/* Outer ring with enhanced styling */}
                  <div className={`
                    absolute ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full border-2 transition-all duration-1200
                    ${isVisible 
                      ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-500/15 to-green-500/15 scale-100' 
                      : 'border-slate-600/40 bg-slate-800/10 scale-90'
                    }
                  `} />
                  
                  {/* Middle ring for depth */}
                  <div className={`
                    absolute ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border transition-all duration-1000
                    ${isVisible 
                      ? 'border-emerald-300/40 bg-emerald-500/5' 
                      : 'border-slate-700/30 bg-slate-800/5'
                    }
                  `} />
                  
                  {/* Inner core with enhanced styling */}
                  <div className={`
                    relative ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full transition-all duration-1200 z-10
                    ${isVisible 
                      ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 shadow-xl shadow-emerald-500/40' 
                      : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }
                  `}>
                    {/* Pulsing effect for active nodes */}
                    {isVisible && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/50 to-green-500/50 animate-pulse" />
                      </>
                    )}
                  </div>

                  {/* Content card */}
                  <div className={`
                    absolute transition-all duration-1000 ease-out z-20
                    ${isMobile 
                      ? 'left-1/2 -translate-x-1/2 top-12 mt-4' 
                      : isLeft ? 'left-12' : 'right-12'
                    }
                    ${isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                    }
                  `}>
                    <div className={`
                      relative  
                      ${isVisible 
                        ? 'border-emerald-500/30 shadow-2xl shadow-emerald-500/10' 
                        : 'border-slate-700/30 shadow-xl shadow-black/20'
                      } 
                      ${isMobile ? 'max-w-xs min-w-[280px]' : 'max-w-sm min-w-[320px]'} 
                      transition-all duration-1000 text-center
                      ${!isMobile && (isLeft ? 'text-left' : 'text-right')}
                       p-6 ${isMobile ? 'md:p-8' : 'p-8'} 
                    `}>
                      {/* Phase indicator with updated colors */}
                      <div className={`
                        inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-medium mb-3 md:mb-4
                        ${isVisible 
                          ? 'bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-green-600/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-slate-700/20 text-slate-400 border border-slate-600/30'
                        }
                        transition-all duration-1000
                      `}>
                        {milestone.phase}
                      </div>
                      
                      {/* Title */}
                      <h3 className={`
                        ${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mb-3 md:mb-4 transition-colors duration-700
                        ${isVisible ? 'text-white' : 'text-slate-300'}
                      `}>
                        {milestone.title}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-slate-400 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {milestone.description}
                      </p>

                      {/* Subtle accent line with improved styling */}
                      <div className={`
                        mt-4 md:mt-6 h-0.5 bg-gradient-to-r transition-all duration-1200
                        ${isMobile 
                          ? 'from-emerald-500 via-green-500 to-emerald-500' 
                          : isLeft 
                            ? 'from-emerald-500 via-green-500 to-transparent' 
                            : 'from-transparent via-green-500 to-emerald-500'
                        }
                        ${isVisible ? 'opacity-70 scale-x-100' : 'opacity-0 scale-x-0'}
                        rounded-full
                      `} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Enhanced floating particles for ambiance */}
          {isClient && particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse"
              style={{
                left: `${particle.left}px`,
                top: `${particle.top}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
        
        <div className="h-16" />
      </section>
    </div>
  )
}