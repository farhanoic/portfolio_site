"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogCard } from './BlogCard';
import type { BlogPost } from '@/types/blog';

interface BlogGridProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
}

export function BlogGrid({ posts, currentPage, totalPages, selectedCategory }: BlogGridProps) {
  const generatePaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    return `/blog${queryString ? `?${queryString}` : ''}`;
  };

  const renderPaginationNumbers = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      items.push(
        <Link
          key={1}
          href={generatePaginationUrl(1)}
          className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
        >
          1
        </Link>
      );
      if (start > 2) {
        items.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm text-muted-foreground">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      items.push(
        <Link
          key={i}
          href={generatePaginationUrl(i)}
          className={`px-3 py-2 text-sm border rounded-md transition-colors ${
            i === currentPage
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-muted'
          }`}
        >
          {i}
        </Link>
      );
    }

    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm text-muted-foreground">
            ...
          </span>
        );
      }
      items.push(
        <Link
          key={totalPages}
          href={generatePaginationUrl(totalPages)}
          className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
        >
          {totalPages}
        </Link>
      );
    }

    return items;
  };

  return (
    <div className="space-y-12">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <BlogCard key={post._id} post={post} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          {/* Previous Button */}
          {currentPage > 1 && (
            <Link
              href={generatePaginationUrl(currentPage - 1)}
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </Link>
          )}

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {renderPaginationNumbers()}
          </div>

          {/* Next Button */}
          {currentPage < totalPages && (
            <Link
              href={generatePaginationUrl(currentPage + 1)}
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        Showing {posts.length} of {totalPages * 9} articles
        {selectedCategory && (
          <span> in "{selectedCategory}"</span>
        )}
      </motion.div>
    </div>
  );
}