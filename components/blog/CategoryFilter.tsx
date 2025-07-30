"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { BlogCategory } from '@/types/blog';

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory?: string;
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const allCategories = [
    { name: 'All', slug: '', color: '#6B7280' },
    ...categories
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {allCategories.map((category, index) => {
        const isSelected = selectedCategory === category.slug || (!selectedCategory && category.slug === '');
        
        return (
          <motion.div
            key={category.slug || 'all'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={category.slug ? `/blog?category=${category.slug}` : '/blog'}
              className={`
                relative px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 min-h-[44px] flex items-center justify-center
                ${isSelected 
                  ? 'text-white shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
                }
              `}
              style={isSelected ? { 
                backgroundColor: category.color || '#3B82F6',
                borderColor: category.color || '#3B82F6'
              } : {}}
            >
              {category.name}
              
              {/* Active indicator */}
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: category.color || '#3B82F6' }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}