import MapboxHeroGSAP from '@/components/MapboxHeroGSAP'
import Stats from '@/components/Stats'
import Workflow from '@/components/Workflow'
import LiveDataFeeds from '@/components/LiveDataFeeds'
import SolutionsShowcase from '@/components/SolutionsShowcase'
import ClientsTestimonials from '@/components/ClientsTestimonials'
import DataFlowVisual from '@/components/DataFlowVisual'
import ProjectTimeline from '@/components/ProjectTimeline'
import EngagementModels from '@/components/EngagementModels'
import Faq from '@/components/Faq'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>

<MapboxHeroGSAP />
      {/* Now the next section (white bg) starts below */}
      <Stats />
      <Workflow />
      
      <LiveDataFeeds />
      <SolutionsShowcase />
      <ClientsTestimonials />
      <DataFlowVisual />
      <ProjectTimeline />
      <EngagementModels />
      <Faq />
      <Footer />
    </>
  )
}
