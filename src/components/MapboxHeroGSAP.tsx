// "use client";
// import { useRef, useEffect, useState, useCallback } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useLenis } from "./LenisProvider";

// import { Plus_Jakarta_Sans } from "next/font/google";

// import CompanyDescriptionSection from "./misc";
// // Register ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// const plusJakartaSans = Plus_Jakarta_Sans({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

// // Set mapbox access token
// mapboxgl.accessToken =
//   "pk.eyJ1IjoidXphaXJrYXNoaWYyNyIsImEiOiJjbWJyZG96bHowODZpMnFxdHRhNWo0Mmt2In0.celmSMfpC3VqWJWRSHFnoA";

// export default function MapboxHeroGSAP() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [mapError, setMapError] = useState<string | null>(null);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const autoRotationRef = useRef<gsap.core.Tween | null>(null);
//   const [isStart, setIsStart] = useState(true);
//   const lenis = useLenis();

//   // Text element refs for GSAP animations - single container approach
//   const textContainerRef = useRef<HTMLDivElement>(null);
//   const headingRef = useRef<HTMLDivElement>(null);
//   const subtextRef = useRef<HTMLDivElement>(null);
//   const finalTextRef = useRef<HTMLDivElement>(null);
//   const scrollIndicatorRef = useRef<HTMLDivElement>(null);

//   // Initialize map
//   useEffect(() => {
//     if (!mapContainerRef.current) return;

//     // Check WebGL support
//     if (!mapboxgl.supported()) {
//       console.error("Your browser does not support Mapbox GL JS");
//       setMapError(
//         "Your browser does not support WebGL. Please update your browser or enable hardware acceleration.",
//       );
//       return;
//     }

//     // Check for access token
//     if (!mapboxgl.accessToken) {
//       console.error("Mapbox access token is missing");
//       setMapError(
//         "Mapbox access token is missing. Please check your environment variables.",
//       );
//       return;
//     }

//     try {
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/uzairkashif27/cmeihge9s000n01s8dpym8rdv",
//         center: [0, 0],
//         zoom: 1.5,
//         bearing: 0,
//         pitch: 0,
//         interactive: false,
//         attributionControl: false,
//         logoPosition: "bottom-right",
//         projection: "globe",
//       });

//       map.on("load", () => {
//         try {
//           map.addLayer({
//             id: "overlay",
//             type: "background",
//             paint: {
//               "background-color": "rgba(0, 0, 0, 0.1)",
//             },
//           });
//           setMapLoaded(true);
//         } catch (error) {
//           console.error("Error adding map layer:", error);
//         }
//       });

//       map.on("error", (e) => {
//         console.error("Mapbox error:", e.error);
//         setMapError(
//           `Map loading error: ${e.error?.message || "Unknown error"}`,
//         );
//       });

//       mapRef.current = map;

//       return () => {
//         try {
//           // Only attempt removal if the map still has a container in the DOM
//           const m = mapRef.current;
//           if (m) {
//             const container = m.getContainer?.();
//             const inDom =
//               container && container.parentNode && document.contains(container);
//             if (inDom) {
//               m.remove();
//             } else {
//               // Fallback: attempt removal but swallow DOM detach errors
//               try {
//                 m.remove();
//               } catch {
//                 /* noop */
//               }
//             }
//           }
//         } catch {
//           // Swallow any DOM detach errors during route transitions
//         } finally {
//           mapRef.current = null;
//         }
//       };
//     } catch (error) {
//       console.error("Error initializing Mapbox:", error);
//       setMapError(
//         `Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`,
//       );
//     }
//   }, []);

//   // Auto-rotation animation with GSAP
//   useEffect(() => {
//     if (!mapRef.current || !mapLoaded) return;

