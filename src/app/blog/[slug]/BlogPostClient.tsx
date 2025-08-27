'use client'

import { useRouter } from 'next/navigation'
import { BlogPost } from '@/lib/blogData'

interface BlogPostClientProps {
  post: BlogPost
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter()

  const handleBackToHome = () => {
    // Navigate back to home page with a query parameter to indicate direct navigation to blog
    router.push('/?scrollTo=blog')
  }

  return (
    <div className="w-full bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 font-light tracking-wide cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to insights
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-40 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-left mb-16">
            <div className="mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                {post.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-8 leading-none tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed tracking-wide font-light">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Information */}
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-500 font-light">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-[0.1em]">Author</span>
              <span className="text-gray-300">{post.author}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-[0.1em]">Published</span>
              <span className="text-gray-300">{new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-[0.1em]">Read Time</span>
              <span className="text-gray-300">{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="w-full py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative h-96 mb-16 overflow-hidden bg-gray-800">
            {post.img_url ? (
              <img
                src={post.img_url}
                alt={post.title}
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-light">Featured Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="max-w-none">
            <div 
              className="text-gray-400 leading-relaxed tracking-wide font-light"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .split('\n')
                  .map(line => {
                    // Handle headers
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-4xl font-extralight text-white mt-16 mb-8 leading-tight">${line.slice(2)}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-3xl font-light text-white mt-12 mb-6 leading-tight">${line.slice(3)}</h2>`
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-2xl font-light text-gray-300 mt-10 mb-4">${line.slice(4)}</h3>`
                    }
                    
                    // Handle bold text
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return `<p class="font-light text-white mt-8 mb-4 text-lg">${line.slice(2, -2)}</p>`
                    }
                    
                    // Handle regular paragraphs
                    if (line.trim() && !line.startsWith('#')) {
                      return `<p class="mb-6 text-lg leading-relaxed">${line}</p>`
                    }
                    
                    return ''
                  })
                  .join('')
              }}
            />
          </div>

          {/* Tags Section */}
          <div className="mt-20 pt-12 border-t border-gray-800">
            <div className="mb-8">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Related Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 px-4 py-2 text-sm font-light tracking-wide transition-colors duration-300 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-20 pt-12 border-t border-gray-800">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to insights
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
