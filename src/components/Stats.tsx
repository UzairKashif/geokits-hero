"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";
import Fonts from "./Fonts";

const stats = [
  { value: 5, label: "Projects Delivered", suffix: "" },
  { value: 21, label: "Hazard Types Monitored", suffix: "" },
  { value: 100, label: "Professionals Trained", suffix: "+" },
];

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1,
        );

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const glowVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: [0, 0.6, 0.3],
      transition: {
        duration: 1.2,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Fonts />
      <section
        id="stats"
        className="w-full py-20 px-4 relative overflow-hidden bg-black"
      >
        <motion.div
          ref={ref}
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h2 className="text-4xl md:text-5xl font-satoshi-bold text-white mb-4">
              Our <span className="text-[#00FF9E]">Impact</span>
            </h2>
            <div className="w-24 h-1 bg-[#00FF9E] mx-auto rounded-full" />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="relative group"
                variants={itemVariants}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-[#00FF9E]/20 rounded-2xl blur-xl"
                  variants={glowVariants}
                />

                {/* Card */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center hover:border-[#00FF9E]/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[#00FF9E] rounded-full opacity-60" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#00FF9E] rounded-full opacity-40" />

                  {/* Number */}
                  <motion.div
                    className="text-6xl md:text-7xl font-satoshi-black text-[#00FF9E] mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={
                      isInView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0.5, opacity: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: i * 0.15 + 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={2 + i * 0.5}
                    />
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    className="text-lg md:text-xl text-gray-300 font-satoshi-medium leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.4 }}
                  >
                    {stat.label}
                  </motion.div>

                  {/* Progress bar */}
                  <motion.div
                    className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.15 + 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00FF9E] to-[#00CC7E] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.15 + 0.6,
                        ease: "easeOut",
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom decoration */}
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#00FF9E] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
