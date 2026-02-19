"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { projects } from "@/data/projects";
import { ChevronUp, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function SolutionsShowcase() {
  const [isClient, setIsClient] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smart preloading: only preload when section is in view
  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Preload next and previous images when section is visible
            const preloadImage = (index: number) => {
              if (imageLoaded[index]) return;
              
              const img = new window.Image();
              img.onload = () => {
                setImageLoaded(prev => ({ ...prev, [index]: true }));
              };
              img.src = projects[index].img;
            };

            // Preload current, next, and previous images
            preloadImage(activeProject);
            
            const nextIndex = activeProject === projects.length - 1 ? 0 : activeProject + 1;
            const prevIndex = activeProject === 0 ? projects.length - 1 : activeProject - 1;
            
            preloadImage(nextIndex);
            preloadImage(prevIndex);
            
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isClient, activeProject, imageLoaded]);

  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Title entrance animation
        const titleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              setIsNavigationVisible(true);
              // Animate navigation in
              if (navigationRef.current) {
                gsap.to(navigationRef.current, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  delay: 0.3,
                  ease: "power2.out",
                });
              }
            },
            onLeave: () => {
              setIsNavigationVisible(false);
              // Animate navigation out
              if (navigationRef.current) {
                gsap.to(navigationRef.current, {
                  opacity: 0,
                  x: 50,
                  duration: 0.3,
                  ease: "power2.in",
                });
              }
              gsap.set([titleRef.current, subtitleRef.current], {
                opacity: 0,
                y: -50,
                scale: 0.8,
              });
            },
            onEnterBack: () => {
              setIsNavigationVisible(true);
              // Animate navigation back in
              if (navigationRef.current) {
                gsap.to(navigationRef.current, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  ease: "power2.out",
                });
              }
              titleTl.restart();
            },
            onLeaveBack: () => {
              setIsNavigationVisible(false);
              // Animate navigation out when leaving back
              if (navigationRef.current) {
                gsap.to(navigationRef.current, {
                  opacity: 0,
                  x: 50,
                  duration: 0.3,
                  ease: "power2.in",
                });
              }
            },
          },
        });

        titleTl
          .fromTo(
            titleRef.current,
            {
              opacity: 0,
              y: 80,
              scale: 0.8,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "power4.out",
            },
          )
          .fromTo(
            subtitleRef.current,
            {
              opacity: 0,
              scaleX: 0,
              transformOrigin: "left",
            },
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.4",
          );

        // Content and image animations
        gsap.fromTo(
          [contentRef.current, imageRef.current],
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              onLeave: () => {
                gsap.set([contentRef.current, imageRef.current], {
                  opacity: 0,
                  y: 60,
                });
              },
              onEnterBack: () => {
                gsap.to([contentRef.current, imageRef.current], {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  ease: "power3.out",
                  stagger: 0.2,
                });
              },
            },
          },
        );

        // Navigation animation - separate from content
        if (navigationRef.current) {
          gsap.set(navigationRef.current, { opacity: 0, x: 50 });
        }
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [isClient]);

  const handleProjectChange = (index: number) => {
    if (index === activeProject) return;

    // Function to ensure image is loaded before proceeding
    const ensureImageLoaded = (imageIndex: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imageLoaded[imageIndex]) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          setImageLoaded(prev => ({ ...prev, [imageIndex]: true }));
          resolve();
        };
        img.onerror = () => {
          // Even if image fails to load, resolve to prevent hanging
          resolve();
        };
        img.src = projects[imageIndex].img;
      });
    };

    // Animate content out
    gsap.to([contentRef.current, imageRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        // Handle async operations without making the callback async
        (async () => {
          // Ensure the target image is loaded before updating state
          await ensureImageLoaded(index);
          
          // Update the project state
          setActiveProject(index);
          
          // Small delay to ensure DOM has updated
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Animate content in
          gsap.to([contentRef.current, imageRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.05, // Slight stagger for smoother appearance
            onComplete: () => {
              // Preload adjacent images after transition
              const nextIndex = index === projects.length - 1 ? 0 : index + 1;
              const prevIndex = index === 0 ? projects.length - 1 : index - 1;
              
              [nextIndex, prevIndex].forEach(preloadIndex => {
                if (!imageLoaded[preloadIndex]) {
                  const img = new window.Image();
                  img.onload = () => {
                    setImageLoaded(prev => ({ ...prev, [preloadIndex]: true }));
                  };
                  img.src = projects[preloadIndex].img;
                }
              });
            },
          });
        })();
      },
    });
  };

  const nextProject = () => {
    const nextIndex =
      activeProject === projects.length - 1 ? 0 : activeProject + 1;
    handleProjectChange(nextIndex);
  };

  const prevProject = () => {
    const prevIndex =
      activeProject === 0 ? projects.length - 1 : activeProject - 1;
    handleProjectChange(prevIndex);
  };

  const scrollToNextSection = () => {
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isClient) {
    return (
      <section className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-[#021400] text-xl">Loading...</div>
      </section>
    );
  }

  const currentProject = projects[activeProject];

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="w-full min-h-screen bg-white relative"
    >
      {/* Header */}
      <div className="pt-20 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left">
            <div className="mb-4 md:mb-6">
              <span
                ref={subtitleRef}
                className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase"
              >
                Our Portfolio
              </span>
            </div>
            <h2
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-extralight text-[#021400] mb-6 md:mb-8 leading-none"
            >
              Featured
              <br />
              <span className="font-light">projects</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 min-h-[60vh] md:min-h-[70vh]">
          {/* Left Side - Content */}
          <div ref={contentRef} className="flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-xl mx-auto lg:mx-0">
              {/* Category */}
              <div className="mb-4 text-center lg:text-left">
                <span className="text-xs font-light tracking-wider uppercase text-gray-600 border border-gray-300 px-3 py-1 inline-block">
                  {currentProject.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#021400] mb-4 md:mb-6 leading-tight tracking-tight text-center lg:text-left">
                {currentProject.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8 font-light text-center lg:text-left">
                {currentProject.description}
              </p>

              {/* Technologies */}
              <div className="mb-6 md:mb-8">
                <h4 className="text-sm font-light text-gray-600 uppercase tracking-wide mb-3 md:mb-4 text-center lg:text-left">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {currentProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-600 font-light border-b border-gray-300 pb-1"
                    >
                      {tech}
                      {index < currentProject.technologies.length - 1 && " •"}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center lg:text-left">
                <button
                  onClick={() => {
                    const encodedFile = encodeURIComponent(currentProject.file);
                    window.open("/pdfs/" + encodedFile, "_blank");
                  }}
                  className="inline-flex items-center gap-3 px-8 py-3 bg-[#021400] text-white hover:bg-[#032200] font-light tracking-wide transition-all duration-300 group btn-soft-curve btn-primary"
                >
                  View Case Study
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div ref={imageRef} className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative rounded-lg md:rounded-none">
                <Image
                  src={currentProject.img}
                  alt={currentProject.title}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:filter hover:scale-105 transition-all duration-700"
                />
              </div>

              {/* Image overlay info - hidden on mobile for cleaner look */}
              <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded md:rounded-none hidden md:block">
                <span className="text-[#021400] text-sm font-light">
                  {currentProject.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {isNavigationVisible && (
        <div
          ref={navigationRef}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300"
        >
          <div className="flex flex-col items-center gap-3 md:gap-4">
            {/* Up Arrow */}
            <button
              onClick={prevProject}
              className="w-10 h-10 md:w-12 md:h-12 border border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-gray-100/50 rounded-full md:rounded-none"
            >
              <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>

            {/* Project Indicators */}
            <div className="flex flex-col gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleProjectChange(index)}
                  className={`w-2 h-6 md:h-8 transition-all duration-300 rounded-full md:rounded-none ${
                    index === activeProject
                      ? "bg-[#021400]"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Down Arrow */}
            <button
              onClick={nextProject}
              className="w-10 h-10 md:w-12 md:h-12 border border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-gray-100/50 rounded-full md:rounded-none"
            >
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Skip to Next Section */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#021400] transition-colors duration-300 group"
        >

        </button>
      </div>
    </section>
  );
}
