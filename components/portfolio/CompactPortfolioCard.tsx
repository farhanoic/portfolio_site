"use client";

import { motion } from 'framer-motion';
import { User, ExternalLink, Github, Play, Eye } from 'lucide-react';
import { PortfolioProject } from '@/types/portfolio';

interface CompactPortfolioCardProps {
  project: PortfolioProject;
  onClick: () => void;
}

export default function CompactPortfolioCard({ project, onClick }: CompactPortfolioCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Design':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Video':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Marketing':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Development':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="w-40 sm:w-44 md:w-48 flex-shrink-0 dashboard-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Compact Thumbnail */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {project.thumbnail ? (
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">
              {project.category}
            </span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="w-5 h-5 text-white" />
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">
              Featured
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-1.5 py-0.5 text-xs rounded border ${getCategoryColor(project.category)}`}>
            {project.category}
          </span>
        </div>

        {/* Action Icons */}
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <Github className="w-3 h-3" />
            </a>
          )}
          {project.videoUrl && (
            <div className="p-1.5 bg-black/50 rounded-full text-white">
              <Play className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-2 sm:p-3 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="flex items-center text-xs text-muted-foreground pt-1 border-t border-border">
          {project.client && (
            <span className="flex items-center space-x-1 w-full">
              <User className="w-3 h-3" />
              <span className="truncate">{project.client}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}