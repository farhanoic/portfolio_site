"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { PortfolioProject } from '@/types/portfolio';
import CompactPortfolioCard from './CompactPortfolioCard';

interface CategorySectionProps {
  category: string;
  projects: PortfolioProject[];
  onProjectClick: (project: PortfolioProject) => void;
  index: number;
}

export default function CategorySection({ category, projects, onProjectClick, index }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Width of one card plus gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-3"
    >
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">
          {category} <span className="text-sm text-muted-foreground">• {projects.length} projects</span>
        </h3>
        
        {/* Navigation Buttons (Desktop only) */}
        {projects.length > 3 && (
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-1.5 rounded-full transition-colors ${
                canScrollLeft 
                  ? 'bg-muted hover:bg-muted/80 text-foreground' 
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-1.5 rounded-full transition-colors ${
                canScrollRight 
                  ? 'bg-muted hover:bg-muted/80 text-foreground' 
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Projects Horizontal Scroll */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {projects.map((project, projectIndex) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + projectIndex * 0.05 }}
            >
              <CompactPortfolioCard
                project={project}
                onClick={() => onProjectClick(project)}
              />
            </motion.div>
          ))}
        </div>

        {/* Gradient overlays for scroll indication (Desktop) */}
        {projects.length > 3 && (
          <>
            {canScrollLeft && (
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            )}
            {canScrollRight && (
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            )}
          </>
        )}
      </div>

      {/* Mobile scroll hint */}
      {projects.length > 2 && (
        <p className="md:hidden text-xs text-muted-foreground text-center">
          Swipe to see more projects →
        </p>
      )}
    </motion.div>
  );
}