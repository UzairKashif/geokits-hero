"use client";

import React, { useState } from 'react';

interface CommunityPost {
  id: string;
  type: 'instagram';
  url: string;
  title: string;
  description: string;
}

// Instagram embed component using react-instagram-embed
function InstagramEmbedWithFallback({ post }: { post: CommunityPost }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback UI if embed fails to load
    return (
      <div className="w-full h-[420px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl">
        <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-500 blur-sm" />
        <p className="text-gray-300 text-lg font-light mb-2">Instagram content unavailable</p>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 bg-white text-gray-900 rounded-full font-medium shadow hover:bg-gray-200 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          View on Instagram
        </a>
      </div>
    );
  }

  // For now, let's use a simple iframe approach until we set up proper oEmbed
  return (
    <div className="w-full flex justify-center instagram-embed-container">
      <iframe
        src={`${post.url}embed/`}
        width="400"
        height="480"
        frameBorder="0"
        scrolling="no"
        // allowTransparency={true}
        className="border-0"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

const communityPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'instagram',
    url: 'https://www.instagram.com/reel/DNiah8LIji4/',
    title: 'Latest GIS Project Showcase',
    description: 'Discover our recent geospatial intelligence work and innovative mapping solutions.'
  },
  {
    id: '2',
    type: 'instagram',
    title: 'Advanced Geospatial Analytics',
    description: 'Showcasing cutting-edge geospatial analytics, inference and data visualization techniques.',
    url: 'https://www.instagram.com/reel/DNNUEwSotIw/',
  }
];

export default function CommunityEngagement() {
  return (
    <section className="py-32 px-6 forest-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gray-800 text-xs font-medium tracking-[0.3em] text-gray-400 uppercase rounded-full">
              Community
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-extralight text-white mb-8 leading-tight">
            Join Our
            <br />
            <span className="font-light bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Stay connected with our latest updates, insights, and behind-the-scenes content. 
            Follow us on Instagram for real-time project showcases and industry expertise.
          </p>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {communityPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Card Container - Matching BlogCard Style */}
              <article className="group relative bg-gray-800 border border-gray-700 hover:border-gray-600 overflow-hidden cursor-pointer transform-gpu transition-all duration-500 hover:shadow-lg">
                {/* Post Number Badge */}
                <div className="absolute top-6 left-6 z-20 bg-white text-gray-900 px-3 py-1 text-sm font-light tracking-wide">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Type Badge */}
                <div className="absolute top-6 right-6 z-20 text-gray-400 text-xs font-light tracking-wide uppercase">
                  Instagram Reel
                </div>

                {/* Instagram Embed Container with fallback and loader */}
                <div className="relative bg-gray-900 border-b border-gray-700 min-h-[340px] flex items-center justify-center">
                  <InstagramEmbedWithFallback post={post} />
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-light text-white mb-3 tracking-tight line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-base text-gray-400 leading-relaxed mb-4 flex-grow line-clamp-3 tracking-normal">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-light">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        Live Content
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        GIS Showcase
                      </span>
                    </div>
                    <span className="text-gray-500">@geokits_</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 font-light">GIS</span>
                    <span className="text-xs text-gray-500 font-light">•</span>
                    <span className="text-xs text-gray-500 font-light">Geospatial</span>
                    <span className="text-xs text-gray-500 font-light">•</span>
                    <span className="text-xs text-gray-500 font-light">Technology</span>
                  </div>
                </div>

                {/* Hover Overlay - Matching BlogCard Style */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gray-700 border-t border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-light tracking-wide hover:text-white transition-colors duration-300">
                      View on Instagram →
                    </span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            <a
              href="https://www.instagram.com/geokits_/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 hover:bg-gray-200 font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="relative">
                <svg 
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="relative">
                Follow @geokits_
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            
            {/* Floating particles */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-2 h-2 bg-gray-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
              <div className="absolute top-4 right-0 w-1 h-1 bg-gray-500 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-0 left-4 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="mt-6 text-gray-400 text-sm">
            Join our growing community of GIS professionals and enthusiasts
          </p>
        </div>
      </div>
    </section>
  );
}
