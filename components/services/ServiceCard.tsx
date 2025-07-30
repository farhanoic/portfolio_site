"use client";

import { motion } from "framer-motion";
import { ServiceCardProps } from "@/types/services";
import { urlFor } from "@/lib/sanity";

export default function ServiceCard({ item, onClick }: ServiceCardProps) {

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(item)}
      className="dashboard-card p-4 sm:p-6 space-y-3 sm:space-y-4 cursor-pointer group hover:border-primary transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted rounded border border-border overflow-hidden">
        <img
          src={typeof item.thumbnail === 'string' ? item.thumbnail : urlFor(item.thumbnail).width(400).height(225).url()}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {item.filter.name}
          </span>
        </div>
        
        {/* Price */}
        <span className="text-xs sm:text-sm font-medium text-primary">
          {item.price}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {item.description}
      </p>


      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{item.duration}</span>
        </div>
        
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-center space-x-1 text-xs text-primary"
        >
          <span>View Details</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-primary">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}