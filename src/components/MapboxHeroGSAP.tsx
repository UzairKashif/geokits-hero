'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './LenisProvider'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Plus_Jakarta_Sans } from "next/font/google"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Set mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

export default function MapboxHeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const autoRotationRef = useRef<GSAPTween | null>(null)
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

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [0, 0],
      zoom: 0.3,
      bearing: 0,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      logoPosition: 'bottom-right',
      projection: 'globe',
    })

    map.on('load', () => {
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

  // Auto-rotation animation with GSAP
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    const startAutoRotation = () => {
      if (autoRotationRef.current) {
        autoRotationRef.current.kill()
      }

      autoRotationRef.current = gsap.to({}, {
        duration: 60, // 60 seconds for full rotation
        repeat: -1,
        ease: "none",
        onUpdate: function() {
          if (mapRef.current && !isScrolling) {
            const rotation = (this.progress() * 360) % 360
            mapRef.current.setBearing(rotation)
          }
        }
      })
    }

    const stopAutoRotation = () => {
      if (autoRotationRef.current) {
        autoRotationRef.current.pause()
      }
    }

    if (!isScrolling) {
      startAutoRotation()
    } 
    // else {
    //   stopAutoRotation()
    // }

    return () => {
      if (autoRotationRef.current) {
        autoRotationRef.current.kill()
      }
    }
  }, [mapLoaded, isScrolling])

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
        }
      }
    })

    // Map zoom animation
    mapTimeline.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = this.progress()
        const zoom = gsap.utils.interpolate(0.3, 8, progress)
        map.setZoom(zoom)
      }
    })

    // Map rotation animation (only when scrolling)
    mapTimeline.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = this.progress()
        const rotation = gsap.utils.interpolate(0, 360, progress)
        map.setBearing(rotation)
      }
    }, 0) // Start at same time as zoom

    // Map pitch animation
    mapTimeline.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = this.progress()
        let pitch = 0
        if (progress > 0.7) {
          pitch = gsap.utils.interpolate(0, 60, (progress - 0.7) / 0.3)
        }
        map.setPitch(pitch)
      }
    }, 0)

    // Map center animation
    mapTimeline.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = this.progress()
        const startLng = 0
        const startLat = 0
        const endLng = -74.006
        const endLat = 40.7128

        const currentLng = gsap.utils.interpolate(startLng, endLng, progress)
        const currentLat = gsap.utils.interpolate(startLat, endLat, progress)

        map.setCenter([currentLng, currentLat])
      }
    }, 0)

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
        }
      })

      // Phase 1: Main heading visible (0% - 16.5%) - same duration as others
      textTimeline.to(headingRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.165
      })

      // Phase 2: Fade out heading, fade in subtext (16.5% - 25%) - increased transition time
      textTimeline.to(headingRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        filter: "blur(5px)",
        duration: 0.085
      })
      .to(subtextRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.085
      }, "-=0.085")

      // Phase 3: Subtext visible (25% - 41.5%) - same duration as main heading (16.5%)
      textTimeline.to(subtextRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.165
      })

      // Phase 4: Fade out subtext, fade in final text (41.5% - 50%) - increased transition time
      textTimeline.to(subtextRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        filter: "blur(5px)",
        duration: 0.085
      })
      .to(finalTextRef.current, {
        opacity: 1,
        y: -10,
        scale: 1.02,
        filter: "blur(0px)",
        duration: 0.085
      }, "-=0.085")

      // Phase 5: Final text visible (50% - 66.5%) - same duration as others (16.5%)
      textTimeline.to(finalTextRef.current, {
        opacity: 1,
        y: -10,
        scale: 1.02,
        filter: "blur(0px)",
        duration: 0.165
      })

      // Phase 6: Final fade out (66.5% - 75%) - smooth exit
      textTimeline.to(finalTextRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        filter: "blur(3px)",
        duration: 0.085
      })

      // Phase 7: Empty space for map focus (75% - 100%)
      textTimeline.to({}, {
        duration: 0.25
      })
    }

    if (scrollIndicatorRef.current) {
      // Fade out scroll indicator early to avoid conflicts
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "15% top", // Fade out earlier
          scrub: 1,
        }
      })
      .to(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 1
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
        ease: "power2.out"
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [mapLoaded])

  // Scroll detection
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimer)
      
      scrollTimer = setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="relative h-[300vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Mapbox Container */}
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

          {/* Text Container - Single container to prevent overlapping */}
          <div
            ref={textContainerRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
          >
            {/* Main Heading */}
            <div ref={headingRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max">
              <h1 className={`${plusJakartaSans.className} text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-8 drop-shadow-2xl whitespace-nowrap`}>
                Need a go-to solution for all <div className='text-[#32de84] inline'>GIS</div> problems?
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                Experience the world through geospatial intelligence
              </p>
            </div>

            {/* Mid-scroll content */}
            <div ref={subtextRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl whitespace-nowrap">
                Explore Our Data
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
                From satellite imagery to street-level detail, we provide comprehensive geospatial solutions
              </p>
            </div>

            {/* Final content */}
            <div ref={finalTextRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl whitespace-nowrap">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                Explore our portfolio of projects that combine spatial intelligence, system design and data infrastructure
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 pointer-events-none"
          >
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>

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
      
      <CompanyDescriptionSection />
    </>
  )
}

function CompanyDescriptionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animatedWordRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);
  const [wordAnimationIndex, setWordAnimationIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const scrollLockActiveRef = useRef(false);
  const lastScrollTimeRef = useRef(0);

  const words = ['learn', 'understand', 'deliver'];

  const toggleScrollLock = useCallback((lock: boolean) => {
    if (!lenis) return;

    if (lock && !scrollLockActiveRef.current) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
      scrollLockActiveRef.current = true;
      console.log("Scroll locked");
    } else if (!lock && scrollLockActiveRef.current) {
      lenis.start();
      document.body.style.overflow = '';
      scrollLockActiveRef.current = false;
      console.log("Scroll unlocked");
    }
  }, [lenis]);

  const startEntranceAnimations = useCallback(() => {
    if (entranceAnimationDone) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setEntranceAnimationDone(true);
        console.log("Entrance animation complete, ready for word cycling.");
      }
    });

    // Slow down entrance animations by 4 times
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1 * 4, // Was 1, now 4 seconds
      ease: "power2.out"
    })
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8 * 4, // Was 0.8, now 3.2 seconds
      ease: "power2.out"
    }, "-=1.5"); // Adjusted overlap to match new durations
  }, [entranceAnimationDone]);

  const changeWordAnimation = useCallback((targetIndex: number) => {
    if (!animatedWordRef.current || targetIndex === wordAnimationIndex) return;

    gsap.to(animatedWordRef.current, {
      opacity: 0,
      scale: 0.8,
      y: -10,
      duration: 0.3 * 4, // Was 0.3, now 1.2 seconds
      ease: "power2.out",
      onComplete: () => {
        if (animatedWordRef.current) {
          animatedWordRef.current.textContent = words[targetIndex];
          gsap.to(animatedWordRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4 * 4, // Was 0.4, now 1.6 seconds
            ease: "power2.out"
          });
        }
      }
    });
    setWordAnimationIndex(targetIndex);

    if (targetIndex === words.length - 1) {
      setIsAnimationComplete(true);
      toggleScrollLock(false);
      console.log("Word animation complete. Scroll re-enabled.");
    }
  }, [wordAnimationIndex, words, toggleScrollLock]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
            if (!hasEnteredViewport) {
              setHasEnteredViewport(true);
              console.log("Section entered viewport fully.");
              startEntranceAnimations();
            }
          } else if (!entry.isIntersecting && hasEnteredViewport && isAnimationComplete) {
            setHasEnteredViewport(false);
            console.log("Section left viewport (animation complete).");
          }
        });
      },
      {
        threshold: [0, 0.95, 1.0],
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasEnteredViewport, isAnimationComplete, startEntranceAnimations]);

  useEffect(() => {
    if (!entranceAnimationDone || isAnimationComplete) {
      toggleScrollLock(false);
      return;
    }

    if (animatedWordRef.current) {
        gsap.set(animatedWordRef.current, { opacity: 1 });
        animatedWordRef.current.textContent = words[0];
    }
    
    toggleScrollLock(true);
    console.log("Wheel listener active, scroll locked for word animation.");

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      const SCROLL_DEBOUNCE_TIME = 200 * 4; // Was 200ms, now 800ms
      
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_TIME) {
        return;
      }

      lastScrollTimeRef.current = now;

      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      let nextIndex = wordAnimationIndex + scrollDirection;
      nextIndex = Math.max(0, Math.min(words.length - 1, nextIndex));

      if (nextIndex !== wordAnimationIndex) {
        changeWordAnimation(nextIndex);
      }
    };

    const wheelOptions = { passive: false, capture: true };
    window.addEventListener('wheel', handleWheel, wheelOptions);

    return () => {
      window.removeEventListener('wheel', handleWheel, wheelOptions);
      toggleScrollLock(false);
      console.log("Wheel listener removed, scroll unlocked on cleanup.");
    };
  }, [entranceAnimationDone, isAnimationComplete, wordAnimationIndex, words, changeWordAnimation, toggleScrollLock]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full"
    >
      <div
        ref={sectionRef}
        className="relative h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,222,132,0.1),transparent_50%)]" />
        </div>

        <div className="mb-12">
          <img
            ref={logoRef}
            src="/eng-trans-black.png"
            alt="Geokits Logo"
            className="h-16 md:h-20 lg:h-24 w-auto filter invert"
          />
        </div>

        <div
          ref={textRef}
          className="text-center px-4"
        >
          <h2 className={`${plusJakartaSans.className} text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8`}>
            At geokits, we{' '}
            <span
              ref={animatedWordRef}
              className="text-[#32de84] inline-block min-w-[200px] text-left"
              style={{ fontFamily: 'inherit' }}
            >
              {/* Initial text will be set by GSAP/useEffect */}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Through continuous innovation and deep understanding of geospatial challenges,
            we deliver cutting-edge solutions that transform how you interact with spatial data.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">
              {!isAnimationComplete ? 'Scroll to explore' : 'Continue scrolling'}
            </span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-bounce" />
            </div>
            {hasEnteredViewport && !isAnimationComplete && (
              <div className="w-20 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-[#32de84] transition-all duration-300 ease-out"
                  style={{ width: `${((wordAnimationIndex + 1) / words.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}