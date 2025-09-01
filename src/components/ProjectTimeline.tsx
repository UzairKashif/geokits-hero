"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
// import GradualBlur from "@/components/ReactBits/GradualBlur
const milestones = [
  {
    title: "Discovery and Requirements Gathering ",
    description:
      "Collecting geospatial data through satellites, drones, sensors, surveys, and existing databases",
    phase: "Phase 01",
  },
  {
    title: " Solution Design and Planning",
    description:
      "Cleaning, transforming, and integrating raw data into standardized GIS formats for further analysis",
    phase: "Phase 02",
  },
  {
    title: "Implementation and Development",
    description:
      "Applying geospatial analytics, modeling, and algorithms to derive insights and identify patterns",
    phase: "Phase 03",
  },
  {
    title: "Testing and QA",
    description:
      "Building tailored GIS applications, dashboards, and decision-support tools to meet client needs",
    phase: "Phase 04",
  },
  {
    title: "Delivery & Support",
    description:
      "Delivering the solution to end users, providing training, ongoing maintenance, and scaling capabilities",
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

      // Faster animation - starts animation earlier and progresses more quickly
      const startThreshold = isMobile ? windowHeight * 0.6 : windowHeight * 0.3;
      const endThreshold = isMobile ? windowHeight * 0.4 : windowHeight * 1;

      // Start animating earlier for faster progression
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

      // Faster milestone visibility - less conservative thresholds for quicker appearance
      const newVisibleMilestones = new Set<number>();

      points.forEach((point, index) => {
        const milestoneScreenY = rect.top + point.y;
        const milestoneFromTop = milestoneScreenY;
        const milestoneFromBottom = windowHeight - milestoneScreenY;

        // Faster milestone appearance with less conservative thresholds
        const topBuffer = isMobile ? windowHeight * 0.35 : windowHeight * 0.3;
        const bottomBuffer = isMobile
          ? windowHeight * 0.05
          : windowHeight * 0.05;

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

    // Faster header visibility with quicker threshold
    const headerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsHeaderVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: isMobile ? "0px 0px -30% 0px" : "0px 0px -20% 0px",
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
    <div className="w-full forest-bg overflow-hidden relative">
      <section id="timeline" className="w-full py-40 px-6 relative">
        <div
          ref={headerRef}
          className={`text-left max-w-6xl mx-auto mb-24 transition-all duration-500 ease-out ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Engagement Roadmap
            </span>
          </div>
          <h2
            className={`text-6xl md:text-7xl font-extralight text-white mb-8 leading-none transition-all duration-600 delay-50 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            Project
            <br />
            <span className="font-light">journey</span>
          </h2>
          <p
            className={`text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide transition-all duration-500 delay-100 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
Your roadmap to seamless engagement and successful project delivery.
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
                    absolute ${isMobile ? "w-16 h-16" : "w-20 h-20"} rounded-full border transition-all duration-300 ease-out
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
                    relative ${isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-full transition-all duration-400 ease-out z-10
                    ${isVisible ? "bg-white" : "bg-gray-600"}
                  `}
                  >
                    {/* Phase number */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-xs font-light tracking-wide transition-colors duration-300 ${
                        isVisible ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Text content - simple title only */}
                  <div
                    className={`absolute z-20 transition-all duration-400 ease-out
                      ${
                        isMobile
                          ? "left-1/2 -translate-x-1/2 top-16 mt-2 text-center"
                          : isLeft
                            ? "left-12 -translate-x-full pr-4 text-right"
                            : "right-12 translate-x-full pl-4 text-left"
                      }
                      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                      max-w-[200px] md:max-w-[240px] select-none`}
                    style={{
                      transitionDelay: isVisible
                        ? `${index * 0.05 + 0.1}s`
                        : "0s",
                    }}
                  >
                    {/* Simple text container */}
                    <div
                      className={`
                      ${isVisible ? "bg-gray-800/60 border-gray-600" : "bg-gray-900/40 border-gray-700"}
                      border backdrop-blur-sm px-3 py-2 transition-all duration-300
                    `}
                      style={{
                        transitionDelay: isVisible
                          ? `${index * 0.05 + 0.15}s`
                          : "0s",
                      }}
                    >
                      {/* Just the title */}
                      <h3
                        className={`font-light ${isMobile ? "text-sm" : "text-base"} leading-tight tracking-tight
                          ${isVisible ? "text-white" : "text-gray-400"} transition-all duration-300`}
                        style={{
                          transitionDelay: isVisible
                            ? `${index * 0.05 + 0.2}s`
                            : "0s",
                        }}
                      >
                        {milestone.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-16" />
        
        {/* <GradualBlur
          target="parent"
          position="bottom"
          height="12rem"
          strength={4}
          divCount={8}
          curve="bezier"
          exponential={true}
          opacity={0.8}
          zIndex={100}
          blurColor="rgba(2, 20, 0, 0.4)"
        /> */}
      </section>
    </div>
  );
}
