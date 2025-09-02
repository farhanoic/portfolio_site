"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Tag, Wrench, Globe } from 'lucide-react';
import { ClientResource } from '@/components/pages/ResourcesClient';
import ResourceIcon from '@/components/ui/ResourceIcon';

interface ResourceModalProps {
  resource: ClientResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceModal({ resource, isOpen, onClose }: ResourceModalProps) {
  if (!resource) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add escape key listener
  React.useEffect(() => {
    const handleKeyDownWithCallback = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDownWithCallback);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDownWithCallback);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDownWithCallback);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border border-border rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <ResourceIcon icon={resource.icon} size="large" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-2xl font-bold text-foreground truncate">
                      {resource.name}
                    </h2>
                    {resource.featured && (
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span>{resource.toolType || 'Tool'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0 ml-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">About this tool</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Use Cases */}
              {resource.useCases.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Use Cases
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {resource.blogPosts && resource.blogPosts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    My Blog Posts
                  </h3>
                  <div className="space-y-2">
                    {resource.blogPosts.map((post, index) => (
                      <a
                        key={index}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted/80 border border-border rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Category</h3>
                <div className="inline-flex items-center px-3 py-1.5 text-sm bg-accent/10 text-accent-foreground border border-accent/20 rounded-full">
                  {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t border-border">
              {/* Main Tool Link */}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Tool</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}