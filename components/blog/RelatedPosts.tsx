"use client";

import { motion } from 'framer-motion';
import { BlogCard } from './BlogCard';
import type { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Related Articles
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore more insights and tutorials on similar topics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <BlogCard key={post._id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}