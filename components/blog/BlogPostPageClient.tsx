"use client";

import { motion } from "framer-motion";
import { BlogPost } from "./BlogPost";
import { RelatedPosts } from "./RelatedPosts";
import { ShareButtons } from "./ShareButtons";
import type { BlogPost as BlogPostType } from "@/types/blog";

interface BlogPostPageClientProps {
  blogPost: BlogPostType;
  relatedPosts: BlogPostType[];
}

export function BlogPostPageClient({ blogPost, relatedPosts }: BlogPostPageClientProps) {
  return (
    <main className="min-h-screen pt-16">
      {/* Blog Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <BlogPost post={blogPost} />
      </motion.div>

      {/* Share Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-6 py-8"
      >
        <ShareButtons 
          title={blogPost.title}
          url={`https://farhanoic.me/blog/${blogPost.slug}`}
          excerpt={blogPost.excerpt}
        />
      </motion.div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto px-6 py-16"
        >
          <RelatedPosts posts={relatedPosts} />
        </motion.div>
      )}
    </main>
  );
}