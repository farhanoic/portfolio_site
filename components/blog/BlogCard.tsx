"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="dashboard-card overflow-hidden group hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] bg-muted overflow-hidden">
          {post.featuredImage && post.featuredImage !== "" ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-lg text-muted-foreground font-medium">
                {post.category.name}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span 
              className="px-2 py-1 text-xs font-medium rounded-full text-white backdrop-blur-sm"
              style={{ 
                backgroundColor: post.category.color || '#3B82F6',
                opacity: 0.9 
              }}
            >
              {post.category.name}
            </span>
          </div>

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-medium rounded-full">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="w-3 h-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded hover:bg-primary/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Read More */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-primary font-medium group-hover:underline">
              Read article
            </span>
            <svg 
              className="w-4 h-4 text-primary transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}