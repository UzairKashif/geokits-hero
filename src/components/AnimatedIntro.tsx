"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AnimatedIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // After 2 seconds, start the animation
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => setAnimationComplete(true)}
    >
      {showIntro ? (
        <motion.div
          key="intro"
          initial={{ height: "100vh", width: "100%", y: 0, borderRadius: 0 }}
          animate={{
            backgroundColor: ["#000000", "#000000"],
            transition: { duration: 1.5 },
          }}
          exit={{
            height: "0vh",
            width: "100%",
            y: 0,
            left: "50%",
            x: "-50%",
            borderRadius: "0px",
            transition: {
              duration: 1,
              ease: [0.16, 1, 0.3, 1], // Improved bezier curve for more elegant motion
              width: { delay: 0.3, duration: 0.7 },
              borderRadius: { delay: 0.5, duration: 0.5 },
            },
          }}
          className="fixed top-0 left-0 bg-white z-[200] flex items-center justify-center overflow-hidden"
          style={{
            position: "fixed",
          }}
        >
          {/* Subtle gradient overlay for more depth */}
          <div className="absolute inset-0 bg-black opacity z-0"></div>

          {/* Animated image container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.8,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.4 },
            }}
            className="relative z-10 w-[400px] md:w-[480px]"
          >
            <Image
              src="/eng-trans-black.png"
              alt="Geokits Logo"
              width={480}
              height={200}
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
