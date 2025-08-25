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

    // Add a small safety delay to ensure any ongoing animations are complete
    requestAnimationFrame(() => {
      cleanupAndNavigate(`/blog/${post.slug}`);
    });
  };

  return (
    <div onClick={handleClick} className="bg-gray-800 p-12 cursor-pointer group">
      <article className="h-full flex flex-col">
        {/* Header with number and category */}
        <div className="flex items-start justify-between mb-8">
          <div className="bg-white text-[#021400] px-3 py-1 text-xs font-light tracking-wide">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="text-gray-500 text-xs font-light tracking-[0.1em] uppercase">
            {post.category}
          </div>
        </div>

        {/* Image Container */}
        <div className="relative h-48 mb-8 overflow-hidden bg-[#021400]">
          {post.img_url ? (
            <Image
              src={post.img_url}
              alt={post.title}
              fill
              className="object-cover filter grayscale group-hover:grayscale-0 transform group-hover:scale-105 transition-all duration-700"
              onError={(e) => {
                console.log('Image failed to load:', post.img_url);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#021400] flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
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
                <p className="text-sm font-light">Blog Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-2xl font-light text-white mb-4 tracking-tight leading-snug group-hover:text-gray-300 transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-gray-400 leading-relaxed mb-6 tracking-wide line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-xs text-gray-500 mb-6 font-light">
            <span className="flex items-center gap-2">
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
            <span className="flex items-center gap-2">
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

          {/* Author */}
          <div className="mb-6">
            <span className="text-gray-400 text-sm font-light tracking-wide">
              By {post.author}
            </span>
          </div>

          {/* Read More Link */}
          <div className="pt-4 border-t border-gray-700">
            <span className="text-gray-400 font-light tracking-wide group-hover:text-white transition-colors duration-300">
              Read article →
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
