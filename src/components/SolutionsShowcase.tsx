"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { projects } from "@/data/projects";
import { ChevronUp, ChevronDown, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function SolutionsShowcase() {
  const [isClient, setIsClient] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    // Animate content out
    gsap.to([contentRef.current, imageRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setActiveProject(index);
        // Animate content in
        gsap.to([contentRef.current, imageRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
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
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left">
            <div className="mb-6">
              <span
                ref={subtitleRef}
                className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase"
              >
                Our Portfolio
              </span>
            </div>
            <h2
              ref={titleRef}
              className="text-6xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none"
            >
              Featured
              <br />
              <span className="font-light">projects</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 min-h-[70vh]">
          {/* Left Side - Content */}
          <div ref={contentRef} className="flex flex-col justify-center">
            <div className="max-w-xl">
              {/* Project Badge */}
              <div className="mb-6">
                <span className="text-sm font-light text-gray-600 tracking-wide">
                  {String(activeProject + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="text-xs font-light tracking-wider uppercase text-gray-600 border border-gray-300 px-3 py-1">
                  {currentProject.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-light text-[#021400] mb-6 leading-tight tracking-tight">
                {currentProject.title}
              </h3>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-light">
                {currentProject.description}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <h4 className="text-sm font-light text-gray-600 uppercase tracking-wide mb-4">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
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
              <button
                onClick={() => {
                  const encodedFile = encodeURIComponent(currentProject.file);
                  window.open("/pdfs/" + encodedFile, "_blank");
                }}
                className="inline-flex items-center gap-3 px-8 py-3 bg-[#021400] text-white hover:bg-[#032200] font-light tracking-wide transition-all duration-300 group"
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

          {/* Right Side - Image */}
          <div ref={imageRef} className="flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                <Image
                  src={currentProject.img}
                  alt={currentProject.title}
                  fill
                  className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Image overlay info */}
              <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2">
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
          className="fixed right-8 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Up Arrow */}
            <button
              onClick={prevProject}
              className="w-12 h-12 border border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-gray-100/50"
            >
              <ChevronUp className="w-5 h-5 text-gray-600" />
            </button>

            {/* Project Indicators */}
            <div className="flex flex-col gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleProjectChange(index)}
                  className={`w-2 h-8 transition-all duration-300 ${
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
              className="w-12 h-12 border border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-gray-100/50"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Skip to Next Section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#021400] transition-colors duration-300 group"
        >
          <span className="text-xs font-light tracking-wide">Continue</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>

      {/* Project Counter */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-xs font-light text-gray-500 tracking-wide">
          <span className="text-[#021400]">
            {String(activeProject + 1).padStart(2, "0")}
          </span>
          <span className="mx-2">/</span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Featured Projects</div>
      </div>
    </section>
  );
}
