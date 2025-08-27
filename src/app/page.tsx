"use client";

import { Suspense } from "react";
import MapboxHeroGSAP from "@/components/MapboxHeroGSAP";
import Stats from "@/components/Stats";
import Workflow from "@/components/Workflow";
// import LiveDataFeeds from '@/components/LiveDataFeeds'
import SolutionsShowcase from "@/components/SolutionsShowcase";
import BlogSection from "@/components/BlogSection";
import DataFlowVisual from "@/components/DataFlowVisual";
import ProjectTimeline from "@/components/ProjectTimeline";
import EngagementModels from "@/components/EngagementModels";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CommunityEngagement from "@/components/CommunityEngagement";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useScrollPositionMemory } from "@/hooks/useScrollPositionMemory";
import ValueProposition from "@/components/ValueProposition";
import { ServicesSection } from "@/components/ServicesSection";
function ScrollPositionMemoryBoundary() {
  // Isolated client component to use search params inside Suspense
  useScrollPositionMemory();
  return null;
}

export default function Page() {
  // Initialize scroll position memory within a Suspense boundary

  return (
    <main className="relative min-h-screen w-full bg-white text-black">
      <div className="relative">
        <Suspense fallback={null}>
          <ScrollPositionMemoryBoundary />
        </Suspense>
        <MapboxHeroGSAP />
        {/* <ValueProposition /> */}
        {/* <Stats /> */}
        {/* <Workflow /> */}
        {/* <LiveDataFeeds /> */}
        <div id="solutions">
          <SolutionsShowcase />
        </div>
        <div id="services">
          <ServicesSection/>
        </div>
        <div id="blog">
          <BlogSection />
        </div>
        {/* <DataFlowVisual /> */}
        {/* <ParabolaScrollPage /> */}
        <ProjectTimeline />
        {/* <EngagementModels /> */}
        {/* <Faq /> */}

        {/* Community Engagement Section */}
        <CommunityEngagement />

        {/* Contact Us Section */}
        <section className="py-40 px-6 forest-bg">
          <div className="max-w-6xl mx-auto text-left">
            <div className="mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Get Started
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none">
              Ready to get
              <br />
              <span className="font-light">started?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide mb-12">
              Transform your infrastructure monitoring with our cutting-edge GIS
              solutions. Let us discuss how we can help your organization
              achieve its goals.
            </p>

            {/* Contact Button */}
            <div className="flex items-center gap-12">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 hover:bg-gray-200 font-light tracking-wide transition-all duration-300"
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

        <Footer />
      </div>
    </main>
  );
}
