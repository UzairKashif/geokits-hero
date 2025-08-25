import FancyTestimonialsSlider from "@/components/ClientsTestimonials";
import SafeNavigationLink from "@/components/SafeNavigationLink";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <SafeNavigationLink
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </SafeNavigationLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Client Stories
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-8 leading-none tracking-tight">
            What our clients
            <br />
            <span className="font-light">are saying</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide font-light">
            Trusted by organizations worldwide for delivering critical geospatial solutions that drive real results and exceed expectations.
          </p>
        </div>
      </section>

      {/* Testimonials Component */}
      <FancyTestimonialsSlider />

      {/* Additional Content Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
            Ready to join our satisfied clients?
          </h2>
          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            Let's discuss how we can help your organization achieve its geospatial goals with our proven expertise and innovative solutions.
          </p>
          <SafeNavigationLink
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 hover:bg-gray-200 font-light tracking-wide transition-all duration-300 group"
          >
            Start Your Project
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </SafeNavigationLink>
        </div>
      </section>
    </div>
  );
}
