'use client'
import React, { useEffect, useRef, useState, useMemo } from 'react'

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
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set())
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
  const mobileHorizontalAmplitude = 140

// --- Optimized path calculation with memoization ---
const pathData = useMemo(() => {
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
}, [isMobile]);

  const { path, points, containerWidth: currentContainerWidth, totalHeight: currentTotalHeight } = pathData

  // Balanced approach: smooth scroll-based progress with milestone visibility
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }
    
    let rafId: number
    
    const updateProgress = () => {
      if (!timelineRef.current) return
      
      const rect = timelineRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height
      
      // Faster, more responsive progress calculation
      const viewportProgress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop + 100) / (windowHeight + elementHeight * 0.7)
      ))
      
      setLineProgress(viewportProgress)
      
      // Update visible milestones with faster threshold
      const newVisibleMilestones = new Set<number>()
      const progressThreshold = viewportProgress * milestones.length * 1.2 // Faster reveal
      
      for (let i = 0; i <= Math.floor(progressThreshold); i++) {
        if (i < milestones.length) {
          newVisibleMilestones.add(i)
        }
      }
      
      setVisibleMilestones(prev => {
        if (prev.size !== newVisibleMilestones.size || 
            ![...prev].every(x => newVisibleMilestones.has(x))) {
          return newVisibleMilestones
        }
        return prev
      })
    }
    
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateProgress)
    }

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768)
      }
    }

    // Header visibility observer
    const headerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsHeaderVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      updateProgress() // Initial calculation
      
      return () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        if (headerRef.current) {
          headerObserver.unobserve(headerRef.current)
        }
      }
    }
  }, [])

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <section id="timeline" className="w-full py-24 px-6">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className={`text-4xl md:text-6xl font-light text-white mb-4 md:mb-6 tracking-tight transition-all duration-800 delay-100 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-95'
          }`}>
            Project Timeline
          </h2>
          <p className={`text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed px-4 md:px-0 transition-all duration-700 delay-200 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}>
            A comprehensive roadmap of our infrastructure monitoring initiative
          </p>
          
          {/* Animated underline */}
          <div className={`mx-auto mt-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-800 delay-300 ease-out ${
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
            style={{ willChange: 'transform' }}
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
              
              {/* Optimized glow effect */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="glow"/>
                <feMerge> 
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
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
            
            {/* Smooth animated path */}
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
                transition: 'none', // No CSS transition, rely on smooth RAF updates
                paintOrder: 'stroke'
              }}
            />
          </svg>

          {/* Milestone nodes */}
          {milestones.map((milestone, index) => {
            const point = points[index]
            const isVisible = visibleMilestones.has(index)
            const isLeft = point.x < currentContainerWidth / 2
            
            return (
              <div
                key={index}
                className="milestone absolute"
                style={{
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Central node */}
                <div className="relative flex items-center justify-center">
                  {/* Faster milestone animations */}
                  <div className={`
                    absolute ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full border-2 transition-all duration-300 ease-out
                    ${isVisible 
                      ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-500/15 to-green-500/15 scale-100' 
                      : 'border-slate-600/40 bg-slate-800/10 scale-90'
                    }
                  `} />
                  
                  {/* Middle ring for depth */}
                  <div className={`
                    absolute ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border transition-all duration-250 ease-out
                    ${isVisible 
                      ? 'border-emerald-300/40 bg-emerald-500/5' 
                      : 'border-slate-700/30 bg-slate-800/5'
                    }
                  `} />
                  
                  {/* Inner core with faster transitions */}
                  <div className={`
                    relative ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full transition-all duration-350 ease-out z-10
                    ${isVisible 
                      ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 shadow-xl shadow-emerald-500/40' 
                      : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }
                  `}>
                    {/* Smooth pulsing effects */}
                    {isVisible && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/30 animate-pulse" style={{ animationDuration: '3s' }} />
                      </>
                    )}
                  </div>

                  {/* Faster text content animations */}
                  <div
                    className={`absolute z-20 transition-all duration-400 ease-out
                      ${isMobile 
                        ? 'left-1/2 -translate-x-1/2 top-12 mt-4 text-center' 
                        : isLeft 
                          ? 'left-10 -translate-x-full pr-6 text-right' 
                          : 'right-10 translate-x-full pl-6 text-left'}
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                      max-w-[280px] md:max-w-[340px] select-none`}
                  >
                    {/* Phase pill */}
                    <span
                      className={`inline-block text-[10px] tracking-widest uppercase font-medium mb-3 px-3 py-1 rounded-full border
                        ${isVisible 
                          ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' 
                          : 'border-slate-600/40 text-slate-400 bg-slate-700/10'}
                        transition-colors duration-500`}
                    >
                      {milestone.phase}
                    </span>
                    {/* Title */}
                    <h3
                      className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} leading-snug mb-2
                        ${isVisible ? 'text-white' : 'text-slate-300'} transition-colors duration-500`}
                    >
                      {milestone.title}
                    </h3>
                    {/* Description */}
                    <p
                      className={`text-slate-400/80 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed backdrop-blur-[1px]
                        ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-100`}
                    >
                      {milestone.description}
                    </p>
                    {/* Faster accent underline */}
                    <span
                      className={`block mt-4 h-px w-16 origin-left bg-gradient-to-r from-emerald-400 via-green-500 to-transparent
                        ${isVisible ? 'scale-x-100 opacity-80' : 'scale-x-0 opacity-0'} transition-all duration-400`}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Simple floating particles */}
          {isClient && Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse"
              style={{
                left: `${(i * 67 + 123) % currentContainerWidth}px`,
                top: `${(i * 89 + 456) % currentTotalHeight}px`,
                animationDelay: `${(i * 0.3) % 4}s`,
                animationDuration: `${3 + (i * 0.2) % 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="h-16" />
      </section>
    </div>
  )
}