"use client";

import React from "react";
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

    // Add a small safety delay to ensure any ongoing animations are complete
    requestAnimationFrame(() => {
      cleanupAndNavigate(`/blog/${post.slug}`);
    });
  };

  return (
    <div onClick={handleClick}>
      <article className="group relative bg-gray-800 border border-gray-700 hover:border-gray-600 overflow-hidden h-[500px] cursor-pointer transform-gpu transition-all duration-500">
        {/* Blog Badge */}
        <div className="absolute top-8 left-8 z-20 bg-white text-gray-900 px-4 py-2 text-sm font-light tracking-wide">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Category Badge */}
        <div className="absolute top-8 right-8 z-20 text-gray-400 text-xs font-light tracking-wide uppercase">
          {post.category}
        </div>

        {/* Image Container */}
        <div className="relative h-60 overflow-hidden bg-gray-900">
          {post.img_url ? (
            <img
              src={post.img_url}
              alt={post.title}
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transform group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <p className="text-sm">Blog Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 h-60 flex flex-col">
          <h3 className="text-xl font-light text-white mb-3 tracking-tight line-clamp-2">
            {post.title}
          </h3>

          <p className="text-base text-gray-300 leading-relaxed mb-4 flex-grow line-clamp-3 tracking-normal">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-light">
            <div className="flex items-center gap-4">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {post.readTime}
              </span>
            </div>
            <span className="text-gray-400">{post.author}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-gray-400 font-light">
                {tag}
                {i < Math.min(post.tags.length, 3) - 1 && " •"}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 font-light">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Hover Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gray-800 border-t border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-light tracking-wide hover:text-white transition-colors duration-300">
              Read article →
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
