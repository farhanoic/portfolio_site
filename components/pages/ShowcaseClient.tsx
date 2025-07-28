"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Star, 
  Calendar, 
  ExternalLink, 
  Github, 
  Play, 
  Users,
  Video,
  Award,
  Target,
  TrendingUp,
  Code,
  Edit3,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import type { PortfolioProject as SanityPortfolioProject } from '@/lib/sanity-data';
import type { PortfolioProject } from '@/types/portfolio';
import { categorizeWorkType } from '@/types/portfolio';
import ProjectModal from '@/components/portfolio/ProjectModal';
import YouTubeStatsWrapper from '@/components/ui/YouTubeStatsWrapper';

// Transform Sanity data to component format
function transformSanityProject(project: SanityPortfolioProject): PortfolioProject {
  return {
    id: project._id,
    title: project.title,
    slug: project.slug,
    longDescription: project.longDescription,
    category: project.category.name,
    workType: project.workType || categorizeWorkType(project.category.name),
    thumbnail: project.thumbnail ? urlFor(project.thumbnail).width(600).height(400).url() : '',
    videoUrl: project.videoUrl,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    client: project.client,
    technologies: project.technologies || [],
    featured: project.featured,
    createdAt: project._createdAt
  };
}

interface ShowcaseClientProps {
  portfolioProjects: SanityPortfolioProject[];
}

