"use client";

import { Suspense } from "react";
import { Hero2 } from "@/components/hero-2";
// import LiveDataFeeds from '@/components/LiveDataFeeds'
import SolutionsShowcase from "@/components/SolutionsShowcase";
import SocialProof1 from "@/components/social-proof-1";
// import BlogSection from "@/components/BlogSection";
import ProjectTimeline from "@/components/ProjectTimeline";
import Footer from "@/components/Footer";
import CommunityEngagement from "@/components/CommunityEngagement";
// import CompanyDescriptionSection from "@/components/misc";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useScrollPositionMemory } from "@/hooks/useScrollPositionMemory";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactBg } from "@/components/ContactBg";
import ScrollToHash from "@/components/ScrollToHash";

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
        <ScrollToHash />
        <Hero2 />
        {/* <CompanyDescriptionSection /> */}
        {/* <ValueProposition /> */}
        {/* <Stats /> */}
        {/* <Workflow /> */}
        {/* <LiveDataFeeds /> */}
        <div id="services">
          <ServicesSection/>
        </div>
        <div id="timeline">
          <ProjectTimeline />
        </div>
        <div id="solutions">
          <SolutionsShowcase />
        </div>
        <SocialProof1 />
        {/* <div id="blog">
          <BlogSection />
        </div> */}
        {/* <DataFlowVisual /> */}
        {/* <ParabolaScrollPage /> */}
        <div id="about">
          <CommunityEngagement />
        </div>
        {/* <EngagementModels /> */}
        {/* <Faq /> */}

        {/* Contact Us Section */}
        <section className="relative py-40 px-6 forest-bg overflow-hidden">
          <ContactBg/>
          <div className="relative z-10 max-w-6xl mx-auto text-left">
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
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-12">
              <Link
                href="/contact"
                className="btn-soft-curve btn-secondary group inline-flex items-center gap-3 px-10 py-4 font-light tracking-wide"
              >
                <Mail className="w-5 h-5" />
                Contact us today
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:contact@geokits.com"
                  className="text-gray-400 font-light tracking-wide hover:text-white transition-colors duration-300"
                >
                  Send direct email →
                </a>
                <a
                  href="tel:+447958351564"
                  className="inline-flex items-center gap-2 text-gray-400 font-light tracking-wide hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  +44 7958 351564
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
