"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { ReadingProgress } from './ReadingProgress';
import type { BlogPost as BlogPostType } from '@/types/blog';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  };

  // Portable Text components for rich content rendering
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => (
        <div className="my-8">
          {value.asset?.url && value.asset.url !== "" ? (
            <Image
              src={value.asset.url}
              alt={value.alt || ''}
              width={800}
              height={600}
              className="rounded-lg w-full h-auto"
            />
          ) : (
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Image not available</span>
            </div>
          )}
          {value.caption && (
            <p className="text-sm text-muted-foreground text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      ),
      codeBlock: ({ value }: any) => (
        <div className="my-6">
          {value.filename && (
            <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-b border-border rounded-t-lg">
              {value.filename}
            </div>
          )}
          <pre className={`
            bg-muted p-4 rounded-lg overflow-x-auto text-sm
            ${value.filename ? 'rounded-t-none' : ''}
          `}>
            <code className={`language-${value.language || 'text'}`}>
              {value.code}
            </code>
          </pre>
        </div>
      ),
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-foreground">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-5 text-foreground">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-lg md:text-xl font-semibold mt-6 mb-3 text-foreground">
          {children}
        </h4>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
      normal: ({ children }: any) => (
        <p className="mb-4 leading-relaxed text-foreground">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
      number: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      code: ({ children }: any) => (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          target={value.blank ? '_blank' : '_self'}
          rel={value.blank ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <article className="min-h-screen">
      <ReadingProgress />
      
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center space-y-6"
          >
            {/* Category */}
            <div className="flex justify-center">
              <span 
                className="px-3 py-1 text-sm font-medium rounded-full text-white"
                style={{ backgroundColor: post.category.color || '#3B82F6' }}
              >
                {post.category.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
          </motion.header>

          {/* Featured Image */}
          {post.featuredImage && post.featuredImage !== "" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <PortableText 
              value={post.content} 
              components={portableTextComponents}
            />
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="flex items-center flex-wrap gap-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full hover:bg-primary/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </article>
  );
}