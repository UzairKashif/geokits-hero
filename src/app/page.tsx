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
        <LiveDataFeeds />
        <SolutionsShowcase />
        <BlogSection />
        <FancyTestimonialsSlider />
        <DataFlowVisual />
        {/* <ParabolaScrollPage /> */}
        <ProjectTimeline />
        <EngagementModels />
        <Faq />
        <Footer />
      </div>
    </main>
  )
}
