import { blogPosts } from '@/lib/blogData'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((post) => post.slug === slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}
