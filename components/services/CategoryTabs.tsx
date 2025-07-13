"use client";

import { motion } from "framer-motion";
import { CategoryTabsProps } from "@/types/services";
import { urlFor } from "@/lib/sanity";

export default function CategoryTabs({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex justify-center"
    >
      <div className="flex bg-muted border border-border rounded-lg p-1 space-x-1">
        {categories.map((category, index) => (
          <motion.button
            key={category._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(category.slug)}
            className={`relative px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 ${
              selectedCategory === category.slug
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            {/* Icon */}
            {category.icon && (
              <div className="w-5 h-5 relative">
                <img
                  src={urlFor(category.icon).width(20).height(20).url()}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {/* Category Name */}
            <span className="text-sm md:text-base whitespace-nowrap">
              {category.name}
            </span>

            {/* Active Indicator */}
            {selectedCategory === category.slug && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-background border border-border rounded-md shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}