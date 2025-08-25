'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/blogData'
import BlogCard from './BlogCard'

export default function BlogSection() {
  return (
    <section id="blog" className="relative py-20 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Insights & Innovation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#021400]">
            Latest Insights
          </h2>
          <div className="w-24 h-1 bg-[#021400] mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore the latest trends, technologies, and insights in geospatial intelligence and smart infrastructure
          </p>
        </div>

        {/* Featured Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {blogPosts.slice(0, 3).map((post, index) => (
            <div key={post.id} className="transform-gpu">
              <BlogCard post={post} index={index} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#021400] text-white hover:bg-gray-800 font-light tracking-wide transition-all duration-300 group"
          >
            View all insights
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,20,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(2,20,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>
    </section>
  )
}
