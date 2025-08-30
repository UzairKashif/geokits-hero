import { blogPosts } from '@/lib/blogData'
import BlogCard from '@/components/BlogCard'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#021400]">
              Insights & Innovation
            </h1>
            <div className="w-24 h-1 bg-[#021400] mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore the latest trends, technologies, and insights in geospatial intelligence and smart infrastructure
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <div key={post.id} className="transform-gpu">
                <BlogCard post={post} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,20,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(2,20,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>
    </div>
  )
}
