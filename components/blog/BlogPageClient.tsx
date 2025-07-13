"use client";

import { motion } from "framer-motion";
import { BlogGrid } from "./BlogGrid";
import { CategoryFilter } from "./CategoryFilter";
import type { BlogPost, BlogCategory } from "@/types/blog";

interface BlogPageClientProps {
  blogPosts: BlogPost[];
  blogCategories: BlogCategory[];
  selectedCategory?: string;
  currentPage: number;
  totalPages: number;
}

export function BlogPageClient({ 
  blogPosts, 
  blogCategories, 
  selectedCategory, 
  currentPage, 
  totalPages 
}: BlogPageClientProps) {
  return (
    <main className="min-h-screen pt-16 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Blog &{" "}
            <span className="text-primary">Insights</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharing knowledge, experiences, and insights about web development, design, and the creative process.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <CategoryFilter 
            categories={blogCategories}
            selectedCategory={selectedCategory}
          />
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {blogPosts.length > 0 ? (
            <BlogGrid 
              posts={blogPosts}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedCategory={selectedCategory}
            />
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground">No blog posts yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedCategory 
                  ? `No posts found in the selected category.` 
                  : `I'm working on creating great content. Check back soon!`
                }
              </p>
              {selectedCategory && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <a
                    href="/blog"
                    className="inline-flex items-center space-x-2 text-primary hover:underline"
                  >
                    <span>View all posts</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}