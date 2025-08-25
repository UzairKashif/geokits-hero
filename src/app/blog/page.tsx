import { blogPosts } from '@/lib/blogData'
import BlogCard from '@/components/BlogCard'
import SafeNavigationLink from '@/components/SafeNavigationLink'

export default function BlogPage() {
  return (
    <div className="w-full bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <SafeNavigationLink
            href="/?scrollTo=blog"
            className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </SafeNavigationLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-40 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-left mb-24">
            <div className="mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Insights & Innovation
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none">
              Latest thoughts
              <br />
              <span className="font-light">and insights</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
              Explore the latest trends, technologies, and insights in geospatial intelligence 
              and smart infrastructure solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800">
            {blogPosts.map((post, index) => (
              <div key={post.id} className="bg-gray-900">
                <BlogCard post={post} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
