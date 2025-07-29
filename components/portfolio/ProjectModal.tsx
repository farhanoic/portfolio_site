"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ExternalLink, Github, Play } from 'lucide-react';
import type { DevelopmentProject, CreativeProject } from '@/types/projects';

// Union type for projects that can be displayed in modals
type DisplayableProject = DevelopmentProject | CreativeProject;

// Helper functions to check project types
function isDevelopmentProject(project: DisplayableProject): project is DevelopmentProject {
  return 'projectName' in project && 'techStack' in project;
}

function isCreativeProject(project: DisplayableProject): project is CreativeProject {
  return 'kind' in project && 'durationType' in project;
}
import VideoEmbed from '@/components/ui/VideoEmbed';

interface ProjectModalProps {
  project: DisplayableProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  // Get project title based on type
  const getProjectTitle = (project: DisplayableProject): string => {
    return isDevelopmentProject(project) ? project.projectName : project.name;
  };

  // Get project description based on type
  const getProjectDescription = (project: DisplayableProject): string => {
    return isDevelopmentProject(project) ? project.description : `${project.kind} ${project.durationType} video project`;
  };

  // Get project technologies/tools based on type
  const getProjectTechnologies = (project: DisplayableProject): string[] | undefined => {
    return isDevelopmentProject(project) ? project.techStack : project.softwareTools;
  };

  // Get project client based on type
  const getProjectClient = (project: DisplayableProject): string | undefined => {
    return isDevelopmentProject(project) ? project.clientName : project.clientName;
  };

  // Get project demo URL based on type
  const getProjectDemoUrl = (project: DisplayableProject): string | undefined => {
    return isDevelopmentProject(project) ? project.siteLink : project.videoLink;
  };

  // Get project github URL based on type
  const getProjectGithubUrl = (project: DisplayableProject): string | undefined => {
    return isDevelopmentProject(project) ? project.githubLink : undefined;
  };

  // Get project type label
  const getProjectTypeLabel = (project: DisplayableProject): string => {
    if (isDevelopmentProject(project)) {
      return 'Development';
    } else {
      return `Creative - ${project.kind}`;
    }
  };

  const getCategoryColor = (project: DisplayableProject) => {
    if (isDevelopmentProject(project)) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    } else {
      return project.kind === 'Reels' 
        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
                {(isCreativeProject(project) && project.videoLink) ? (
                  <VideoEmbed 
                    url={project.videoLink}
                    title={`${getProjectTitle(project)} - Demo Video`}
                    className="w-full h-full"
                  />
                ) : project.thumbnail ? (
                  <img 
                    src={project.thumbnail} 
                    alt={getProjectTitle(project)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground font-medium">
                      {getProjectTypeLabel(project)}
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
                <span className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded border ${getCategoryColor(project)}`}>
                  {getProjectTypeLabel(project)}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-primary text-primary-foreground rounded">
                    Featured
                  </span>
                )}
                {isCreativeProject(project) && (
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded border ${
                    project.durationType === 'Short Form' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}>
                    {project.durationType}
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
                      {getProjectTitle(project)}
                    </h2>
                    {getProjectClient(project) && (
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{getProjectClient(project)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {getProjectDemoUrl(project) && (
                      <a
                        href={getProjectDemoUrl(project)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {isDevelopmentProject(project) ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Site</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Watch Video</span>
                          </>
                        )}
                      </a>
                    )}
                    {getProjectGithubUrl(project) && (
                      <a
                        href={getProjectGithubUrl(project)}
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
                  {getProjectDescription(project)}
                </p>
                {isCreativeProject(project) && project.clientName && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Client:</span> {project.clientName}
                    </p>
                  </div>
                )}
              </div>

              {/* Technologies/Tools */}
              {getProjectTechnologies(project) && getProjectTechnologies(project)!.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {isDevelopmentProject(project) ? 'Technologies Used' : 'Software & Tools Used'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getProjectTechnologies(project)!.map(tech => (
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

              {/* Subtle Contact Link */}
              <div className="pt-6 text-center border-t border-border/50">
                <a
                  href="/hire-me#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Interested in working together? Get in touch →
                </a>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}