import MapboxHeroGSAP from '@/components/MapboxHeroGSAP'
import Stats from '@/components/Stats'
import Workflow from '@/components/Workflow'
import LiveDataFeeds from '@/components/LiveDataFeeds'
import SolutionsShowcase from '@/components/SolutionsShowcase'
import BlogSection from '@/components/BlogSection'
import ClientsTestimonials from '@/components/ClientsTestimonials'
import DataFlowVisual from '@/components/DataFlowVisual'
import ProjectTimeline from '@/components/ProjectTimeline'
import EngagementModels from '@/components/EngagementModels'
import Faq from '@/components/Faq'
import Footer from '@/components/Footer'
import ParabolaScrollPage from '@/components/Parabola'
export default function Page() {
  return (
    <>
      <MapboxHeroGSAP />
      <Stats />
      <Workflow />
      <LiveDataFeeds />
      <SolutionsShowcase />
      <BlogSection />
      <ClientsTestimonials />
      <DataFlowVisual />
      <ParabolaScrollPage />
      <ProjectTimeline />
      <EngagementModels />
      <Faq />
      <Footer />
    </>
  )
}
