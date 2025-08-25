"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

// Lazy load heavy components with proper loading states
const MapboxHeroGSAP = dynamic(() => import("@/components/MapboxHeroGSAP"), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-[#021400] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b border-white/30 mb-4 mx-auto"></div>
        <p className="font-light tracking-wide">Loading map...</p>
      </div>
    </div>
  ),
});

const ValueProposition = dynamic(() => import("@/components/ValueProposition"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const SolutionsShowcase = dynamic(() => import("@/components/SolutionsShowcase"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});



const ProjectTimeline = dynamic(() => import("@/components/ProjectTimeline"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const CommunityEngagements = dynamic(() => import("@/components/CommunityEngagements"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-48 bg-gray-900 animate-pulse" />,
});

// Client component wrapper for scroll position memory
const ScrollPositionMemory = dynamic(() => import("@/hooks/useScrollPositionMemory").then(mod => {
  function ScrollPositionMemoryBoundary() {
    mod.useScrollPositionMemory();
    return null;
  }
  return { default: ScrollPositionMemoryBoundary };
}), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-white text-black">
      <div className="relative">
        <Suspense fallback={null}>
          <ScrollPositionMemory />
        </Suspense>
        
        {/* Load hero immediately as it's above the fold */}
        <MapboxHeroGSAP />
        
        {/* Lazy load other sections for better performance */}
        {/* <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <ValueProposition />
        </Suspense>
         */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <SolutionsShowcase />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <ProjectTimeline />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <CommunityEngagements />
        </Suspense>

        {/* Contact Us Section - Keep inline as it's critical */}
        <section className="py-20 sm:py-40 px-4 sm:px-6 normal-bg">
          <div className="max-w-6xl mx-auto text-center sm:text-left">
            <div className="mb-4 sm:mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Get Started
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extralight text-white mb-6 sm:mb-8 leading-none">
              Ready to get
              <br />
              <span className="font-light">started?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide mb-8 sm:mb-12 mx-auto sm:mx-0">
              Transform your infrastructure monitoring with our cutting-edge GIS
              solutions. Let us discuss how we can help your organization
              achieve its goals.
            </p>

            {/* Contact Button */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-white text-gray-900 hover:bg-gray-200 font-light tracking-wide transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Contact us today
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="mailto:contact@geokits.com"
                className="text-gray-400 font-light tracking-wide hover:text-white transition-colors duration-300"
              >
                Send direct email →
              </a>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="h-48 bg-gray-900 animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </main>
  );
}
