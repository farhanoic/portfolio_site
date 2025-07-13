import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/sanity-data";
import { BlogPost } from "@/components/blog/BlogPost";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogPostPageClient } from "@/components/blog/BlogPostPageClient";
import { unstable_noStore } from 'next/cache';
import type { BlogPost as BlogPostType } from "@/types/blog";

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  const { slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug);
    
    if (!post) {
      return {
        title: "Post Not Found - Farhan Azhar",
        description: "The blog post you're looking for could not be found.",
      };
    }

    const metaDescription = post.seo?.metaDescription || post.excerpt;
    const ogImage = post.seo?.ogImage || post.featuredImage;

    return {
      title: `${post.title} - Farhan Azhar`,
      description: metaDescription,
      keywords: post.seo?.keywords || post.tags,
      authors: [{ name: post.author.name }],
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      openGraph: {
        title: post.title,
        description: metaDescription,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post._updatedAt,
        authors: [post.author.name],
        tags: post.tags,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: metaDescription,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return {
      title: "Blog Post - Farhan Azhar",
      description: "Read the latest insights and tutorials.",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  const { slug } = await params;
  let blogPost: BlogPostType | null = null;
  let relatedPosts: BlogPostType[] = [];

  try {
    // Fetch blog post and related posts
    const [post, related] = await Promise.all([
      getBlogPostBySlug(slug),
      getRelatedBlogPosts(slug, 3)
    ]);
    
    blogPost = post;
    relatedPosts = related;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  if (!blogPost) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "description": blogPost.excerpt,
    "image": blogPost.featuredImage,
    "author": {
      "@type": "Person",
      "name": blogPost.author.name,
      "url": blogPost.author.website,
    },
    "publisher": {
      "@type": "Person",
      "name": "Farhan Azhar",
      "url": "https://farhanoic.me",
    },
    "datePublished": blogPost.publishedAt,
    "dateModified": blogPost._updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://farhanoic.me/blog/${slug}`,
    },
    "keywords": blogPost.tags?.join(", "),
    "articleSection": blogPost.category.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <BlogPostPageClient 
        blogPost={blogPost}
        relatedPosts={relatedPosts}
      />
    </>
  );
}