//     const startAutoRotation = () => {
//       if (autoRotationRef.current) {
//         autoRotationRef.current.kill();
//       }
//       autoRotationRef.current = gsap.to(
//         {},
//         {
//           duration: 60, // 60 seconds for full rotation
//           repeat: -1,
//           ease: "none",
//           onUpdate: function () {
//             if (mapRef.current && !isScrolling) {
//               const rotation = (this.progress() * 360) % 360;
//               mapRef.current.setBearing(rotation);
//             }
//           },
//         },
//       );
//     };

//     if (!isScrolling && isStart) {
//       startAutoRotation();
//     }

//     return () => {
//       if (autoRotationRef.current) {
//         autoRotationRef.current.kill();
//       }
//     };
//   }, [mapLoaded, isScrolling, isStart]);

//   // GSAP ScrollTrigger animations
//   useEffect(() => {
//     if (!mapRef.current || !mapLoaded || !containerRef.current) return;

//     const map = mapRef.current;
//     const container = containerRef.current;

//     // Create timeline for map animations
//     const mapTimeline = gsap.timeline({
//       scrollTrigger: {
//         trigger: container,
//         start: "top top",
//         end: "bottom top",
//         scrub: 1,
//         onUpdate: (self) => {
//           // Only set scrolling state when actually scrolling, not just on scroll events
//           const velocity = Math.abs(self.getVelocity());
//           setIsScrolling(velocity > 0.1);
//           setIsStart(false); // Set isStart to false as soon as ScrollTrigger detects any scroll
//         },
//       },
//     });

//     // Map zoom animation
//     mapTimeline.to(
//       {},
//       {
//         duration: 1,
//         onUpdate: function () {
//           const progress = this.progress();
//           const zoom = gsap.utils.interpolate(1.5, 8, progress);
//           map.setZoom(zoom);
//         },
//       },
//     );

//     // Map rotation animation (only when scrolling)
//     mapTimeline.to(
//       {},
//       {
//         duration: 1,
//         onUpdate: function () {
//           const progress = this.progress();
//           const rotation = gsap.utils.interpolate(0, 360, progress);
//           map.setBearing(rotation);
//         },
//       },
//       0,
//     ); // Start at same time as zoom

//     // Map pitch animation
//     mapTimeline.to(
//       {},
//       {
//         duration: 1,
//         onUpdate: function () {
//           const progress = this.progress();
//           let pitch = 0;
//           if (progress > 0.7) {
//             pitch = gsap.utils.interpolate(0, 60, (progress - 0.7) / 0.3);
//           }
//           map.setPitch(pitch);
//         },
//       },
//       0,
//     );

//     // Map center animation
//     mapTimeline.to(
//       {},
//       {
//         duration: 1,
//         onUpdate: function () {
//           const progress = this.progress();
//           const startLng = 0;
//           const startLat = 0;
//           const endLng = -74.006;
//           const endLat = 40.7128;
//           const currentLng = gsap.utils.interpolate(startLng, endLng, progress);
//           const currentLat = gsap.utils.interpolate(startLat, endLat, progress);
//           map.setCenter([currentLng, currentLat]);
//         },
//       },
//       0,
//     );

//     // Single text animation controller
//     if (
//       textContainerRef.current &&
//       headingRef.current &&
//       subtextRef.current &&
//       finalTextRef.current
//     ) {
//       // Set initial states
//       gsap.set(headingRef.current, {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         filter: "blur(0px)",
//       });
//       gsap.set(subtextRef.current, {
//         opacity: 0,
//         y: 30,
//         scale: 0.9,
//         filter: "blur(10px)",
//       });
//       gsap.set(finalTextRef.current, {
//         opacity: 0,
//         y: 40,
//         scale: 0.8,
//         filter: "blur(8px)",
//       });

//       // Create a single timeline that controls all text transitions
//       const textTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: container,
//           start: "top top",
//           end: "bottom top",
//           scrub: 1,
//         },
//       });

//       // Phase 1: Main heading visible (0% - 16.5%) - same duration as others
//       textTimeline.to(headingRef.current, {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         filter: "blur(0px)",
//         duration: 0.165,
//       });

