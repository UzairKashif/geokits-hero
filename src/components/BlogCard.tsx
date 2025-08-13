'use client'

import React from 'react'
import { useNavigationCleanup } from '../hooks/useNavigationCleanup'
import { BlogPost } from '../lib/blogData'

interface BlogCardProps {
  post: BlogPost
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const cleanupAndNavigate = useNavigationCleanup()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add a small safety delay to ensure any ongoing animations are complete
    requestAnimationFrame(() => {
      cleanupAndNavigate(`/blog/${post.slug}`)
    })
  }

  return (
    <div onClick={handleClick}>
      <article className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 h-[500px] cursor-pointer transform-gpu transition-all duration-500 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10">
        
        {/* Blog Badge */}
        <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Category Badge */}
        <div className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-green-300 px-3 py-1 rounded-full text-xs font-medium">
          {post.category}
        </div>

        {/* Image Container */}
        <div className="relative h-60 overflow-hidden">
          {post.img_url ? (
            <img 
              src={post.img_url} 
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-sm">Blog Image</p>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        {/* Content */}
        <div className="p-6 h-60 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </div>
            <span className="text-green-400">{post.author}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-sm font-medium">Read Article</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 blur-xl"></div>
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse" style={{ left: '15%', top: '20%', animationDelay: '0s' }} />
          <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse" style={{ left: '85%', top: '10%', animationDelay: '0.3s' }} />
          <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse" style={{ left: '25%', top: '80%', animationDelay: '0.6s' }} />
          <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse" style={{ left: '70%', top: '60%', animationDelay: '0.9s' }} />
        </div>
      </article>
    </div>
  )
}
