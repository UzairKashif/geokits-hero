"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StaggeredText from "@/components/staggered-text";

const milestones = [
  {
    title: "Discovery and Requirements Gathering",
    description:
      "Collecting geospatial data through satellites, drones, sensors, surveys, and existing databases",
    phase: "Phase 01",
  },
  {
    title: "Solution Design and Planning",
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
  const animatedPathRef = useRef<SVGPathElement>(null);
  const lineBoundsRef = useRef({ startY: 0, endY: 0 });

  const [lineProgress, setLineProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pathLength, setPathLength] = useState(3000);
  const [milestoneProgress, setMilestoneProgress] = useState<number[]>([]);

  const containerWidth = 1000;
  const verticalSpacing = 280;

  // Responsive dimensions
  const mobileContainerWidth = 340;
  const mobileVerticalSpacing = 210;
  const mobileHorizontalAmplitude = 82;

  const pathData = useMemo(() => {
    const currentContainerWidth = isMobile
      ? mobileContainerWidth
      : containerWidth;
    const currentVerticalSpacing = isMobile
      ? mobileVerticalSpacing
      : verticalSpacing;
    const currentHorizontalAmplitude = isMobile
      ? mobileHorizontalAmplitude
      : 320;

    const milestonesPerCycle = 2;
    const wavelength = currentVerticalSpacing * milestonesPerCycle;
    const centreX = currentContainerWidth / 2;
    const startOffset = isMobile ? 42 : 250;
    const bottomPadding = isMobile ? 170 : 150;

    const points = milestones.map((_, i) => {
      const y = i * currentVerticalSpacing + startOffset;
      const x =
        centreX +
        Math.sin((2 * Math.PI * y) / wavelength) * currentHorizontalAmplitude;
      return { x, y, index: i };
    });

    const curvePoints = isMobile
      ? [
          {
            x:
              centreX +
              Math.sin(
                (2 * Math.PI * (points[0].y - currentVerticalSpacing * 0.4)) /
                  wavelength,
              ) *
                currentHorizontalAmplitude,
            y: points[0].y - currentVerticalSpacing * 0.4,
          },
          ...points.map((p) => ({ x: p.x, y: p.y })),
          {
            x:
              centreX +
              Math.sin(
                (2 *
                  Math.PI *
                  (points[points.length - 1].y + currentVerticalSpacing * 0.4)) /
                  wavelength,
              ) *
                currentHorizontalAmplitude,
            y: points[points.length - 1].y + currentVerticalSpacing * 0.4,
          },
        ]
      : points.map((p) => ({ x: p.x, y: p.y }));

    let path = `M ${curvePoints[0].x} ${curvePoints[0].y}`;

    for (let i = 1; i < curvePoints.length; i += 1) {
      const prev = curvePoints[i - 1];
      const curr = curvePoints[i];
      const midY = (prev.y + curr.y) / 2;
      path += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }

    return {
      path,
      points,
      lineStartY: curvePoints[0].y,
      lineEndY: curvePoints[curvePoints.length - 1].y,
      containerWidth: currentContainerWidth,
      totalHeight: curvePoints[curvePoints.length - 1].y + bottomPadding,
    };
  }, [isMobile]);

  const {
    path,
    points,
    lineStartY,
    lineEndY,
    containerWidth: currentContainerWidth,
    totalHeight: currentTotalHeight,
  } = pathData;

  useEffect(() => {
    lineBoundsRef.current = { startY: lineStartY, endY: lineEndY };
  }, [lineStartY, lineEndY]);

  // Measure path length and map each milestone to exact draw progress.
  useEffect(() => {
    if (!animatedPathRef.current) return;

    const pathEl = animatedPathRef.current;
    const length = pathEl.getTotalLength();
    if (length <= 0) return;

    setPathLength(length);

    const coarseSamples = Math.max(900, Math.floor(length / 2));
    const coarseStep = length / coarseSamples;

    const pointProgressMap = points.map((point) => {
      let bestLength = 0;
      let bestDistanceSq = Number.POSITIVE_INFINITY;

      for (let i = 0; i <= coarseSamples; i += 1) {
        const sampleLength = i * coarseStep;
        const samplePoint = pathEl.getPointAtLength(sampleLength);
        const dx = samplePoint.x - point.x;
        const dy = samplePoint.y - point.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < bestDistanceSq) {
          bestDistanceSq = distanceSq;
          bestLength = sampleLength;
        }
      }

      const refineWindow = coarseStep * 1.5;
      const refineStart = Math.max(0, bestLength - refineWindow);
      const refineEnd = Math.min(length, bestLength + refineWindow);
      const refineSteps = 40;
      const refineStep = (refineEnd - refineStart) / refineSteps;

      for (let i = 0; i <= refineSteps; i += 1) {
        const sampleLength = refineStart + i * refineStep;
        const samplePoint = pathEl.getPointAtLength(sampleLength);
        const dx = samplePoint.x - point.x;
        const dy = samplePoint.y - point.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < bestDistanceSq) {
          bestDistanceSq = distanceSq;
          bestLength = sampleLength;
        }
      }

      return bestLength / length;
    });

    setMilestoneProgress(pointProgressMap);
  }, [path, points]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }

    let rafId: number;

    const updateProgress = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (isMobile) {
        // Mobile: map a viewport anchor to the real path range, then speed it up slightly.
        const { startY, endY } = lineBoundsRef.current;
        const containerTopDoc = window.scrollY + rect.top;
        const viewportAnchorDoc = window.scrollY + windowHeight * 0.46;
        const startDoc = containerTopDoc + startY;
        const endDoc = containerTopDoc + endY;
        const raw =
          endDoc > startDoc
            ? (viewportAnchorDoc - startDoc) / (endDoc - startDoc)
            : 0;
        const mobileSpeedFactor = 1.2;
        const mobileProgress = Math.max(
          0,
          Math.min(1, raw * mobileSpeedFactor),
        );
        setLineProgress(mobileProgress);
      } else {
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const startThreshold = windowHeight * 0.34;
        const endThreshold = windowHeight * 1;
        const adjustedTop = elementTop + startThreshold;
        const desktopProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - adjustedTop) /
              (windowHeight + elementHeight - endThreshold),
          ),
        );
        setLineProgress(desktopProgress);
      }
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

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);
      updateProgress();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isMobile, points]);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="timeline" className="relative w-full px-6 py-8 md:py-16">
        <section className="relative overflow-hidden bg-black px-6 py-6 md:py-16">
          <div className="mx-auto mb-3 max-w-6xl text-left md:mb-12">
            <div className="z-30 bg-black/92 py-4 md:bg-transparent md:py-0">
              <div className="mb-6">
                <span className="text-xs font-light tracking-[0.2em] text-gray-400 uppercase">
                  Engagement Roadmap
                </span>
              </div>
              <h2 className="mb-6 text-5xl font-extralight leading-none text-white md:mb-8 md:text-7xl">
                Project
                <br />
                <span className="font-light">journey</span>
              </h2>
              <p className="max-w-xl text-base leading-relaxed tracking-wide text-gray-400 md:text-lg">
                Your roadmap to seamless engagement and successful project delivery.
              </p>
            </div>
          </div>

          <div
            ref={timelineRef}
            className="relative mx-auto"
            style={{
              width: `${currentContainerWidth}px`,
              height: `${currentTotalHeight}px`,
              maxWidth: isMobile ? "100vw" : "95vw",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox={`0 0 ${currentContainerWidth} ${currentTotalHeight}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ willChange: "transform" }}
            >
              <path
                d={path}
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />

              <path
                ref={animatedPathRef}
                d={path}
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - lineProgress)}
                style={{ transition: "none" }}
              />
            </svg>

            {milestones.map((milestone, index) => {
              const point = points[index];
              const revealAt = milestoneProgress[index] ?? 1;
              const isVisible = lineProgress >= revealAt;
              const isLeft = point.x < currentContainerWidth / 2;
              const mobileLabelOnLeft = index % 2 === 0;

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
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`
                        absolute ${isMobile ? "h-14 w-14" : "h-20 w-20"} rounded-full border transition-all duration-300 ease-out
                        ${
                          isVisible
                            ? "border-gray-500 bg-gray-800 scale-100"
                            : "border-gray-700 bg-gray-900 scale-90"
                        }
                      `}
                    />

                    <div
                      className={`
                        relative ${isMobile ? "h-7 w-7" : "h-10 w-10"} z-10 rounded-full transition-all duration-400 ease-out
                        ${isVisible ? "bg-white" : "bg-gray-600"}
                      `}
                    >
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-xs font-light tracking-wide transition-colors duration-300 ${
                          isVisible ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div
                      className={`absolute z-20 transition-all duration-400 ease-out
                        ${
                          isMobile
                            ? mobileLabelOnLeft
                              ? "left-0 -translate-x-full pr-10 text-right"
                              : "right-0 translate-x-full pl-10 text-left"
                            : isLeft
                              ? "left-0 -translate-x-full pr-6 text-right"
                              : "right-0 translate-x-full pl-6 text-left"
                        }
                        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
                        max-w-[118px] select-none md:max-w-[240px]`}
                    >
                      <StaggeredText
                        as="h3"
                        text={milestone.title}
                        segmentBy="words"
                        direction="top"
                        delay={60}
                        duration={0.55}
                        blur
                        active={isVisible}
                        className={`${
                          isMobile ? "text-[14px] font-bold" : "text-base font-semibold"
                        } leading-tight tracking-tight ${isVisible ? "text-white" : "text-gray-400"}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
