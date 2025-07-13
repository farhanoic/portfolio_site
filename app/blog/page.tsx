import { getBlogPosts, getBlogCategories } from "@/lib/sanity-data";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { unstable_noStore } from 'next/cache';
import type { BlogPost, BlogCategory } from "@/types/blog";

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export async function generateMetadata() {
  return {
    title: "Blog - Farhan Azhar",
    description: "Insights, tutorials, and thoughts on web development, design, and the creative process.",
    keywords: ["blog", "web development", "design", "tutorials", "programming", "creative process"],
    openGraph: {
      title: "Blog - Farhan Azhar",
      description: "Insights, tutorials, and thoughts on web development, design, and the creative process.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Farhan Azhar",
      description: "Insights, tutorials, and thoughts on web development, design, and the creative process.",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  const { category: selectedCategory, page = '1' } = await searchParams;
  const currentPage = parseInt(page);
  const postsPerPage = 9;

  let blogPosts: BlogPost[] = [];
  let blogCategories: BlogCategory[] = [];
  let totalPosts = 0;

  try {
    // Fetch blog data
    const [posts, categories] = await Promise.all([
      getBlogPosts({ 
        category: selectedCategory, 
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage 
      }),
      getBlogCategories()
    ]);
    
    blogPosts = posts.posts;
    totalPosts = posts.total;
    blogCategories = categories;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <BlogPageClient 
      blogPosts={blogPosts}
      blogCategories={blogCategories}
      selectedCategory={selectedCategory}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}