//       // Phase 2: Fade out heading, fade in subtext (16.5% - 25%) - increased transition time
//       textTimeline
//         .to(headingRef.current, {
//           opacity: 0,
//           y: -50,
//           scale: 0.95,
//           filter: "blur(5px)",
//           duration: 0.085,
//         })
//         .to(
//           subtextRef.current,
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             filter: "blur(0px)",
//             duration: 0.085,
//           },
//           "-=0.085",
//         );

//       // Phase 3: Subtext visible (25% - 41.5%) - same duration as main heading (16.5%)
//       textTimeline.to(subtextRef.current, {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         filter: "blur(0px)",
//         duration: 0.165,
//       });

//       // Phase 4: Fade out subtext, fade in final text (41.5% - 50%) - increased transition time
//       textTimeline
//         .to(subtextRef.current, {
//           opacity: 0,
//           y: -30,
//           scale: 0.9,
//           filter: "blur(5px)",
//           duration: 0.085,
//         })
//         .to(
//           finalTextRef.current,
//           {
//             opacity: 1,
//             y: -10,
//             scale: 1.02,
//             filter: "blur(0px)",
//             duration: 0.085,
//           },
//           "-=0.085",
//         );

//       // Phase 5: Final text visible (50% - 66.5%) - same duration as others (16.5%)
//       textTimeline.to(finalTextRef.current, {
//         opacity: 1,
//         y: -10,
//         scale: 1.02,
//         filter: "blur(0px)",
//         duration: 0.165,
//       });

//       // Phase 6: Final fade out (66.5% - 75%) - smooth exit
//       textTimeline.to(finalTextRef.current, {
//         opacity: 0,
//         y: -20,
//         scale: 0.95,
//         filter: "blur(3px)",
//         duration: 0.085,
//       });

//       // Phase 7: Empty space for map focus (75% - 100%)
//       textTimeline.to({}, { duration: 0.25 });
//     }

//     if (scrollIndicatorRef.current) {
//       // Fade out scroll indicator early to avoid conflicts
//       gsap
//         .timeline({
//           scrollTrigger: {
//             trigger: container,
//             start: "top top",
//             end: "15% top", // Fade out earlier
//             scrub: 1,
//           },
//         })
//         .to(scrollIndicatorRef.current, { opacity: 0, duration: 1 });
//     }

//     // Initial text animation
//     if (headingRef.current) {
//       gsap.set(headingRef.current, { opacity: 0, y: 30 });
//       gsap.to(headingRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 1,
//         delay: 0.5,
//         ease: "power2.out",
//       });
//     }

//     return () => {
//       try {
//         ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//       } catch {}
//     };
//   }, [mapLoaded]);

//   // Scroll detection
//   useEffect(() => {
//     let scrollTimer: NodeJS.Timeout;

//     const handleScroll = () => {
//       setIsScrolling(true);
//       setIsStart(false); // Set isStart to false as soon as scrolling begins
//       clearTimeout(scrollTimer);

//       scrollTimer = setTimeout(() => {
//         setIsScrolling(false);
//       }, 1000);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearTimeout(scrollTimer);
//     };
//   }, []);

//   return (
//     <>
//       <div ref={containerRef} className="relative h-[300vh] ">
//         <div className="sticky top-0 h-screen w-full overflow-hidden">
//           {/* Mapbox Container */}
//           <div
//             ref={mapContainerRef}
//             className="absolute inset-0 w-full h-full bg-[#021400]"
//             style={{ filter: "brightness(0.8) contrast(1.2)" }}
//           />

//           {/* Dark overlay */}
//           <div className="absolute inset-0 bg-black/40 pointer-events-none" />