export function ShowcaseClient({ portfolioProjects }: ShowcaseClientProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeTab, setActiveTab] = useState<'Developer' | 'Editor' | 'Creator'>('Developer');

  // Transform projects
  const transformedProjects = portfolioProjects.map(transformSanityProject);

  // Tab configuration
  const tabs = [
    {
      id: 'Developer' as const,
      label: 'Developer',
      icon: Code,
      workType: 'Development' as const,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'Editor' as const,
      label: 'Editor',
      icon: Edit3,
      workType: 'Creative' as const,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'Creator' as const,
      label: 'Creator',
      icon: Camera,
      workType: 'Content' as const,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    }
  ];

  // Get current tab configuration
  const currentTab = tabs.find(tab => tab.id === activeTab)!;



  // Developer Tech Stack
  const developerStack = {
    languages: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Python', level: 'Intermediate' }
    ],
    frameworks: [
      { name: 'React', level: 'Expert' },
      { name: 'Next.js', level: 'Expert' },
      { name: 'Node.js', level: 'Intermediate' }
    ],
    tools: [
      { name: 'Git', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'VS Code', level: 'Expert' }
    ],
    aiTools: [
      { name: 'Claude Code', level: 'Expert' },
      { name: 'GitHub Copilot', level: 'Expert' },
      { name: 'ChatGPT', level: 'Intermediate' }
    ]
  };


  // Get Development projects from Sanity data
  const developerProjects = transformedProjects.filter(project => 
    project.workType === 'Development'
  );

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex justify-center">
            <div className="bg-muted/50 p-1 rounded-xl backdrop-blur-sm border border-border flex flex-row">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? `${tab.bgColor} ${tab.color} border ${tab.borderColor}`
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Tab Description */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-4"
          >
            <p className="text-sm text-muted-foreground">
              {activeTab === 'Developer' && 'Showcasing development projects, technical skills, and software solutions'}
              {activeTab === 'Editor' && 'Creative projects, video editing work, and visual storytelling'}
              {activeTab === 'Creator' && 'Content creation, YouTube channel, and community engagement'}
            </p>
          </motion.div>
        </motion.div>

        {/* Developer Stack & YouTube Stats Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            {/* Developer Stack - Only show for Developer tab */}
            {activeTab === 'Developer' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="max-w-6xl mx-auto px-4">
                  <div className="dashboard-card p-4 md:p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Development Stack</h2>
                    
                    <div className="space-y-4">
                      {/* Languages */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          LANGUAGES
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.languages.map((lang, index) => (
                            <motion.div
                              key={lang.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{lang.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                lang.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {lang.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Frameworks */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          FRAMEWORKS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.frameworks.map((framework, index) => (
                            <motion.div
                              key={framework.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{framework.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                framework.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {framework.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.tools.map((tool, index) => (
                            <motion.div
                              key={tool.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{tool.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                tool.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {tool.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* AI Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          AI TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.aiTools.map((aiTool, index) => (
                            <motion.div
                              key={aiTool.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{aiTool.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                aiTool.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {aiTool.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Skill Level Legend */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">E</span>
                            <span>Expert</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">I</span>
                            <span>Intermediate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Creative Stack - Only show for Editor tab */}
            {activeTab === 'Editor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="max-w-6xl mx-auto px-4">
                  <div className="dashboard-card p-4 md:p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Creative Stack</h2>
                    
                    <div className="space-y-4">
                      {/* Design Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          DESIGN TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Photoshop', level: 'Expert' },
                            { name: 'Illustrator', level: 'Expert' },
                            { name: 'Figma', level: 'Expert' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{item.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                item.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {item.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Video & Motion */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          VIDEO & MOTION
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Premiere Pro', level: 'Expert' },
                            { name: 'After Effects', level: 'Intermediate' },
                            { name: 'Motion Graphics', level: 'Intermediate' }
                          ].map((tool, index) => (
                            <motion.div
                              key={tool.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{tool.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                tool.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {tool.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* AI Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          AI TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Adobe Sensei', level: 'Intermediate' },
                            { name: 'Midjourney', level: 'Expert' },
                            { name: 'Runway ML', level: 'Intermediate' }
                          ].map((strategy, index) => (
                            <motion.div
                              key={strategy.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{strategy.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                strategy.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {strategy.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Skill Level Legend */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">E</span>
                            <span>Expert</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">I</span>
                            <span>Intermediate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Creative Projects Section - Only show for Editor tab */}
            {activeTab === 'Editor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-center mb-8">Creative Projects</h2>
                <div className="max-w-6xl mx-auto">
                  {transformedProjects.filter(project => project.workType === 'Creative').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {transformedProjects
                        .filter(project => project.workType === 'Creative')
                        .map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                          className="dashboard-card overflow-hidden group hover:shadow-lg transition-all duration-300"
                          onClick={() => handleProjectClick(project)}
                        >
                          {/* Project Thumbnail */}
                          <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                            {project.thumbnail ? (
                              <img 
                                src={project.thumbnail} 
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback to gradient background if image fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Edit3 className="w-12 h-12 text-muted-foreground/50" />
                              </div>
                            )}
                            
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex space-x-3">
                                {project.demoUrl && (
                                  <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                                {project.videoUrl && (
                                  <a
                                    href={project.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Play className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Project Info */}
                          <div className="p-6">
                            <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {project.longDescription}
                            </p>
                            
                            {/* Technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                  Tools Used
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies.slice(0, 4).map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="px-2 py-1 text-xs bg-muted/50 text-foreground rounded border"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                  {project.technologies.length > 4 && (
                                    <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border">
                                      +{project.technologies.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Links */}
                            <div className="flex space-x-3">
                              {project.demoUrl && (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View Project</span>
                                </a>
                              )}
                              {project.videoUrl && (
                                <a
                                  href={project.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted/50 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Play className="w-3 h-3" />
                                  <span>Watch</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No Creative Projects</h3>
                      <p className="text-muted-foreground">
                        Creative projects will appear here once they are added to the CMS.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Creator Stack - Only show for Creator tab */}
            {activeTab === 'Creator' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <div className="max-w-6xl mx-auto px-4">
                  <div className="dashboard-card p-4 md:p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Creator Stack</h2>
                    
                    <div className="space-y-4">
                      {/* Content Creation */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          CONTENT CREATION
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'YouTube', level: 'Expert' },
                            { name: 'Video Editing', level: 'Expert' },
                            { name: 'Storytelling', level: 'Expert' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{item.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                item.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {item.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Production Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          PRODUCTION TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'OBS Studio', level: 'Expert' },
                            { name: 'DaVinci Resolve', level: 'Intermediate' },
                            { name: 'Audacity', level: 'Expert' }
                          ].map((tool, index) => (
                            <motion.div
                              key={tool.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{tool.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                tool.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {tool.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Content Strategy */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          CONTENT STRATEGY
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'SEO', level: 'Expert' },
                            { name: 'Analytics', level: 'Intermediate' },
                            { name: 'Audience Growth', level: 'Expert' }
                          ].map((strategy, index) => (
                            <motion.div
                              key={strategy.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{strategy.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                strategy.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {strategy.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Skill Level Legend */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">E</span>
                            <span>Expert</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">I</span>
                            <span>Intermediate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* YouTube Stats - Only show for Creator tab */}
            {activeTab === 'Creator' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-6xl mx-auto px-4"
              >
                <YouTubeStatsWrapper channelUrl="https://www.youtube.com/@farhanoic" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Developer Projects Section - Only show for Developer tab */}
        {activeTab === 'Developer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Development Projects</h2>
            <div className="max-w-6xl mx-auto">
              {developerProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {developerProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="dashboard-card overflow-hidden group hover:shadow-lg transition-all duration-300"
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Project Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                      {project.thumbnail ? (
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to gradient background if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-3">
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {project.longDescription}
                      </p>
                      
                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 4).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 text-xs bg-muted/50 text-foreground rounded border"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex space-x-3">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live Site</span>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted/50 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Development Projects</h3>
                  <p className="text-muted-foreground">
                    Development projects will appear here once they are added to the CMS.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}



        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 py-12 border-t border-border"
        >
          <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Interested in collaborating? I'm always open to discussing new projects, 
            creative ideas, or opportunities to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hire-me"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Hire Me
            </Link>
            <a
              href="mailto:hello@farhanoic.me"
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleModalClose}
      />
    </div>
  );
}