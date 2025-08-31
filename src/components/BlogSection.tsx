'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/blogData'
import BlogCard from './BlogCard'

export default function BlogSection() {
  return (
    <section id="blog" className="bg-white min-h-screen w-full">
      {/* Header Section */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Insights & Innovation
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none">
              Latest
              <br />
              <span className="font-light">Insights</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Featured Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
            className="inline-flex items-center gap-3 px-8 py-3 bg-[#021400] text-white hover:bg-[#032200] font-light tracking-wide transition-all duration-300 group btn-soft-curve btn-primary"
          >
            View all insights
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