//           {/* Text Container - Single container to prevent overlapping */}
//           <div
//             ref={textContainerRef}
//             className="absolute inset-0 flex items-center justify-start pointer-events-none z-10 w-full max-w-6xl px-4 md:px-6 mx-auto"
//           >
//             {/* Main Heading */}
//             <div
//               ref={headingRef}
//               className="absolute inset-0 flex flex-col justify-center w-full"
//             >
//               <div className="mb-6">
//                 <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
//                   Welcome to Geokits
//                 </span>
//               </div>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-6 md:mb-8 leading-tight md:leading-none tracking-tight">
//                 Advanced GIS
//                 <br />
//                 <span className="font-light">made accessible</span>
//               </h1>
//               <p className="text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light">
//                 Experience the world through geospatial intelligence and
//                 innovative system design.
//               </p>
//             </div>

//             {/* Mid-scroll content */}
//             <div
//               ref={subtextRef}
//               className="absolute inset-0 flex flex-col justify-center w-full"
//             >
//               <div className="mb-6">
//                 <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
//                   Global Perspective
//                 </span>
//               </div>
//               <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-6 md:mb-8 leading-tight md:leading-none tracking-tight">
//                 Explore our
//                 <br />
//                 <span className="font-light">spatial data</span>
//               </h2>
//               <p className="text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light">
//                 Discover how spatial intelligence transforms the way we
//                 understand our world.
//               </p>
//             </div>

//             {/* Final content */}
//             <div
//               ref={finalTextRef}
//               className="absolute inset-0 flex flex-col justify-center w-full"
//             >
//               <div className="mb-6">
//                 <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
//                   Next Steps
//                 </span>
//               </div>
//               <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extralight text-white mb-6 md:mb-8 leading-tight md:leading-none tracking-tight">
//                 Ready to get
//                 <br />
//                 <span className="font-light">started?</span>
//               </h2>
//               <p className="text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light">
//                 Transform your infrastructure monitoring with cutting-edge GIS
//                 solutions.
//               </p>
//             </div>
//           </div>

//           {/* Scroll indicator */}
//           <div
//             ref={scrollIndicatorRef}
//             className="absolute bottom-8 left-8 text-white/60 pointer-events-none"
//           >
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-light tracking-wide">
//                 Scroll to explore
//               </span>
//               <div className="w-4 h-4">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1}
//                     d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Map loading state */}
//           {!mapLoaded && !mapError && (
//             <div className="absolute inset-0 flex items-center justify-center bg-[#021400] z-20">
//               <div className="text-white text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b border-white/30 mb-4 mx-auto"></div>
//                 <p className="font-light tracking-wide">Loading map...</p>
//               </div>
//             </div>
//           )}

//           {/* Map error state */}
//           {mapError && (
//             <div className="absolute inset-0 flex items-center justify-center bg-[#021400] z-20">
//               <div className="text-white text-center max-w-md px-4">
//                 <div className="text-gray-400 text-6xl mb-4">⚠️</div>
//                 <h3 className="text-xl font-light mb-2 tracking-tight">
//                   Map Loading Error
//                 </h3>
//                 <p className="text-white/70 mb-4 font-light">{mapError}</p>
//                 <div className="text-sm text-white/50 font-light">
//                   <p>Try:</p>
//                   <ul className="list-disc list-inside mt-2 space-y-1">
//                     <li>Refreshing the page</li>
//                     <li>Enabling hardware acceleration in your browser</li>
//                     <li>Updating your browser to the latest version</li>
//                     <li>Checking your graphics drivers</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <CompanyDescriptionSection />
//     </>
//   );
// }
"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./LenisProvider";

import CompanyDescriptionSection from "./misc";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Set mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoidXphaXJrYXNoaWYyNyIsImEiOiJjbWJyZG96bHowODZpMnFxdHRhNWo0Mmt2In0.celmSMfpC3VqWJWRSHFnoA";

