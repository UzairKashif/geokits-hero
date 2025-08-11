import { blogPosts } from '@/lib/blogData'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params
  const post = blogPosts.find((post) => post.slug === slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}
