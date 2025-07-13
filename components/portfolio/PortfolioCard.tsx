"use client";

import { motion } from 'framer-motion';
import { User, ExternalLink, Github, Play, Eye } from 'lucide-react';
import { PortfolioProject } from '@/lib/portfolio-data';

interface PortfolioCardProps {
  project: PortfolioProject;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

export default function PortfolioCard({ project, viewMode, onClick }: PortfolioCardProps) {
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

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="dashboard-card p-6 cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="relative w-full md:w-64 h-40 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-lg text-muted-foreground font-medium">
                {project.category}
              </span>
            </div>
            {project.featured && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                  Featured
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded border ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed line-clamp-2">
                {project.longDescription}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                {project.client && (
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{project.client}</span>
                  </span>
                )}
              </div>

              {/* Action Links */}
              <div className="flex items-center space-x-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.videoUrl && (
                  <div className="p-1 text-muted-foreground">
                    <Play className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="dashboard-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-lg text-muted-foreground font-medium">
            {project.category}
          </span>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="w-8 h-8 text-white" />
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
              Featured
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded border ${getCategoryColor(project.category)}`}>
            {project.category}
          </span>
        </div>

        {/* Action Icons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.videoUrl && (
            <div className="p-2 bg-black/50 rounded-full text-white">
              <Play className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.longDescription}
          </p>
        </div>

        {/* Meta Info */}
        {project.client && (
          <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="flex items-center space-x-1 truncate">
              <User className="w-3 h-3" />
              <span className="truncate">{project.client}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}