"use client";

import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type MouseEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CardWithTiltProps {
  children: React.ReactNode;
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isHovering: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1625425405800-be8054129584?w=800&q=80",
  "https://images.unsplash.com/photo-1625428354222-ce52b4227b26?w=800&q=80",
  "https://images.unsplash.com/photo-1736117704452-46670dd0c81f?w=800&q=80",
  "https://images.unsplash.com/photo-1742543605128-b47a2f637ee3?w=800&q=80",
  "https://images.unsplash.com/photo-1744968776986-3deb08e40a24?w=800&q=80",
  "https://images.unsplash.com/photo-1744968777020-56288ee1070f?w=800&q=80",
  "https://images.unsplash.com/photo-1722083854827-d93f9f1c6a9e?w=800&q=80",
];

const CardWithTilt = ({
  children,
  delay,
  mouseX,
  mouseY,
  isHovering,
  containerRef,
}: CardWithTiltProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const rotateX = useSpring(
    useTransform(mouseY, (latest: number) => {
      if (!cardRef.current || !isHovering) return 0;
      const rect = cardRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return 0;

      const cardCenterY = rect.top + rect.height / 2 - containerRect.top;
      const distanceY = latest - cardCenterY;
      return (distanceY / containerRect.height) * -25;
    }),
    { stiffness: 200, damping: 15 },
  );

  const rotateY = useSpring(
    useTransform(mouseX, (latest: number) => {
      if (!cardRef.current || !isHovering) return 0;
      const rect = cardRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return 0;

      const cardCenterX = rect.left + rect.width / 2 - containerRect.left;
      const distanceX = latest - cardCenterX;
      return (distanceX / containerRect.width) * 25;
    }),
    { stiffness: 200, damping: 15 },
  );

  return (
    <motion.div
      ref={cardRef}
      initial={!hasAnimated ? { opacity: 0, y: 30 } : false}
      animate={!hasAnimated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onAnimationComplete={() => setHasAnimated(true)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
};

interface HeroCardProps {
  image: string;
  className?: string;
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isHovering: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const HeroCard = ({
  image,
  className,
  delay,
  mouseX,
  mouseY,
  isHovering,
  containerRef,
}: HeroCardProps) => {
  return (
    <CardWithTilt
      delay={delay}
      mouseX={mouseX}
      mouseY={mouseY}
      isHovering={isHovering}
      containerRef={containerRef}
    >
      <div
        className={`rounded-3xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative group hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer ${className}`}
      >
        <img
          src={image}
          alt="Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </CardWithTilt>
  );
};

const CanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawWaves = (
      context: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      context.clearRect(0, 0, width, height);

      const baseColor = "255, 255, 255";
      const waveCount = 3;

      for (let i = 0; i < waveCount; i++) {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = `rgba(${baseColor}, ${0.05 - i * 0.01})`;

        for (let x = 0; x < width; x += 5) {
          const y =
            height * 0.6 +
            Math.sin(x * 0.003 + time + i * 2) * 50 +
            Math.sin(x * 0.007 + time * 0.5 + i) * 30 +
            i * 120;

          if (x === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.stroke();
      }
    };

    const draw = () => {
      const time = Date.now() * 0.001;
      drawWaves(ctx, canvas.width, canvas.height, time);
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export function Hero2() {
  const router = useRouter();
  const enableTilt = true;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    if (enableTilt) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (!enableTilt) return;
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={enableTilt ? containerRef : undefined}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseEnter={enableTilt ? handleMouseEnter : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
      className="w-full min-h-screen min-h-[100svh] flex items-start pt-32 sm:pt-36 md:pt-40 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 relative overflow-hidden"
    >
      <CanvasBackground />
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-neutral-950 to-transparent z-0 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-neutral-950 to-transparent z-0 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 mb-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl tracking-tight font-extralight text-white leading-[1.15] max-w-2xl"
          >
            Transform Your Vision
            <br />
            Into Reality
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed max-w-xl font-light tracking-wide"
          >
            Experience the world through geospatial intelligence and innovative
            system design
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/contact")}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-[0.75rem] bg-neutral-800 border border-neutral-700 text-white font-light text-sm sm:text-base hover:bg-neutral-700 transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 sm:left-0 top-0 bottom-0 hidden sm:block w-64 bg-linear-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute -right-4 sm:right-0 top-0 bottom-0 hidden sm:block w-64 bg-linear-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

          <div
            className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full overflow-x-auto scrollbar-hide flex justify-center px-4 sm:px-0"
            style={{ perspective: "1000px" }}
          >
            <div className="flex items-end gap-3 sm:gap-4 md:gap-6">
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-1 min-w-[180px]">
                <HeroCard
                  delay={0.8}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[0]}
                  className="h-60 sm:h-[280px] md:h-80 lg:h-[360px] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60"
                />
                <HeroCard
                  delay={0.85}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[1]}
                  className="h-[60px] sm:h-[70px] md:h-20 lg:h-[90px] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60"
                />
              </div>

              <div className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-60">
                <HeroCard
                  delay={0.5}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[2]}
                  className="h-60 sm:h-[280px] md:h-80 lg:h-[360px] w-full"
                />
              </div>

              <div className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-60">
                <HeroCard
                  delay={0.4}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[3]}
                  className="aspect-square w-full"
                />
              </div>

              <div className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-60">
                <HeroCard
                  delay={0.6}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[4]}
                  className="h-60 sm:h-[280px] md:h-80 lg:h-[360px] w-full"
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-1 min-w-[180px]">
                <HeroCard
                  delay={0.7}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[5]}
                  className="h-60 sm:h-[280px] md:h-80 lg:h-[360px] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60"
                />
                <HeroCard
                  delay={0.75}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isHovering={isHovering}
                  containerRef={containerRef}
                  image={CARD_IMAGES[6]}
                  className="h-[60px] sm:h-[70px] md:h-20 lg:h-[90px] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
