'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function BlogImage({ 
  src, 
  alt, 
  caption, 
  width = 1200, 
  height = 600, 
  className = '',
  priority = false 
}: BlogImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`my-12 max-w-4xl mx-auto ${className}`}>
      <div className="relative overflow-hidden bg-gray-800 rounded-lg">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
          </div>
        )}

        {/* Error State */}
        {hasError ? (
          <div className="flex items-center justify-center h-64 bg-gray-800">
            <div className="text-gray-500 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-light">Failed to load image</p>
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-auto object-cover hover:filter hover:grayscale transition-all duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            quality={90}
          />
        )}
      </div>

      {/* Caption */}
      {caption && !hasError && (
        <p className="text-center text-sm text-gray-500 mt-4 italic leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  )
}
