"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ExternalLink, Github, Play } from 'lucide-react';
import { PortfolioProject } from '@/types/portfolio';
import VideoEmbed from '@/components/ui/VideoEmbed';

interface ProjectModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-lg shadow-2xl w-[95vw] sm:w-[90vw] md:w-full max-w-4xl max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative">
              <div className="aspect-[16/9] sm:aspect-video bg-muted overflow-hidden">
                {project.videoUrl ? (
                  <VideoEmbed 
                    url={project.videoUrl}
                    title={`${project.title} - Demo Video`}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground font-medium">
                      {project.category}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-3 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category & Featured Badges */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex space-x-2">
                <span className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded border ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-primary text-primary-foreground rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto">
              {/* Title and Meta */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {project.title}
                    </h2>
                    {project.client && (
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{project.client}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">About This Project</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-muted border border-border rounded-md text-sm text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-border text-center space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Interested in similar work?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/hire-me"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Hire Me for Your Project
                  </a>
                  <a
                    href="mailto:hello@farhanoic.me"
                    className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}