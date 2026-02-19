"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
import type { DevelopmentProject, CreativeProject } from '@/types/projects';
import ProjectModal from '@/components/portfolio/ProjectModal';
import YouTubeStatsWrapper from '@/components/ui/YouTubeStatsWrapper';

// Union type for projects that can be displayed in modals
type DisplayableProject = DevelopmentProject | CreativeProject;

// Helper functions to check project types
function isDevelopmentProject(project: DisplayableProject): project is DevelopmentProject {
  return 'projectName' in project && 'techStack' in project;
}

function isCreativeProject(project: DisplayableProject): project is CreativeProject {
  return 'kind' in project && 'durationType' in project;
}

interface ShowcaseClientProps {
  developmentProjects: DevelopmentProject[];
  creativeProjects: CreativeProject[];
}

export function ShowcaseClient({ developmentProjects, creativeProjects }: ShowcaseClientProps) {
  const [selectedProject, setSelectedProject] = useState<DisplayableProject | null>(null);
  const [activeTab, setActiveTab] = useState<'Developer' | 'Editor' | 'Creator'>('Editor');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);


  // YouTube stats are now only used in Creator tab via YouTubeStatsWrapper component

  const updateUrlTab = (tab: 'Developer' | 'Editor' | 'Creator', mode: 'replace' | 'push' = 'replace') => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    if (mode === 'replace') {
      window.history.replaceState(null, '', url.toString());
    } else {
      window.history.pushState(null, '', url.toString());
    }
  };

  // Check URL parameter to set initial tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'Creator' || tabParam === 'Editor' || tabParam === 'Developer') {
        setActiveTab(tabParam as 'Developer' | 'Editor' | 'Creator');
      } else {
        updateUrlTab('Editor', 'replace');
      }
    }
  }, []);

  // No transformation needed - projects are already in the correct format

  // Tab configuration
  const tabs = [
    {
      id: 'Developer' as const,
      label: 'Developer',
      icon: Code,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'Editor' as const,
      label: 'Editor',
      icon: Edit3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'Creator' as const,
      label: 'Creator',
      icon: Camera,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    }
  ];

  // Get current tab configuration
  const currentTab = tabs.find(tab => tab.id === activeTab)!;

  // Get unique clients from creative projects with their logos
  const uniqueClients = Array.from(
    new Map(
      creativeProjects
        .filter(project => project.clientName)
        .map(project => [project.clientName, { name: project.clientName, logo: project.clientLogo }])
    ).values()
  ).sort((a, b) => a.name!.localeCompare(b.name!));

  // Filter creative projects by selected client
  const filteredCreativeProjects = selectedClient 
    ? creativeProjects.filter(project => project.clientName === selectedClient)
    : creativeProjects;



  // Developer Tech Stack
  const developerStack = {
    languages: [
      { name: 'TypeScript', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'Python', level: 'Expert' },
      { name: 'HTML', level: 'Expert' },
      { name: 'CSS', level: 'Expert' },
      { name: 'SQL', level: 'Expert' }
    ],
    frameworks: [
      { name: 'Next.js', level: 'Expert' },
      { name: 'React', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' }
    ],
    uiLibraries: [
      { name: 'shadcn/ui', level: 'Expert' },
      { name: 'Radix UI', level: 'Expert' },
      { name: 'Framer Motion', level: 'Expert' },
      { name: 'Recharts', level: 'Expert' }
    ],
    developmentTools: [
      { name: 'TypeScript', level: 'Expert' },
      { name: 'ESLint', level: 'Expert' },
      { name: 'Prettier', level: 'Expert' },
      { name: 'Webpack', level: 'Expert' },
      { name: 'TanStack React Query', level: 'Expert' },
      { name: 'React Hook Form', level: 'Expert' }
    ],
    database: [
      { name: 'PostgreSQL', level: 'Expert' },
      { name: 'Supabase', level: 'Expert' },
      { name: 'Redis', level: 'Intermediate' }
    ],
    services: [
      { name: 'Google APIs', level: 'Expert' },
      { name: 'Vercel Analytics', level: 'Expert' },
      { name: 'Vercel', level: 'Expert' }
    ]
  };


  // Projects are already separated by type

  const handleProjectClick = (project: DisplayableProject) => {
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    updateUrlTab(tab.id, 'push');
                  }}
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
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {/* Languages */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          📚 LANGUAGES
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
                          🚀 FRAMEWORKS
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

                      {/* UI Libraries & Components */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          🎨 UI LIBRARIES & COMPONENTS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.uiLibraries.map((lib, index) => (
                            <motion.div
                              key={lib.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{lib.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                lib.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {lib.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Development Tools & Build */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          🔧 DEVELOPMENT TOOLS & BUILD
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.developmentTools.map((tool, index) => (
                            <motion.div
                              key={tool.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
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

                      {/* Database & Backend */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          🗄️ DATABASE & BACKEND
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.database.map((db, index) => (
                            <motion.div
                              key={db.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{db.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                db.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {db.level.charAt(0)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Services & Hosting */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          🌐 SERVICES & HOSTING
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {developerStack.services.map((service, index) => (
                            <motion.div
                              key={service.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-muted/50 rounded-md border border-border"
                            >
                              <span className="text-sm font-medium text-foreground">{service.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                service.level === 'Expert' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {service.level.charAt(0)}
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
                      {/* Creative Tools */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          CREATIVE TOOLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Photoshop', level: 'Expert' },
                            { name: 'Premiere Pro', level: 'Expert' },
                            { name: 'After Effects', level: 'Expert' },
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
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-center mb-8">Creative Projects</h2>
                
                {/* Client Filter Tags */}
                {uniqueClients.length > 0 && (
                  <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                      {/* All Projects Button */}
                      <motion.button
                        onClick={() => setSelectedClient(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedClient === null
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        All Clients ({creativeProjects.length})
                      </motion.button>
                      
                      {/* Client Filter Buttons */}
                      {uniqueClients.map((client) => {
                        const clientProjectCount = creativeProjects.filter(p => p.clientName === client.name).length;
                        return (
                          <motion.button
                            key={client.name}
                            onClick={() => setSelectedClient(client.name!)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              selectedClient === client.name
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {client.logo && (
                              <img 
                                src={client.logo} 
                                alt={`${client.name} logo`}
                                className="w-5 h-5 object-contain rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <span>{client.name} ({clientProjectCount})</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="max-w-7xl mx-auto">
                  {filteredCreativeProjects.length > 0 ? (
                    <>
                      {/* Landscape Videos Section */}
                      {(() => {
                        const landscapeProjects = filteredCreativeProjects.filter(p => p.kind === 'Landscape');
                        return landscapeProjects.length > 0 ? (
                          <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-foreground">
                                Landscape Videos
                                <span className="ml-2 text-sm text-muted-foreground">({landscapeProjects.length})</span>
                              </h3>
                            </div>
                            <div className="overflow-x-auto pb-4">
                              <div className="flex space-x-4" style={{ width: 'max-content' }}>
                                {landscapeProjects.map((project, index) => (
                                  <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="dashboard-card overflow-hidden group hover:shadow-lg transition-all duration-300 flex-shrink-0 w-80"
                                    onClick={() => handleProjectClick(project)}
                                  >
                                    {/* Landscape Thumbnail */}
                                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden aspect-video">
                                      {project.thumbnail ? (
                                        <img 
                                          src={project.thumbnail} 
                                          alt={project.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Video className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                      )}
                                      
                                      {/* Play Overlay */}
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                          <Play className="w-6 h-6 text-gray-900 ml-1" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-4">
                                      <h4 className="font-bold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {project.name}
                                      </h4>
                                      
                                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                          {project.kind}
                                        </span>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                          {project.durationType}
                                        </span>
                                      </div>

                                      {project.clientName && (
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                          {project.clientLogo && (
                                            <img 
                                              src={project.clientLogo} 
                                              alt={`${project.clientName} logo`}
                                              className="w-3 h-3 object-contain rounded"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          )}
                                          <span className="truncate">{project.clientName}</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {/* Vertical Videos (Reels/Shorts) Section */}
                      {(() => {
                        const reelsProjects = filteredCreativeProjects.filter(p => p.kind === 'Reels');
                        return reelsProjects.length > 0 ? (
                          <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-foreground">
                                Vertical Videos - Reels/Shorts
                                <span className="ml-2 text-sm text-muted-foreground">({reelsProjects.length})</span>
                              </h3>
                            </div>
                            <div className="overflow-x-auto pb-4">
                              <div className="flex space-x-4" style={{ width: 'max-content' }}>
                                {reelsProjects.map((project, index) => (
                                  <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="dashboard-card overflow-hidden group hover:shadow-lg transition-all duration-300 flex-shrink-0 w-64"
                                    onClick={() => handleProjectClick(project)}
                                  >
                                    {/* Vertical Thumbnail */}
                                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden aspect-[9/16]">
                                      {project.thumbnail ? (
                                        <img 
                                          src={project.thumbnail} 
                                          alt={project.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Video className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                      )}
                                      
                                      {/* Play Overlay */}
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                          <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="p-3">
                                      <h4 className="font-bold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {project.name}
                                      </h4>
                                      
                                      <div className="flex flex-col space-y-1 text-xs text-muted-foreground mb-2">
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-center">
                                          {project.kind}
                                        </span>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-center">
                                          {project.durationType}
                                        </span>
                                      </div>

                                      {project.clientName && (
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                          {project.clientLogo && (
                                            <img 
                                              src={project.clientLogo} 
                                              alt={`${project.clientName} logo`}
                                              className="w-3 h-3 object-contain rounded"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          )}
                                          <span className="truncate">{project.clientName}</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </>
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
                      {/* Creator Skills */}
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          CREATOR SKILLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Video Editing', level: 'Expert' },
                            { name: 'Thumbnail Design', level: 'Expert' },
                            { name: 'Branding', level: 'Expert' },
                            { name: 'Story Telling', level: 'Expert' },
                            { name: 'SEO', level: 'Expert' },
                            { name: 'Script Writing', level: 'Expert' }
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
              {developmentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {developmentProjects.map((project, index) => (
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
                          alt={project.projectName}
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
                          {project.siteLink && (
                            <a
                              href={project.siteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
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
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {/* Client Info */}
                      {project.clientName && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            {project.clientLogo && (
                              <img 
                                src={project.clientLogo} 
                                alt={`${project.clientName} logo`}
                                className="w-6 h-6 object-contain rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Client:</span> {project.clientName}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Technologies */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.slice(0, 4).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 text-xs bg-muted/50 text-foreground rounded border"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border">
                                +{project.techStack.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex space-x-3">
                        {project.siteLink && (
                          <a
                            href={project.siteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live Site</span>
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
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

        {/* Subtle Contact Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t border-border/50"
        >
          <a
            href="/hire-me#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Like what you see? Let's work together →
          </a>
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
