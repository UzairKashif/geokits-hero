"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";

const milestones = [
  {
    title: "Training Initiative",
    description:
      "Building AI capabilities through specialized training programs and machine learning frameworks",
    phase: "Phase 01",
  },
  {
    title: "Tower Detection",
    description:
      "Automated identification of transmission towers using computer vision and satellite imagery",
    phase: "Phase 02",
  },
  {
    title: "Early Warning",
    description:
      "Advanced alert system for potential infrastructure issues and predictive maintenance",
    phase: "Phase 03",
  },
  {
    title: "Dashboard",
    description:
      "Centralized monitoring and analytics platform with real-time data visualization",
    phase: "Phase 04",
  },
  {
    title: "Interactive Map",
    description:
      "Geospatial visualization of critical infrastructure with interactive monitoring capabilities",
    phase: "Phase 05",
  },
];

export default function ProjectTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(
    new Set(),
  );
  const [lineProgress, setLineProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerWidth = 1000;
  const verticalSpacing = 400;
  const horizontalAmplitude = 250;
  const totalHeight = milestones.length * verticalSpacing + 400;

  // Responsive dimensions
  const mobileContainerWidth = 350;
  const mobileVerticalSpacing = 300;
  const mobileHorizontalAmplitude = 140;

  // --- Optimized path calculation with memoization ---
  const pathData = useMemo(() => {
    // Use isMobile state instead of direct window check to avoid SSR mismatch
    const currentContainerWidth = isMobile
      ? mobileContainerWidth
      : containerWidth;
    const currentVerticalSpacing = isMobile
      ? mobileVerticalSpacing
      : verticalSpacing;
    const currentHorizontalAmplitude = isMobile
      ? mobileHorizontalAmplitude
      : 320;

    /* ─── 1.  Wave settings ─────────────────────────────── */
    const milestonesPerCycle = 2; // 2 milestones = 1 full wave period
    const wavelength = currentVerticalSpacing * milestonesPerCycle;
    const centreX = currentContainerWidth / 2;

    /* ─── 2.  Points along the wave ─────────────────────── */
    const points = milestones.map((_, i) => {
      const y = i * currentVerticalSpacing + 250;
      /* keep the first bend direction you already like
       (change "+" to "-" if you want to mirror horizontally) */
      const x =
        centreX +
        Math.sin((2 * Math.PI * y) / wavelength) * currentHorizontalAmplitude;
      return { x, y, index: i };
    });

    /* ─── 3.  Build a vertically-flipped "S" Bézier path ── */
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
      totalHeight: milestones.length * currentVerticalSpacing + 400,
    };
  }, [isMobile]);

  const {
    path,
    points,
    containerWidth: currentContainerWidth,
    totalHeight: currentTotalHeight,
  } = pathData;

  // Fixed scroll-based progress with better visibility thresholds
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }

    let rafId: number;

    const updateProgress = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // More conservative progress calculation - starts animation only when section is well into view
      // On mobile, we need even more conservative thresholds
      const startThreshold = isMobile ? windowHeight * 0.4 : windowHeight * 0.3;
      const endThreshold = isMobile ? windowHeight * 0.8 : windowHeight * 0.7;

      // Only start animating when the timeline section is significantly visible
      const adjustedTop = elementTop + startThreshold;
      const viewportProgress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - adjustedTop) /
            (windowHeight + elementHeight - endThreshold),
        ),
      );

      setLineProgress(viewportProgress);

      // Much more conservative milestone visibility - each milestone needs to be clearly in view
      const newVisibleMilestones = new Set<number>();

      points.forEach((point, index) => {
        const milestoneScreenY = rect.top + point.y;
        const milestoneFromTop = milestoneScreenY;
        const milestoneFromBottom = windowHeight - milestoneScreenY;

        // Milestone becomes visible only when it's well within the viewport
        // More conservative thresholds especially for mobile
        const topBuffer = isMobile ? windowHeight * 0.25 : windowHeight * 0.2;
        const bottomBuffer = isMobile
          ? windowHeight * 0.15
          : windowHeight * 0.1;

        if (
          milestoneFromTop < windowHeight - topBuffer &&
          milestoneFromBottom > bottomBuffer
        ) {
          newVisibleMilestones.add(index);
        }
      });

      setVisibleMilestones((prev) => {
        if (
          prev.size !== newVisibleMilestones.size ||
          ![...prev].every((x) => newVisibleMilestones.has(x))
        ) {
          return newVisibleMilestones;
        }
        return prev;
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    // Header visibility observer with more conservative threshold for mobile
    const headerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsHeaderVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: isMobile ? "0px 0px -20% 0px" : "0px 0px -10% 0px",
      },
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);
      updateProgress(); // Initial calculation

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        if (headerRef.current) {
          headerObserver.unobserve(headerRef.current);
        }
      };
    }
  }, [isMobile, points]); // Added dependencies

  return (
    <div className="w-full forest-bg overflow-hidden">
      <section id="timeline" className="w-full py-40 px-6">
        <div
          ref={headerRef}
          className={`text-left max-w-6xl mx-auto mb-24 transition-all duration-700 ease-out ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Development Roadmap
            </span>
          </div>
          <h2
            className={`text-6xl md:text-7xl font-extralight text-white mb-8 leading-none transition-all duration-800 delay-100 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            Project
            <br />
            <span className="font-light">timeline</span>
          </h2>
          <p
            className={`text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide transition-all duration-700 delay-200 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            A comprehensive roadmap of our infrastructure monitoring initiative
            and development phases.
          </p>
        </div>

        <div
          ref={timelineRef}
          className="relative mx-auto"
          style={{
            width: `${currentContainerWidth}px`,
            height: `${currentTotalHeight}px`,
            maxWidth: "95vw",
          }}
        >
          {/* Clean SVG path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${currentContainerWidth} ${currentTotalHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ willChange: "transform" }}
          >
            {/* Background path */}
            <path
              d={path}
              stroke="rgba(75, 85, 99, 0.2)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />

            {/* Animated progress path */}
            <path
              d={path}
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3000"
              strokeDashoffset={3000 * (1 - lineProgress)}
              style={{
                transition: "none",
              }}
            />
          </svg>

          {/* Milestone nodes */}
          {milestones.map((milestone, index) => {
            const point = points[index];
            const isVisible = visibleMilestones.has(index);
            const isLeft = point.x < currentContainerWidth / 2;

            return (
              <div
                key={index}
                className="milestone absolute"
                style={{
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Central node */}
                <div className="relative flex items-center justify-center">
                  {/* Outer ring */}
                  <div
                    className={`
                    absolute ${isMobile ? "w-16 h-16" : "w-20 h-20"} rounded-full border transition-all duration-500 ease-out
                    ${
                      isVisible
                        ? "border-gray-500 bg-gray-800 scale-100"
                        : "border-gray-700 bg-gray-900 scale-90"
                    }
                  `}
                  />

                  {/* Inner core */}
                  <div
                    className={`
                    relative ${isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-full transition-all duration-600 ease-out z-10
                    ${isVisible ? "bg-white" : "bg-gray-600"}
                  `}
                  >
                    {/* Phase number */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-xs font-light tracking-wide transition-colors duration-500 ${
                        isVisible ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Text content with improved visual balance */}
                  <div
                    className={`absolute z-20 transition-all duration-600 ease-out
                      ${
                        isMobile
                          ? "left-1/2 -translate-x-1/2 top-16 mt-2 text-center"
                          : isLeft
                            ? "left-12 -translate-x-full pr-4 text-right"
                            : "right-12 translate-x-full pl-4 text-left"
                      }
                      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                      max-w-[240px] md:max-w-[280px] select-none`}
                    style={{
                      transitionDelay: isVisible
                        ? `${index * 0.1 + 0.2}s`
                        : "0s",
                    }}
                  >
                    {/* Minimal content container */}
                    <div
                      className={`
                      ${isVisible ? "bg-gray-800/50 border-gray-700" : "bg-gray-900/30 border-gray-800"}
                      border backdrop-blur-sm p-4 transition-all duration-500
                    `}
                      style={{
                        transitionDelay: isVisible
                          ? `${index * 0.1 + 0.3}s`
                          : "0s",
                      }}
                    >
                      {/* Phase and title in one line */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`
                          text-xs tracking-wider uppercase font-light px-2 py-1 border
                          ${isVisible ? "border-gray-600 text-gray-400 bg-gray-700/50" : "border-gray-700 text-gray-500 bg-gray-800/50"}
                          transition-all duration-500
                        `}
                        >
                          {milestone.phase}
                        </span>
                        <div
                          className={`h-px flex-1 ${isVisible ? "bg-gray-600" : "bg-gray-700"} transition-colors duration-500`}
                        />
                      </div>

                      {/* Compact title */}
                      <h3
                        className={`font-light ${isMobile ? "text-base" : "text-lg"} leading-tight mb-2 tracking-tight
                          ${isVisible ? "text-white" : "text-gray-400"} transition-all duration-500`}
                        style={{
                          transitionDelay: isVisible
                            ? `${index * 0.1 + 0.4}s`
                            : "0s",
                        }}
                      >
                        {milestone.title}
                      </h3>

                      {/* Condensed description */}
                      <p
                        className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"} leading-snug font-light tracking-normal line-clamp-2
                          ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
                        style={{
                          transitionDelay: isVisible
                            ? `${index * 0.1 + 0.6}s`
                            : "0s",
                        }}
                      >
                        {milestone.description
                          .split(" ")
                          .slice(0, 12)
                          .join(" ")}
                        {milestone.description.split(" ").length > 12 && "..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-16" />
      </section>
    </div>
  );
}
