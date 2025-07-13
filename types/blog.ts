// Blog TypeScript Types for Sanity Integration
import type { BlogAuthor } from '@/lib/author-constants';

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
}


export interface BlogPostSEO {
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface BlogPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[]; // Portable Text content
  featuredImage: string | null;
  featuredImageAlt?: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags?: string[];
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readingTime?: number;
  seo?: BlogPostSEO;
  relatedPosts?: BlogPost[];
}

// Compact blog post type for listings and cards
export interface BlogPostPreview {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  featuredImageAlt?: string;
  author: {
    name: string;
    avatar: string;
  };
  category: {
    name: string;
    color: string;
  };
  tags?: string[];
  publishedAt: string;
  readingTime?: number;
  featured: boolean;
}

// Blog data structures for API responses
export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
}

export interface BlogCatalogData {
  categories: BlogCategory[];
  posts: BlogPost[];
}

// Search and filtering types
export interface BlogSearchParams {
  category?: string;
  tag?: string;
  query?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface BlogFilters {
  categories: BlogCategory[];
  tags: string[];
}

// Reading progress and time estimation
export interface ReadingStats {
  wordCount: number;
  readingTime: number;
  progress: number;
}

// Content block types for Portable Text
export interface ImageBlock {
  _type: 'image';
  asset: {
    url: string | null;
  };
  alt?: string;
  caption?: string;
}

export interface CodeBlock {
  _type: 'codeBlock';
  language: string;
  code: string;
  filename?: string;
}

export interface TextBlock {
  _type: 'block';
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  children: Array<{
    _type: 'span';
    text: string;
    marks?: string[];
  }>;
}

// Utility types
export type BlogContentBlock = TextBlock | ImageBlock | CodeBlock;

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

// Form types for future admin functionality
export interface CreateBlogPostForm {
  title: string;
  excerpt: string;
  content: any[];
  categoryId: string;
  tags: string[];
  featuredImage: File | null;
  status: 'draft' | 'published';
  featured: boolean;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}