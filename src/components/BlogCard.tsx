"use client";

import React from "react";
import Image from "next/image";
import { useNavigationCleanup } from "../hooks/useNavigationCleanup";
import { BlogPost } from "../lib/blogData";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const cleanupAndNavigate = useNavigationCleanup();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requestAnimationFrame(() => {
      cleanupAndNavigate(`/blog/${post.slug}`);
    });
  };

  return (
    <article 
      onClick={handleClick} 
      className="relative bg-white cursor-pointer overflow-hidden h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {post.img_url ? (
          <Image
            src={post.img_url}
            alt={post.title}
            fill
            className="object-cover filter grayscale"
            onError={(e) => {
              console.log('Image failed to load:', post.img_url);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-light">No Image</p>
            </div>
          </div>
        )}

        {/* Overlay with index */}
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 bg-[#021400] text-white flex items-center justify-center text-sm font-light">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-light tracking-wider uppercase text-[#021400]">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-light mb-4 leading-snug" style={{ color: '#021400' }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light flex-1">
          {post.excerpt}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Author */}
        <div className="mb-6">
          <span className="text-xs font-light text-gray-500 tracking-wide">
            By {post.author}
          </span>
        </div>

        {/* Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-light text-[#021400]">
            Read Article
          </span>
          <svg 
            className="w-4 h-4 text-[#021400]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}