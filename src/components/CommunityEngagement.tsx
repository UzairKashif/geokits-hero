"use client";

import React, { useState } from 'react';

interface CommunityPost {
  id: string;
  type: 'instagram';
  url: string;
  title: string;
  description: string;
}

// Instagram embed component - sleek and minimal with Firefox support
function InstagramEmbedWithFallback({ post }: { post: CommunityPost }) {
  const [hasError, setHasError] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);

  React.useEffect(() => {
    // Detect Firefox browser and other browsers that may block embeds
    const userAgent = navigator.userAgent.toLowerCase();
    const firefoxDetected = userAgent.includes('firefox');
    const safariDetected = userAgent.includes('safari') && !userAgent.includes('chrome');
    const isPrivateMode = window.navigator.cookieEnabled === false;
    
    setIsFirefox(firefoxDetected);
    
    // If Firefox, Safari in private mode, or other security-focused browsers, skip iframe
    if (firefoxDetected || (safariDetected && isPrivateMode)) {
      setHasError(true);
    }
  }, []);

  if (hasError || isFirefox) {
    // Enhanced fallback UI for Firefox and iframe failures
    return (
      <div className="w-full max-w-[400px] mx-auto h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-500 opacity-60 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <p className="text-gray-300 text-sm font-light mb-1">
          {isFirefox ? 'Firefox Enhanced Tracking Protection' : 'Content Protected'}
        </p>
        <p className="text-gray-400 text-xs mb-4 text-center max-w-xs">
          {isFirefox 
            ? 'Enhanced Tracking Protection is blocking social media embeds. Click below to view the post directly.'
            : 'Social media embeds are restricted. Click below to view the original post.'
          }
        </p>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-full font-light hover:bg-white/20 transition-all backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          View on Instagram
        </a>
      </div>
    );
  }

  // Clean iframe embed with proper sizing (for non-Firefox browsers)
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="relative rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-gray-700/30">
        <iframe
          src={`${post.url}embed/`}
          width="400"
          height="500"
          frameBorder="0"
          scrolling="no"
          className="w-full h-[500px] rounded-2xl"
          loading="lazy"
          onError={() => setHasError(true)}
          allow="encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
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
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
         
          <h2 className="text-6xl md:text-8xl font-extralight mb-8 leading-tight" style={{ color: '#021400' }}>
            Join Our
            <br />
            <span className="font-light">
              Community
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed tracking-wide" style={{ color: '#021400' }}>
            Stay connected with our latest updates, insights, and behind-the-scenes content. 
            Follow us on Instagram for real-time project showcases and industry expertise.
          </p>
        </div>

        {/* Instagram Posts Grid - Sleek and Minimal */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto mb-20">
          {communityPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative flex-1 max-w-md mx-auto"
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Minimal Card Container */}
              <div className="relative">
                {/* Instagram Embed */}
                <InstagramEmbedWithFallback post={post} />

                {/* Minimal Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-2xl">
                  <h3 className="text-white font-light text-lg mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                    {post.description}
                  </p>
                  
                  {/* Simple Tags */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#021400' }}></div>
                    <span className="text-gray-400 text-xs">@geokits_</span>
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-400 text-xs">GIS Showcase</span>
                  </div>
                </div>
              </div>
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
              className="group relative inline-flex items-center gap-3 px-10 py-4 text-white font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ backgroundColor: '#021400' }}
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
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
          </div>
          
          {/* Subtitle */}
          <p className="mt-6 text-sm" style={{ color: '#021400' }}>
            Join our growing community of GIS professionals and enthusiasts
          </p>
        </div>
      </div>
    </section>
  );
}