export default function MapboxHeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const autoRotationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isStart, setIsStart] = useState(true);

  // Text element refs for GSAP animations - single container approach
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check WebGL support
    if (!mapboxgl.supported()) {
      console.error("Your browser does not support Mapbox GL JS");
      setMapError(
        "Your browser does not support WebGL. Please update your browser or enable hardware acceleration.",
      );
      return;
    }

    // Check for access token
    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is missing");
      setMapError(
        "Mapbox access token is missing. Please check your environment variables.",
      );
      return;
    }

    // Enhanced mobile detection and performance optimization
    const isMobile = window.innerWidth <= 768;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const initialZoom = isMobile ? 0.3 : 1.5;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/uzairkashif27/cmeihge9s000n01s8dpym8rdv",
        center: [0, 0],
        zoom: initialZoom,
        bearing: 0,
        pitch: 0,
        interactive: false,
        attributionControl: false,
        logoPosition: "bottom-right",
        projection: "globe",
        // Enhanced mobile performance settings
        antialias: !isMobile, // Disable antialiasing on mobile for better performance
        fadeDuration: isMobile ? 150 : 300, // Faster transitions on mobile
        crossSourceCollisions: !isLowEndDevice, // Disable on low-end devices
        // Mobile-specific optimizations
        renderWorldCopies: false, // Disable world copies on mobile
        maxZoom: isMobile ? 10 : 18, // Limit zoom on mobile
        // Reduce tile loading for better performance
        maxTileCacheSize: isMobile ? 50 : 500,
        transformRequest: (url, resourceType) => {
          // Optimize tile requests for mobile
          if (resourceType === 'Tile' && isMobile) {
            return {
              url: url + (url.includes('?') ? '&' : '?') + 'optimize=true'
            };
          }
          return { url };
        }
      });

      map.on("load", () => {
        try {
          // Only add overlay if not on low-end device
          if (!isLowEndDevice) {
            map.addLayer({
              id: "overlay",
              type: "background",
              paint: {
                "background-color": "rgba(0, 0, 0, 0.1)",
              },
            });
          }
          setMapLoaded(true);
        } catch (error) {
          console.error("Error adding map layer:", error);
          setMapLoaded(true); // Still set loaded to prevent infinite loading
        }
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(
          `Map loading error: ${e.error?.message || "Unknown error"}`,
        );
      });

      // Mobile-specific event optimization
      if (isMobile) {
        // Disable map interactions that can cause performance issues
        map.touchZoomRotate.disable();
        map.touchPitch.disable();
        map.dragRotate.disable();
        map.keyboard.disable();
        
        // Add performance monitoring
        let frameCount = 0;
        const performanceCheck = setInterval(() => {
          frameCount++;
          if (frameCount > 60 && map.isMoving()) {
            // If performance is poor, reduce quality
            map.getCanvas().style.willChange = 'auto';
          }
        }, 1000);
        
        map.on('remove', () => clearInterval(performanceCheck));
      }

      mapRef.current = map;

      return () => {
        try {
          // Only attempt removal if the map still has a container in the DOM
          const m = mapRef.current;
          if (m) {
            const container = m.getContainer?.();
            const inDom =
              container && container.parentNode && document.contains(container);
            if (inDom) {
              m.remove();
            } else {
              // Fallback: attempt removal but swallow DOM detach errors
              try {
                m.remove();
              } catch {
                /* noop */
              }
            }
          }
        } catch {
          // Swallow any DOM detach errors during route transitions
        } finally {
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setMapError(
        `Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }, []);

  // Auto-rotation animation with GSAP
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const startAutoRotation = () => {
      if (autoRotationRef.current) {
        autoRotationRef.current.kill();
      }
      autoRotationRef.current = gsap.to(
        {},
        {
          duration: 60, // 60 seconds for full rotation
          repeat: -1,
          ease: "none",
          onUpdate: function () {
            if (mapRef.current && !isScrolling) {
              const rotation = (this.progress() * 360) % 360;
              mapRef.current.setBearing(rotation);
            }
          },
        },
      );
    };

    if (!isScrolling && isStart) {
      startAutoRotation();
    }

    return () => {
      if (autoRotationRef.current) {
        autoRotationRef.current.kill();
      }
    };
  }, [mapLoaded, isScrolling, isStart]);

  // GSAP ScrollTrigger animations with performance optimizations
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !containerRef.current) return;

    const map = mapRef.current;
    const container = containerRef.current;

    // Detect mobile for performance optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Reduce scroll triggers on mobile to prevent jitter
    if (isMobile) {
      // Simplified mobile experience - no complex scroll animations
      const handleScroll = () => {
        setIsStart(false);
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }

    // Desktop version with optimized scroll triggers
    const mapTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1, // Lower priority to reduce conflicts
        onUpdate: (self) => {
          // Throttle scroll updates for better performance
          const velocity = Math.abs(self.getVelocity());
          if (velocity > 0.05) { // Increased threshold
            setIsScrolling(true);
            setIsStart(false);
          }
        },
      },
    });

    // Improved map zoom animation with easing for smoother transitions
    mapTimeline.to(
      {},
      {
        duration: 1,
        ease: "power2.out", // Add easing for smoother zoom
        onUpdate: function () {
          const progress = this.progress();
          // Use exponential interpolation for smoother zoom transitions
          // Detect mobile screen size for dynamic zoom values
          const isMobile = window.innerWidth <= 768;
          const startZoom = isMobile ? 0.3 : 1.5;
          const endZoom = 8;
          const zoom = startZoom * Math.pow(endZoom / startZoom, progress);
          
          try {
            map.setZoom(zoom);
          } catch (error) {
            // Silently handle any map errors during animation
            console.warn('Map zoom error:', error);
          }
        },
      },
    );

    // Map rotation animation with smoother easing
    mapTimeline.to(
      {},
      {
        duration: 1,
        ease: "power1.inOut", // Smoother rotation easing
        onUpdate: function () {
          const progress = this.progress();
          const rotation = gsap.utils.interpolate(0, 360, progress);
          try {
            map.setBearing(rotation);
          } catch (error) {
            console.warn('Map bearing error:', error);
          }
        },
      },
      0,
    ); // Start at same time as zoom

    // Map pitch animation with easing
    mapTimeline.to(
      {},
      {
        duration: 1,
        ease: "power2.out",
        onUpdate: function () {
          const progress = this.progress();
          let pitch = 0;
          if (progress > 0.7) {
            // Use smoother easing for pitch transition
            const pitchProgress = (progress - 0.7) / 0.3;
            pitch = gsap.utils.interpolate(0, 60, gsap.parseEase("power2.out")(pitchProgress));
          }
          try {
            map.setPitch(pitch);
          } catch (error) {
            console.warn('Map pitch error:', error);
          }
        },
      },
      0,
    );

    // Map center animation with easing
    mapTimeline.to(
      {},
      {
        duration: 1,
        ease: "power2.inOut",
        onUpdate: function () {
          const progress = this.progress();
          const startLng = 0;
          const startLat = 0;
          const endLng = -74.006;
          const endLat = 40.7128;
          const currentLng = gsap.utils.interpolate(startLng, endLng, progress);
          const currentLat = gsap.utils.interpolate(startLat, endLat, progress);
          try {
            map.setCenter([currentLng, currentLat]);
          } catch (error) {
            console.warn('Map center error:', error);
          }
        },
      },
      0,
    );

    // Single text animation controller
    if (
      textContainerRef.current &&
      headingRef.current &&
      subtextRef.current &&
      finalTextRef.current
    ) {
      // Set initial states
      gsap.set(headingRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      gsap.set(subtextRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.9,
        filter: "blur(10px)",
      });
      gsap.set(finalTextRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.8,
        filter: "blur(8px)",
      });

      // Create a single timeline that controls all text transitions
      const textTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Phase 1: Main heading visible (0% - 16.5%) - same duration as others
      textTimeline.to(headingRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.165,
      });

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
        );

      // Phase 3: Subtext visible (25% - 41.5%) - same duration as main heading (16.5%)
      textTimeline.to(subtextRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.165,
      });

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
        );

      // Phase 5: Final text visible (50% - 66.5%) - same duration as others (16.5%)
      textTimeline.to(finalTextRef.current, {
        opacity: 1,
        y: -10,
        scale: 1.02,
        filter: "blur(0px)",
        duration: 0.165,
      });

      // Phase 6: Final fade out (66.5% - 75%) - smooth exit
      textTimeline.to(finalTextRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        filter: "blur(3px)",
        duration: 0.085,
      });

      // Phase 7: Empty space for map focus (75% - 100%)
      textTimeline.to({}, { duration: 0.25 });
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
        .to(scrollIndicatorRef.current, { opacity: 0, duration: 1 });
    }

    // Initial text animation
    if (headingRef.current) {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });
    }

    return () => {
      try {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      } catch {}
    };
  }, [mapLoaded]);

  // Scroll detection
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      setIsStart(false); // Set isStart to false as soon as scrolling begins
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Mapbox Container */}
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full bg-[#021400]"
            style={{ filter: "brightness(0.8) contrast(1.2)" }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Text Container - Fixed alignment for mobile */}
          <div
            ref={textContainerRef}
            className="absolute inset-0 flex items-center justify-center sm:justify-start pointer-events-none z-10 w-full max-w-6xl px-4 sm:px-6 mx-auto"
          >
            {/* Main Heading */}
            <div
              ref={headingRef}
              className="absolute inset-0 flex flex-col justify-center w-full text-center sm:text-left"
            >
              <div className="mb-4 sm:mb-6">
                <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
                  Welcome to Geokits
                </span>
              </div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2 sm:px-0">
                Advanced GIS
                <br />
                <span className="font-light">made accessible</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light mx-auto sm:mx-0 px-2 sm:px-0">
                Experience the world through geospatial intelligence and
                innovative system design.
              </p>
            </div>

            {/* Mid-scroll content */}
            <div
              ref={subtextRef}
              className="absolute inset-0 flex flex-col justify-center w-full text-center sm:text-left"
            >
              <div className="mb-4 sm:mb-6">
                <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
                  Global Perspective
                </span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2 sm:px-0">
                Explore our
                <br />
                <span className="font-light">spatial data</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light mx-auto sm:mx-0 px-2 sm:px-0">
                Discover how spatial intelligence transforms the way we
                understand our world.
              </p>
            </div>

            {/* Final content */}
            <div
              ref={finalTextRef}
              className="absolute inset-0 flex flex-col justify-center w-full text-center sm:text-left"
            >
              <div className="mb-4 sm:mb-6">
                <span className="text-xs font-light tracking-[0.2em] text-white/70 uppercase">
                  Next Steps
                </span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extralight text-white mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2 sm:px-0">
                Ready to get
                <br />
                <span className="font-light">started?</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-sm md:max-w-xl leading-relaxed tracking-wide font-light mx-auto sm:mx-0 px-2 sm:px-0">
                Transform your infrastructure monitoring with cutting-edge GIS
                solutions.
              </p>
            </div>
          </div>

          {/* Scroll indicator - Hidden on mobile to prevent overlap */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-4 sm:left-8 text-white/60 pointer-events-none hidden sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-light tracking-wide">
                Scroll to explore
              </span>
              <div className="w-4 h-4">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Map loading state */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#021400] z-20">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b border-white/30 mb-4 mx-auto"></div>
                <p className="font-light tracking-wide">Loading map...</p>
              </div>
            </div>
          )}

          {/* Map error state */}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#021400] z-20">
              <div className="text-white text-center max-w-md px-4">
                <div className="text-gray-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-light mb-2 tracking-tight">
                  Map Loading Error
                </h3>
                <p className="text-white/70 mb-4 font-light">{mapError}</p>
                <div className="text-sm text-white/50 font-light">
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
  );
}