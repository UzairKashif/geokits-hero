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
    <div className="w-full" style={{backgroundColor: '#021400'}}>
      {/* Header */}
      <header className="backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50" style={{backgroundColor: '#021400'}}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 font-light tracking-wide cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-40 px-6" style={{backgroundColor: '#021400'}}>
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
      <article className="w-full py-20 px-6" style={{backgroundColor: '#021400'}}>
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative h-96 mb-16 overflow-hidden bg-gray-800">
            {post.img_url ? (
              <img
                src={post.img_url}
                alt={post.title}
                className="w-full h-full object-cover hover:filter hover:grayscale transition-all duration-700"
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
              className="text-gray-400 leading-relaxed tracking-wide font-light prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .split('\n')
                  .map(line => {
                    const trimmedLine = line.trim();
                    
                    // Handle image syntax: ![alt text](url "caption")
                    const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^"]*?)(?:\s+"([^"]*)")?\)$/);
                    if (imageMatch) {
                      const [, altText, imageUrl, caption] = imageMatch;
                      return `
                        <div class="my-12 max-w-4xl mx-auto">
                          <div class="relative overflow-hidden bg-gray-800 rounded-lg">
                            <img 
                              src="${imageUrl}" 
                              alt="${altText}" 
                              class="w-full h-auto object-cover hover:filter hover:grayscale transition-all duration-700"
                              loading="lazy"
                            />
                          </div>
                          ${caption ? `<p class="text-center text-sm text-gray-500 mt-4 italic leading-relaxed">${caption}</p>` : ''}
                        </div>
                      `;
                    }

                    // Handle headers
                    if (trimmedLine.startsWith('# ')) {
                      return `<h1 class="text-4xl md:text-5xl font-extralight text-white mt-16 mb-8 leading-tight tracking-tight">${trimmedLine.slice(2)}</h1>`
                    }
                    if (trimmedLine.startsWith('## ')) {
                      return `<h2 class="text-3xl md:text-4xl font-light text-white mt-12 mb-6 leading-tight tracking-tight">${trimmedLine.slice(3)}</h2>`
                    }
                    if (trimmedLine.startsWith('### ')) {
                      return `<h3 class="text-2xl md:text-3xl font-light text-gray-300 mt-10 mb-4 leading-tight">${trimmedLine.slice(4)}</h3>`
                    }
                    if (trimmedLine.startsWith('#### ')) {
                      return `<h4 class="text-xl md:text-2xl font-light text-gray-300 mt-8 mb-3 leading-tight">${trimmedLine.slice(5)}</h4>`
                    }

                    // Handle bullet points and lists
                    if (trimmedLine.match(/^[-•*]\s+/)) {
                      const listItem = trimmedLine.replace(/^[-•*]\s+/, '');
                      return `<li class="text-gray-400 mb-2 ml-4 list-disc list-inside leading-relaxed">${listItem}</li>`
                    }

                    // Handle numbered lists
                    if (trimmedLine.match(/^\d+\.\s+/)) {
                      const listItem = trimmedLine.replace(/^\d+\.\s+/, '');
                      return `<li class="text-gray-400 mb-2 ml-4 list-decimal list-inside leading-relaxed">${listItem}</li>`
                    }

                    // Handle bold and italic text within paragraphs
                    let processedLine = trimmedLine;
                    
                    // Bold text **text**
                    processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                    
                    // Italic text *text*
                    processedLine = processedLine.replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>');
                    
                    // Code blocks `code`
                    processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">$1</code>');

                    // Handle special paragraph styles
                    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && !trimmedLine.includes('**', 2)) {
                      return `<p class="text-white font-semibold mt-8 mb-4 text-lg leading-relaxed">${trimmedLine.slice(2, -2)}</p>`
                    }

                    // Handle blockquotes
                    if (trimmedLine.startsWith('> ')) {
                      return `<blockquote class="border-l-4 border-gray-600 pl-4 italic text-gray-300 my-6 leading-relaxed">${trimmedLine.slice(2)}</blockquote>`
                    }

                    // Handle horizontal rules
                    if (trimmedLine === '---' || trimmedLine === '***') {
                      return `<hr class="border-gray-700 my-8">`
                    }

                    // Handle regular paragraphs
                    if (processedLine && !processedLine.startsWith('#') && !processedLine.match(/^[-•*]\s+/) && !processedLine.match(/^\d+\.\s+/)) {
                      return `<p class="mb-6 text-lg leading-relaxed text-gray-400">${processedLine}</p>`
                    }
                    
                    // Handle empty lines
                    if (!trimmedLine) {
                      return '<br class="my-2">'
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
