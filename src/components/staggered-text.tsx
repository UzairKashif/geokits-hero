"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, type Transition } from "framer-motion";

type MotionStyle = Record<string, string | number>;
type SegmentBy = "chars" | "words" | "lines";
type StaggerDirection = "forward" | "reverse" | "center";

export interface StaggeredTextHandle {
  replay: () => void;
  exit: () => void;
}

export interface StaggeredTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  /** Controlled animation state; when provided, this component skips intersection observer timing */
  active?: boolean;
  segmentBy?: SegmentBy;
  separator?: string;
  delay?: number;
  duration?: number;
  easing?: Transition["ease"];
  threshold?: number;
  rootMargin?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  from?: MotionStyle;
  to?: MotionStyle | MotionStyle[];
  staggerDirection?: StaggerDirection;
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
}

const buildKeyframes = (
  from: MotionStyle,
  steps: MotionStyle[],
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });

  return keyframes;
};

const StaggeredText = forwardRef<StaggeredTextHandle, StaggeredTextProps>(
  (
    {
      text,
      className = "",
      as = "p",
      active,
      segmentBy = "words",
      separator,
      delay = 80,
      duration = 0.6,
      easing = "easeOut",
      threshold = 0.1,
      rootMargin = "0px",
      direction = "top",
      blur = true,
      from,
      to,
      staggerDirection = "forward",
      respectReducedMotion = true,
      exitOnScrollOut = false,
      onAnimationComplete,
      onExitComplete,
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLElement | null>(null);

    const [hasEnteredView, setHasEnteredView] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const isControlled = typeof active === "boolean";

    useEffect(() => {
      if (!respectReducedMotion) return;

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, [respectReducedMotion]);

    useImperativeHandle(ref, () => ({
      replay: () => {
        setIsExiting(false);
        setHasEnteredView(false);
        requestAnimationFrame(() => {
          setHasEnteredView(true);
        });
      },
      exit: () => {
        setIsExiting(true);
      },
    }));

    useEffect(() => {
      if (isControlled) return;
      if (!rootRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            setIsExiting(false);
            if (!exitOnScrollOut && rootRef.current) {
              observer.unobserve(rootRef.current);
            }
          } else if (exitOnScrollOut && hasEnteredView) {
            setIsExiting(true);
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(rootRef.current);
      return () => observer.disconnect();
    }, [threshold, rootMargin, exitOnScrollOut, hasEnteredView, isControlled]);

    const defaultFrom = useMemo<MotionStyle>(() => {
      const base: MotionStyle = { opacity: 0 };

      if (direction === "top" || direction === "bottom") {
        base.y = direction === "top" ? -40 : 40;
      } else {
        base.x = direction === "left" ? -40 : 40;
      }

      if (blur) {
        base.filter = "blur(10px)";
      }

      return base;
    }, [direction, blur]);

    const defaultTo = useMemo<MotionStyle[]>(() => {
      const axisKey = direction === "left" || direction === "right" ? "x" : "y";

      if (!blur) {
        return [
          {
            opacity: 1,
            [axisKey]: 0,
          },
        ];
      }

      const overshoot = direction === "top" || direction === "left" ? 5 : -5;

      return [
        {
          opacity: 0.7,
          [axisKey]: overshoot,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          [axisKey]: 0,
          filter: "blur(0px)",
        },
      ];
    }, [direction, blur]);

    const fromSnapshot = useMemo<MotionStyle>(
      () => from ?? defaultFrom,
      [from, defaultFrom],
    );

    const toSnapshots = useMemo<MotionStyle[]>(() => {
      if (!to) return defaultTo;
      return Array.isArray(to) ? to : [to];
    }, [to, defaultTo]);

    const stepCount = toSnapshots.length + 1;
    const times = useMemo(
      () =>
        Array.from({ length: stepCount }, (_, i) =>
          stepCount === 1 ? 0 : i / (stepCount - 1),
        ),
      [stepCount],
    );

    const { rowsSegments, totalSegments } = useMemo(() => {
      if (!text) {
        return { rowsSegments: [] as string[][], totalSegments: 0 };
      }

      const rows =
        separator && separator.length > 0
          ? text.split(separator)
          : text.split(/\r?\n/);

      const splitRows: string[][] = rows.map((row) => {
        switch (segmentBy) {
          case "chars":
            return row.split("");
          case "lines":
            return [row];
          case "words":
          default:
            return row.split(" ");
        }
      });

      const total = splitRows.reduce((sum, rowSegments) => sum + rowSegments.length, 0);
      return { rowsSegments: splitRows, totalSegments: total };
    }, [text, segmentBy, separator]);

    if (!text) return null;

    const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
    const Wrapper = as;
    const hasMultipleRows = rowsSegments.length > 1;

    const getStaggerDelay = (index: number, total: number): number => {
      if (prefersReducedMotion) return 0;

      switch (staggerDirection) {
        case "reverse":
          return ((total - 1 - index) * delay) / 1000;
        case "center": {
          const middle = (total - 1) / 2;
          const distanceFromCenter = Math.abs(index - middle);
          return (distanceFromCenter * delay) / 1000;
        }
        case "forward":
        default:
          return (index * delay) / 1000;
      }
    };

    let globalIndexCounter = 0;

    const isActive = isControlled ? Boolean(active) : hasEnteredView;

    return (
      <Wrapper
        ref={(node) => {
          rootRef.current = node as HTMLElement | null;
        }}
        className={`staggered-text ${
          hasMultipleRows || segmentBy === "lines" ? "block" : "flex flex-wrap"
        } whitespace-pre-wrap ${className}`}
      >
        {rowsSegments.map((rowSegments, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {rowSegments.map((segment, rowSegIndex) => {
              const globalIndex = globalIndexCounter++;
              const isLast = globalIndex === totalSegments - 1;

              const transition: Transition = prefersReducedMotion
                ? { duration: 0.01, delay: 0 }
                : {
                    duration,
                    times,
                    delay: getStaggerDelay(globalIndex, totalSegments),
                    ease: easing,
                  };

              return (
                <motion.span
                  key={`seg-${rowIndex}-${rowSegIndex}`}
                  initial={fromSnapshot}
                  animate={
                    !isControlled && isExiting
                      ? fromSnapshot
                      : isActive
                        ? animateKeyframes
                        : fromSnapshot
                  }
                  transition={transition}
                  onAnimationComplete={
                    isLast
                      ? () => {
                          if (isExiting) {
                            onExitComplete?.();
                          } else {
                            onAnimationComplete?.();
                          }
                        }
                      : undefined
                  }
                  style={{
                    display: segmentBy === "lines" ? "block" : "inline-block",
                    willChange: "transform, filter, opacity",
                  }}
                >
                  {segmentBy === "chars"
                    ? segment === " "
                      ? "\u00A0"
                      : segment
                    : segment}
                  {segmentBy === "words" &&
                    rowSegIndex < rowSegments.length - 1 &&
                    "\u00A0"}
                </motion.span>
              );
            })}
            {rowIndex < rowsSegments.length - 1 && segmentBy !== "lines" && (
              <br key={`br-${rowIndex}`} />
            )}
          </React.Fragment>
        ))}
      </Wrapper>
    );
  },
);

StaggeredText.displayName = "StaggeredText";

export default StaggeredText;
