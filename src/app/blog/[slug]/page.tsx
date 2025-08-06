import { blogPosts } from '@/lib/blogData'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-green-400">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image Placeholder */}
            <div className="relative h-96 mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Featured Image</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .split('\n')
                    .map(line => {
                      // Handle headers
                      if (line.startsWith('# ')) {
                        return `<h1 class="text-3xl font-bold text-white mt-12 mb-6">${line.slice(2)}</h1>`
                      }
                      if (line.startsWith('## ')) {
                        return `<h2 class="text-2xl font-bold text-white mt-10 mb-4">${line.slice(3)}</h2>`
                      }
                      if (line.startsWith('### ')) {
                        return `<h3 class="text-xl font-bold text-green-400 mt-8 mb-3">${line.slice(4)}</h3>`
                      }
                      
                      // Handle bold text
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return `<p class="font-bold text-green-400 mt-6 mb-3">${line.slice(2, -2)}</p>`
                      }
                      
                      // Handle regular paragraphs
                      if (line.trim() && !line.startsWith('#')) {
                        return `<p class="mb-4">${line}</p>`
                      }
                      
                      return ''
                    })
                    .join('')
                }}
              />
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 hover:bg-green-500/20 text-gray-300 hover:text-green-400 px-4 py-2 rounded-full text-sm transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-16 text-center">
              <Link
                href="/#blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Articles
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
