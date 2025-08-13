'use client'

import MapboxHeroGSAP from '@/components/MapboxHeroGSAP'
import Stats from '@/components/Stats'
import Workflow from '@/components/Workflow'
import LiveDataFeeds from '@/components/LiveDataFeeds'
import SolutionsShowcase from '@/components/SolutionsShowcase'
import BlogSection from '@/components/BlogSection'
import FancyTestimonialsSlider from '@/components/ClientsTestimonials'
import DataFlowVisual from '@/components/DataFlowVisual'
import ProjectTimeline from '@/components/ProjectTimeline'
import EngagementModels from '@/components/EngagementModels'
import Faq from '@/components/Faq'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { useScrollPositionMemory } from '@/hooks/useScrollPositionMemory'

export default function Page() {
  // Initialize scroll position memory
  useScrollPositionMemory()

  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <div className="relative">
        <MapboxHeroGSAP />
        <Stats />
        <Workflow />
        {/* <LiveDataFeeds /> */}
        <SolutionsShowcase />
        <BlogSection />
        <FancyTestimonialsSlider />
        <DataFlowVisual />
        {/* <ParabolaScrollPage /> */}
        <ProjectTimeline />
        <EngagementModels />
        <Faq />
        
        {/* Contact Us Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-tight">
              Ready to Get <span className="text-emerald-400">Started?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Transform your infrastructure monitoring with our cutting-edge GIS solutions. 
              Let&apos;s discuss how we can help your organization achieve its goals.
            </p>
            
            {/* Contact Button */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            >
              <Mail className="w-6 h-6" />
              Contact Us Today
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            {/* Decorative line */}
            <div className="mx-auto mt-12 h-0.5 w-32 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60" />
          </div>
        </section>
        
        <Footer />
      </div>
    </main>
  )
}
