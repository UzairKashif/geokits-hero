"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "./BlogCard";
import { blogPosts } from "../lib/blogData";

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection() {
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const eventListenersRef = useRef<
    Array<{
      element: HTMLDivElement;
      events: Array<{ type: string; handler: EventListener }>;
    }>
  >([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Small delay to ensure DOM is fully ready and Lenis is initialized
    const timer = setTimeout(() => {
      if (!sectionRef.current) return;

      ctxRef.current = gsap.context(() => {
        // Title entrance animation
        const titleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        titleTl
          .fromTo(
            titleRef.current,
            {
              opacity: 0,
              y: 80,
              scale: 0.8,
              rotationX: 20,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 1.2,
              ease: "power4.out",
            },
          )
          .fromTo(
            subtitleRef.current,
            {
              opacity: 0,
              scaleX: 0,
              transformOrigin: "center",
            },
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.4",
          );

        // Cards entrance animation
        const cards = cardsRef.current;
        if (cards.length > 0) {
          gsap.set(cards, {
            opacity: 0,
            y: 100,
            rotationY: 25,
            scale: 0.8,
          });

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          });

          // Enhanced hover animations for each card
          cards.forEach((card: HTMLDivElement) => {
            if (card) {
              const hoverIn = () => {
                gsap.to(card, {
                  y: -10,
                  rotationX: 5,
                  scale: 1.02,
                  duration: 0.4,
                  ease: "power2.out",
                });
              };

              const hoverOut = () => {
                gsap.to(card, {
                  y: 0,
                  rotationX: 0,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.out",
                });
              };

              // Store event listeners for cleanup
              const events = [
                { type: "mouseenter", handler: hoverIn },
                { type: "mouseleave", handler: hoverOut },
              ];

              events.forEach(({ type, handler }) => {
                card.addEventListener(type, handler);
              });

              eventListenersRef.current.push({ element: card, events });
            }
          });
        }
      }, sectionRef);
    }, 100); // Small delay

    return () => {
      clearTimeout(timer);
      // Cleanup event listeners
      eventListenersRef.current.forEach(({ element, events }) => {
        if (element && element.parentNode) {
          events.forEach(({ type, handler }) => {
            element.removeEventListener(type, handler);
          });
        }
      });
      eventListenersRef.current = [];

      // Cleanup GSAP context
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [isClient]);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  if (!isClient) {
    return (
      <section className="w-full min-h-screen bg-[#021400] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="w-full min-h-screen bg-[#021400] py-40 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Title Section */}
        <div className="text-left mb-24">
          <div className="mb-6">
            <span
              ref={subtitleRef}
              className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase"
            >
              Insights & Updates
            </span>
          </div>
          <h2
            ref={titleRef}
            className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none"
          >
            Latest from
            <br />
            <span className="font-light">our blog</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
            Explore the latest trends, technologies, and insights in geospatial
            intelligence and smart infrastructure.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800">
          {blogPosts.slice(0, 3).map((post, index) => (
            <div key={post.id} ref={addToRefs} className="transform-gpu">
              <BlogCard post={post} index={index} />
            </div>
          ))}
        </div>

        {/* View All Blog Button */}
        <div className="mt-24">
          <div className="flex items-center gap-12">
            <Link href="/blog">
              <button className="px-10 py-4 bg-white text-[#021400] font-light tracking-wide hover:bg-gray-200 transition-all duration-300">
                View all articles
              </button>
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 font-light tracking-wide hover:text-white transition-colors duration-300"
            >
              Subscribe to updates →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
