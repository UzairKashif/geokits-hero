"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

interface InstagramDisplayProps {
  mediaIds?: string[];
  showRecent?: boolean;
  limit?: number;
}

export default function InstagramDisplay({ 
  mediaIds, 
  showRecent = true, 
  limit = 6 
}: InstagramDisplayProps) {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramMedia = async () => {
      try {
        setLoading(true);
        
        if (mediaIds && mediaIds.length > 0) {
          // Fetch specific media by IDs
          const mediaPromises = mediaIds.map(async (id) => {
            const response = await fetch(`/api/instagram-media?media_id=${id}`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          });
          
          const results = await Promise.all(mediaPromises);
          setMedia(results.filter(Boolean));
        } else if (showRecent) {
          // Fetch recent media
          const response = await fetch(`/api/instagram-media?limit=${limit}`);
          
          if (response.ok) {
            const data = await response.json();
            setMedia(data.data || []);
          } else {
            throw new Error('Failed to fetch Instagram media');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramMedia();
  }, [mediaIds, showRecent, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <div 
            key={index}
            className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-500 opacity-60 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <p className="text-gray-600 mb-4">Unable to load Instagram content</p>
        <p className="text-sm text-gray-500">{error}</p>
        <a
          href="https://www.instagram.com/geokits_/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm rounded-full hover:shadow-lg transition-all"
        >
          View on Instagram
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <InstagramMediaCard key={item.id} media={item} />
      ))}
    </div>
  );
}

function InstagramMediaCard({ media }: { media: InstagramMedia }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatCaption = (caption: string) => {
    if (!caption) return '';
    return caption.length > 100 ? caption.substring(0, 100) + '...' : caption;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Media Container */}
      <div className="relative aspect-square overflow-hidden">
        {media.media_type === 'VIDEO' ? (
          <div className="relative w-full h-full">
            {!isPlaying ? (
              <div className="relative w-full h-full">
                <Image
                  src={media.thumbnail_url || media.media_url}
                  alt="Instagram video thumbnail"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>
              </div>
            ) : (
              <video
                src={media.media_url}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
                onPause={() => setIsPlaying(false)}
              />
            )}
          </div>
        ) : (
          <Image
            src={media.media_url}
            alt="Instagram post"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Media Type Badge */}
        <div className="absolute top-3 right-3">
          {media.media_type === 'VIDEO' && (
            <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Video
            </div>
          )}
          {media.media_type === 'CAROUSEL_ALBUM' && (
            <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9a1 1 0 000 2h.01a1 1 0 100-2H3zM6 9a1 1 0 000 2h12a1 1 0 100-2H6zM3 15a1 1 0 100 2h12a1 1 0 100-2H3z"/>
              </svg>
              Album
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">@geokits_</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(media.timestamp)}</span>
        </div>

        {media.caption && (
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {formatCaption(media.caption)}
          </p>
        )}

        <a
          href={media.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View on Instagram
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
