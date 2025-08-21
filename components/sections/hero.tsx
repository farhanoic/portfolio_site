"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Grid, Code, Github, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import CompactPortfolioCard from "@/components/portfolio/CompactPortfolioCard";
import ProjectModal from "@/components/portfolio/ProjectModal";
import YouTubeStats from "@/components/ui/YouTubeStats";
import { urlFor } from "@/lib/sanity";
import { clientShowcaseConfig } from "@/lib/client-data";
import type { DevelopmentProject, CreativeProject } from "@/types/projects";
import type { CreativeClient } from "@/types/clients";

// Hero component props interface
interface HeroProps {
  developmentProjects?: DevelopmentProject[];
  creativeProjects?: CreativeProject[];
  creativeClients?: CreativeClient[];
}

// Custom hook for typing effect
function useTypingEffect(roles: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startTyping = useCallback(() => {
    setIsStarted(true);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    const currentRole = roles[currentRoleIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (currentText.length < currentRole.length) {
          setCurrentText(currentRole.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start deleting after pause
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentRoleIndex, isDeleting, roles, typingSpeed, deletingSpeed, pauseDuration, isStarted]);

  return { currentText, startTyping };
}


// Typing text component with cursor
function TypingText({ roles, delay = 0 }: { roles: string[]; delay?: number }) {
  const { currentText, startTyping } = useTypingEffect(roles);
  const [showCursor, setShowCursor] = useState(true);

  // Start typing after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      startTyping();
    }, delay);
    return () => clearTimeout(timer);
  }, [startTyping, delay]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-white">
      {currentText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
        |
      </span>
    </span>
  );
}

// Terminal Footer Component with code compilation animation
function TerminalFooter({ animationDelay = 0 }: { animationDelay?: number }) {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Get current date for last updated
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const commands = [
    { 
      command: '$ git status',
      output: [
        'On branch main',
        'Your branch is up to date with \'origin/main\''
      ],
      delay: 1500
    },
    {
      command: '$ git log --oneline -1', 
      output: [
        'a3b7f92 Update portfolio projects and optimize animations'
      ],
      delay: 1200
    },
    {
      command: '$ npm run build',
      output: [
        '✅ Building production bundle...',
        '✅ Optimizing components...',
        '✅ Portfolio compiled successfully!'
      ],
      delay: 2000
    },
    {
      command: '$ date',
      output: [
        `Last updated: ${lastUpdated}`
      ],
      delay: 1000
    },
    {
      command: '$ echo "Thanks for visiting! 🚀"',
      output: [
        'Thanks for visiting! 🚀'
      ],
      delay: 1500
    },
    {
      command: '$ whoami',
      output: [
        'Farhan Azhar - Full Stack Developer & Creator'
      ],
      delay: 2000
    }
  ];

  // Typing animation hook
  const useTypingAnimation = (text: string, speed: number = 80) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (index < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.slice(0, index + 1));
          setIndex(index + 1);
        }, speed);
        return () => clearTimeout(timeout);
      }
    }, [text, index, speed]);

    useEffect(() => {
      setDisplayText('');
      setIndex(0);
    }, [text]);

    return displayText;
  };

  // Main animation loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      const animateSequence = async () => {
        for (let i = 0; i < commands.length; i++) {
          setCurrentCommand(i);
          setIsTyping(true);
          
          // Type command
          await new Promise(resolve => {
            let charIndex = 0;
            const typeCommand = () => {
              if (charIndex <= commands[i].command.length) {
                setCurrentText(commands[i].command.slice(0, charIndex));
                charIndex++;
                setTimeout(typeCommand, 80);
              } else {
                resolve(void 0);
              }
            };
            typeCommand();
          });

          setIsTyping(false);
          await new Promise(resolve => setTimeout(resolve, commands[i].delay));
        }

        // Reset and loop
        await new Promise(resolve => setTimeout(resolve, 3000));
        setCurrentCommand(0);
        setCurrentText('');
        runAnimation();
      };

      timeoutId = setTimeout(() => {
        animateSequence();
      }, animationDelay * 1000);
    };

    runAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animationDelay]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentCommand, currentText]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className="w-full"
    >
      <div className="bg-card overflow-hidden border-t border-border">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-muted-foreground text-xs font-mono">Terminal - farhanoic.me</div>
          <div className="w-16"></div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="px-4 pt-4 pb-8 font-mono text-xs leading-tight h-[140px] overflow-auto scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {commands.slice(0, currentCommand).map((cmd, index) => (
            <div key={index} className="mb-1">
              <div className="text-primary">{cmd.command}</div>
              {cmd.output.map((line, lineIndex) => (
                <div 
                  key={lineIndex} 
                  className={`ml-0 text-xs ${
                    line.includes('✅') ? 'text-green-400' : 
                    line.includes('Last updated') ? 'text-primary' :
                    line.includes('Thanks for visiting') ? 'text-accent-foreground' :
                    line.includes('Farhan Azhar') ? 'text-primary' :
                    'text-foreground'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
          
          {/* Current typing command */}
          <div className="text-primary">
            {currentText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
              {isTyping ? '|' : ''}
            </span>
          </div>

          {/* Current command output */}
          {!isTyping && currentCommand < commands.length && (
            <div className="mt-1">
              {commands[currentCommand].output.map((line, lineIndex) => (
                <div 
                  key={lineIndex} 
                  className={`${
                    line.includes('✅') ? 'text-green-400' : 
                    line.includes('Last updated') ? 'text-primary' :
                    line.includes('Thanks for visiting') ? 'text-accent-foreground' :
                    line.includes('Farhan Azhar') ? 'text-primary' :
                    'text-foreground'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Featured Creative Projects component showing landscape and vertical videos
function FeaturedCreativeProjects({ projects = [], animationDelay = 0, onProjectClick }: { projects?: CreativeProject[]; animationDelay?: number; onProjectClick?: (project: CreativeProject) => void }) {
  // Debug logging
  console.log('🎬 FeaturedCreativeProjects received projects:', projects.length);
  console.log('🎬 Projects data:', projects.map(p => ({ name: p.name, featured: p.featured, kind: p.kind })));

  // Filter and separate featured projects by kind
  const featuredProjects = projects.filter(project => project.featured);
  console.log('🎬 Featured projects found:', featuredProjects.length);
  
  // If no featured projects, show recent projects instead
  const projectsToShow = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 7);
  const landscapeProjects = projectsToShow.filter(project => project.kind === 'Landscape').slice(0, 3);
  const verticalProjects = projectsToShow.filter(project => project.kind === 'Reels').slice(0, 4);

  console.log('🎬 Landscape projects to show:', landscapeProjects.length);
  console.log('🎬 Vertical projects to show:', verticalProjects.length);

  // Don't render if no projects at all
  if (projectsToShow.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className="w-full space-y-8"
    >
      {/* Landscape Videos Section */}
      {landscapeProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + 0.2 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {featuredProjects.length > 0 ? 'Featured ' : 'Recent '}Landscape Videos ({landscapeProjects.length})
            </h3>
            <div className="w-20 h-px bg-purple-500/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {landscapeProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: animationDelay + 0.4 + index * 0.1,
                  ease: "easeOut"
                }}
                className="dashboard-card overflow-hidden bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group cursor-pointer"
                whileHover={{ y: -4 }}
                onClick={() => onProjectClick?.(project)}
              >
                {/* Project Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-500/10 to-purple-600/10 overflow-hidden">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid className="w-8 h-8 text-purple-400/50" />
                    </div>
                  )}
                  
                  {/* Overlay with play button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-0 h-0 border-l-[8px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors text-sm sm:text-base line-clamp-1">
                    {project.name}
                  </h4>
                  
                  {/* Client info */}
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                      {project.clientLogo ? (
                        <img src={project.clientLogo} alt={project.clientName} className="w-3 h-3 rounded-full object-cover" />
                      ) : (
                        <span className="text-purple-400 text-xs">•</span>
                      )}
                    </div>
                    <span>{project.clientName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vertical Videos Section */}
      {verticalProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + 0.4 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {featuredProjects.length > 0 ? 'Featured ' : 'Recent '}Vertical Videos - Reels/Shorts ({verticalProjects.length})
            </h3>
            <div className="w-20 h-px bg-purple-500/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {verticalProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: animationDelay + 0.6 + index * 0.1,
                  ease: "easeOut"
                }}
                className="dashboard-card overflow-hidden bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group cursor-pointer"
                whileHover={{ y: -4 }}
                onClick={() => onProjectClick?.(project)}
              >
                {/* Project Thumbnail - Vertical aspect ratio */}
                <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-500/10 to-purple-600/10 overflow-hidden">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid className="w-6 h-6 text-purple-400/50" />
                    </div>
                  )}
                  
                  {/* Overlay with play button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-0 h-0 border-l-[6px] border-l-gray-900 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-3 space-y-2">
                  <h4 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors text-xs sm:text-sm line-clamp-2">
                    {project.name}
                  </h4>
                  
                  {/* Client info */}
                  <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <div className="w-3 h-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                      {project.clientLogo ? (
                        <img src={project.clientLogo} alt={project.clientName} className="w-2 h-2 rounded-full object-cover" />
                      ) : (
                        <span className="text-purple-400 text-xs">•</span>
                      )}
                    </div>
                    <span className="truncate">{project.clientName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Client Showcase component with cycling animation
function ClientShowcase({ clients = [], animationDelay = 0 }: { clients?: CreativeClient[]; animationDelay?: number }) {
  const [currentSet, setCurrentSet] = useState(0);

  // Create client display sets from real Sanity data
  const clientSets = clients.length > 0 
    ? [clients.slice(0, 4), clients.slice(4, 8), clients.slice(8, 12), clients.slice(12, 16)].filter(set => set.length > 0)
    : [];

  // Cycle through client sets using configurable duration
  useEffect(() => {
    if (clientSets.length > 1) {
      const interval = setInterval(() => {
        setCurrentSet((prev) => (prev + 1) % clientSets.length);
      }, clientShowcaseConfig.cycleDuration);
      return () => clearInterval(interval);
    }
  }, [clientSets.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animationDelay }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: animationDelay + 0.2 }}
        className="text-center"
      >
        <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">
          {clientShowcaseConfig.headerText}
        </h3>
        <div className="w-16 h-px bg-purple-500/30 mx-auto"></div>
      </motion.div>

      {/* Animated Client Grid or Empty State */}
      <div className="relative min-h-[120px] sm:min-h-[100px] flex items-center justify-center">
        {clientSets.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSet}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  duration: clientShowcaseConfig.animationDuration,
                  ease: "easeInOut",
                  staggerChildren: 0.1
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl"
              >
                {clientSets[currentSet]?.map((client, index) => (
                  <motion.div
                    key={`${currentSet}-${client.clientSlug}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * clientShowcaseConfig.staggerDelay,
                      ease: "easeOut"
                    }}
                    className="relative group"
                  >
                    {/* Client Card */}
                    <div className="dashboard-card p-3 sm:p-4 text-center bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                      <div className="space-y-2">
                        {/* Client Logo */}
                        {client.clientLogo && (
                          <div className="w-8 h-8 mx-auto mb-2 relative">
                            <img 
                              src={client.clientLogo} 
                              alt={`${client.clientName} logo`}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        )}
                        
                        {/* Client Name */}
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                          {client.clientName}
                        </h4>
                        
                        {/* Subtle accent line */}
                        <div className="w-8 h-px bg-purple-500/30 mx-auto group-hover:bg-purple-500/60 transition-colors"></div>
                        
                        {/* Project count */}
                        <span className="text-xs text-muted-foreground group-hover:text-purple-300 transition-colors">
                          {client.projectCount} {client.projectCount === 1 ? 'project' : 'projects'}
                        </span>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>

                    {/* Floating particles effect on hover */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Cycle indicators */}
            {clientSets.length > 1 && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {clientSets.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSet 
                        ? 'bg-purple-500 scale-125' 
                        : 'bg-purple-500/30 hover:bg-purple-500/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentSet(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="dashboard-card p-6 text-center bg-purple-500/5 border-purple-500/20 w-full max-w-md">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Grid className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">No Clients Yet</h4>
              <p className="text-xs text-muted-foreground">Client showcase will appear here once projects are added to the CMS.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Professional Timeline component matching showcase page design
function Timeline({ items, animationDelay = 0 }: { items: any[]; animationDelay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className="w-full max-w-4xl mx-auto"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Professional Journey</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 md:-ml-0.5 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: animationDelay + 0.5 + index * 0.1 }}
            className={`relative flex items-center mb-6 sm:mb-8 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-1/2 md:-ml-2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
            
            {/* Content */}
            <div className={`ml-12 md:ml-0 md:w-1/2 ${
              index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
            }`}>
              <div className="dashboard-card p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.type === 'ongoing' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : item.type === 'milestone'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {item.dateRange}
                  </span>
                  {item.type === 'ongoing' && (
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary border border-primary/30 rounded">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-primary font-medium mb-2">{item.company}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero({ developmentProjects = [], creativeProjects = [], creativeClients = [] }: HeroProps) {
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | CreativeProject | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("Hero component mounted - animations should start");
    console.log("🎯 Hero received developmentProjects:", developmentProjects.length);
    console.log("🎯 Hero received creativeProjects:", creativeProjects.length);
    console.log("🎯 Hero received creativeClients:", creativeClients.length);
  }, []);

  // Sort projects by featured status and creation date
  const sortedDevelopmentProjects = developmentProjects
    .sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
  const sortedCreativeProjects = creativeProjects
    .sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleProjectClick = (project: DevelopmentProject | CreativeProject) => {
    setSelectedProject(project);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
  };

  // Roles for typing effect
  const roles = [
    "Developer",
    "Video Specialist", 
    "Branding & Marketing",
    "Content Creator"
  ];

  // Animation variants for better control
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        staggerChildren: 0.3
      }
    }
  };

  const nameVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.0
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        delay: 0.4
      }
    }
  };

  // Split name into letters for animation
  const farhanLetters = "Farhan".split("");
  const azharLetters = "Azhar".split("");

  // Creative skills organized by categories
  const creativeSkills = {
    "Design Tools": [
      { name: "Photoshop", level: "Expert" },
      { name: "Illustrator", level: "Expert" },
      { name: "Figma", level: "Expert" }
    ],
    "Video & Motion": [
      { name: "Premiere Pro", level: "Expert" },
      { name: "After Effects", level: "Intermediate" },
      { name: "Motion Graphics", level: "Intermediate" }
    ],
    "AI Tools": [
      { name: "Adobe Sensei", level: "Intermediate" },
      { name: "Midjourney", level: "Expert" },
      { name: "Runway ML", level: "Intermediate" }
    ]
  };

  // Development skills organized by categories
  const developmentSkills = {
    "Languages": [
      { name: "JavaScript", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "Python", level: "Intermediate" }
    ],
    "Frameworks": [
      { name: "React", level: "Expert" },
      { name: "Next.js", level: "Expert" },
      { name: "Node.js", level: "Intermediate" }
    ],
    "Tools": [
      { name: "Git", level: "Expert" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "VS Code", level: "Expert" }
    ]
  };

  // Creator skills organized by categories
  const creatorSkills = {
    "Content Creation": [
      { name: "YouTube", level: "Expert" },
      { name: "Video Editing", level: "Expert" },
      { name: "Storytelling", level: "Expert" }
    ],
    "Production Tools": [
      { name: "OBS Studio", level: "Expert" },
      { name: "DaVinci Resolve", level: "Intermediate" },
      { name: "Audacity", level: "Expert" }
    ],
    "Content Strategy": [
      { name: "SEO", level: "Expert" },
      { name: "Analytics", level: "Intermediate" },
      { name: "Audience Growth", level: "Expert" }
    ]
  };

  // Helper function to get proficiency level colors
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "border-muted-foreground/50 text-muted-foreground";
      case "Intermediate":
        return "border-muted-foreground/50 text-muted-foreground";
      default:
        return "border-muted-foreground/30 text-muted-foreground";
    }
  };
  

  // Work timeline data matching showcase page
  const timelineItems = [
    {
      id: 1,
      dateRange: "2025",
      title: "Freelancer & Content Creator",
      company: "Independent",
      type: "ongoing",
      description: "Full-time freelancing and content creation across multiple platforms"
    },
    {
      id: 2,
      dateRange: "2024",
      title: "Video Editor",
      company: "IIT Madras",
      type: "completed",
      description: "Educational content and promotional videos for prestigious institution"
    },
    {
      id: 3,
      dateRange: "2023",
      title: "Video Editor",
      company: "Paradox Fest",
      type: "completed",
      description: "Professional video editing for events and promotional content"
    },
    {
      id: 4,
      dateRange: "2020",
      title: "YouTube Channel Launch",
      company: "Personal Brand",
      type: "milestone",
      description: "Started content creation journey with focus on tech and creativity"
    }
  ];
  const socialLinks = [
    { name: "GitHub", url: "https://github.com/farhanoic", icon: Github },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/farhanoic/", icon: Linkedin },
    { name: "X", url: "https://x.com/farhanoic", icon: Twitter },
    { name: "Instagram", url: "https://www.instagram.com/take2farhan/", icon: Instagram },
    { name: "YouTube", url: "https://www.youtube.com/@farhanoic", icon: Youtube },
  ];

  return (
    <>
    <section className="min-h-screen pt-14 sm:pt-16 flex items-center justify-center py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-12 max-w-4xl mx-auto"
          onAnimationStart={() => console.log("Container animation started")}
          onAnimationComplete={() => console.log("Container animation completed")}
        >
          {/* Photo */}
          <motion.div 
            variants={nameVariants}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Photo Container */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/20 overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-primary/30"
              >
                {/* Portfolio Image */}
                <Image
                  src="/images/portfolio-image.png"
                  alt="Farhan Azhar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.05, scale: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute -bottom-3 -left-3 w-6 h-6 bg-accent rounded-full"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.div 
            variants={nameVariants}
            className="text-center space-y-3"
          >
            {/* Horizontal Name */}
            <motion.h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {/* Hey, I'm text */}
              <motion.span
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                className="inline-block mr-3 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed font-normal"
              >
                Hey, I'm{" "}
              </motion.span>
              
              {/* Farhan - letter by letter */}
              <motion.span
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
                className="inline-block mr-3"
              >
                {farhanLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                    onAnimationComplete={() => console.log(`Letter ${letter} animated`)}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
              
              {/* Azhar - letter by letter with primary color */}
              <motion.span
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05, delayChildren: 0.4 }}
                className="inline-block text-primary"
              >
                {azharLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                    onAnimationComplete={() => console.log(`Letter ${letter} animated`)}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            {/* Brief intro */}
            <motion.p
              variants={subtitleVariants}
              className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-6"
              onAnimationComplete={() => console.log("Brief intro animation completed")}
            >
              I basically do a bunch of digital stuff. Video editing, design, built some web apps, and hit 500K total views{" "}
              <br className="hidden sm:inline" />
              on my YouTube channel.
            </motion.p>

            {/* Typing subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground"
              onAnimationComplete={() => console.log("Subtitle animation completed")}
            >
              Jack of all trades, master of... <TypingText roles={["getting things done!"]} delay={800} />
            </motion.p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-3"
          >
            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-muted-foreground">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.05 }}
                    whileHover={{ 
                      scale: 1.1, 
                      color: "var(--primary)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative hover:text-primary transition-all duration-300 p-3 rounded-full hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>



          {/* Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="w-full max-w-6xl space-y-8"
          >
            {/* Developer Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground"
            >
              Things I've built
            </motion.h2>

            {/* Developer description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.9 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
            >
              I use design thinking, AI tools, and just enough code to build things that work and solve real problems.
            </motion.p>

            {/* Moving Developer Skills Stripe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              className="relative overflow-hidden py-4 sm:py-6 bg-muted/50 rounded-xl sm:rounded-2xl border border-border"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10"></div>
              <motion.div
                className="flex space-x-6 whitespace-nowrap will-change-transform"
                animate={{
                  x: [-1920, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear',
                  },
                }}
                style={{ width: 'max-content' }}
              >
                {['JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Git', 'Tailwind CSS', 'VS Code', 'Claude Code', 'GitHub Copilot', 'ChatGPT', 'MongoDB', 'PostgreSQL', 'AWS', 'Vercel', 'Docker', 'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Git', 'Tailwind CSS', 'VS Code', 'Claude Code', 'GitHub Copilot', 'ChatGPT', 'MongoDB', 'PostgreSQL', 'AWS', 'Vercel', 'Docker', 'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Git', 'Tailwind CSS', 'VS Code', 'Claude Code', 'GitHub Copilot', 'ChatGPT', 'MongoDB', 'PostgreSQL', 'AWS', 'Vercel', 'Docker'].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 sm:px-5 sm:py-3 bg-green-500/10 rounded-full border border-green-500/30 shadow-sm hover:bg-green-500/20 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Featured Development Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              className="max-w-4xl mx-auto"
            >
              {sortedDevelopmentProjects.length > 0 ? (
                <div className="dashboard-card overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Featured Project</h3>
                      <Link
                        href="/showcase"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                      >
                        <span>View All</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Featured Project Card */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => handleProjectClick(sortedDevelopmentProjects[0])}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Project Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden rounded-lg">
                        {sortedDevelopmentProjects[0].thumbnail ? (
                          <img 
                            src={sortedDevelopmentProjects[0].thumbnail} 
                            alt={sortedDevelopmentProjects[0].projectName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Code className="w-12 h-12 text-muted-foreground/50" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="flex space-x-3">
                            {sortedDevelopmentProjects[0].siteLink && (
                              <div className="p-2 bg-white/90 rounded-full text-gray-900">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            )}
                            {sortedDevelopmentProjects[0].githubLink && (
                              <div className="p-2 bg-white/90 rounded-full text-gray-900">
                                <Github className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                            {sortedDevelopmentProjects[0].projectName}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {sortedDevelopmentProjects[0].description}
                          </p>
                        </div>
                        
                        {/* Technologies */}
                        {sortedDevelopmentProjects[0].techStack && sortedDevelopmentProjects[0].techStack.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Tech Stack
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {sortedDevelopmentProjects[0].techStack.slice(0, 6).map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/30"
                                >
                                  {tech}
                                </span>
                              ))}
                              {sortedDevelopmentProjects[0].techStack.length > 6 && (
                                <span className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground rounded-full border">
                                  +{sortedDevelopmentProjects[0].techStack.length - 6}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex space-x-3">
                          {sortedDevelopmentProjects[0].siteLink && (
                            <a
                              href={sortedDevelopmentProjects[0].siteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Live Site</span>
                            </a>
                          )}
                          {sortedDevelopmentProjects[0].githubLink && (
                            <a
                              href={sortedDevelopmentProjects[0].githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-4 h-4" />
                              <span>Source Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dashboard-card p-8">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Code className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">No Development Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        Development projects will appear here once they are added to the CMS.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* View Full Developer Portfolio Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              className="text-center"
            >
              <Link
                href="/showcase?tab=Developer"
                className="inline-flex items-center space-x-2 px-4 py-3 sm:px-6 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg transition-all duration-300 hover:scale-105 group min-h-[44px]"
              >
                <span className="text-xs sm:text-sm font-semibold">View Full Developer Portfolio</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Design/Video Editor Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.2 }}
            className="w-full max-w-6xl space-y-8"
          >
            {/* Design/Video Editor Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.4 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground"
            >
              Visual stuff
            </motion.h2>

            {/* Visual stuff description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
            >
              From raw footage to final upload, I handle the whole visual process. Video editing, motion graphics, thumbnails, branding, whatever the project needs.
            </motion.p>

            {/* Moving Creative Skills Stripe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.6 }}
              className="relative overflow-hidden py-4 sm:py-6 bg-muted/50 rounded-xl sm:rounded-2xl border border-border"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10"></div>
              <motion.div
                className="flex space-x-6 whitespace-nowrap will-change-transform"
                animate={{
                  x: [0, -1920],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 35,
                    ease: 'linear',
                  },
                }}
                style={{ width: 'max-content' }}
              >
                {['Photoshop', 'Illustrator', 'Figma', 'Premiere Pro', 'After Effects', 'Motion Graphics', 'Adobe Sensei', 'Midjourney', 'Runway ML', 'DaVinci Resolve', 'Final Cut Pro', 'Canva', 'InDesign', 'Lightroom', 'Blender', 'Cinema 4D', 'Sketch', 'XD', 'Photoshop', 'Illustrator', 'Figma', 'Premiere Pro', 'After Effects', 'Motion Graphics', 'Adobe Sensei', 'Midjourney', 'Runway ML', 'DaVinci Resolve', 'Final Cut Pro', 'Canva', 'InDesign', 'Lightroom', 'Blender', 'Cinema 4D', 'Sketch', 'XD', 'Photoshop', 'Illustrator', 'Figma', 'Premiere Pro', 'After Effects', 'Motion Graphics', 'Adobe Sensei', 'Midjourney', 'Runway ML', 'DaVinci Resolve', 'Final Cut Pro', 'Canva', 'InDesign', 'Lightroom', 'Blender', 'Cinema 4D', 'Sketch', 'XD'].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 sm:px-5 sm:py-3 bg-purple-500/10 rounded-full border border-purple-500/30 shadow-sm hover:bg-purple-500/20 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Featured Creative Projects */}
            <FeaturedCreativeProjects projects={creativeProjects} animationDelay={3.6} onProjectClick={handleProjectClick} />

            {/* Client Showcase */}
            <ClientShowcase clients={creativeClients} animationDelay={3.8} />

            {/* View Full Creative Portfolio Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.0 }}
              className="text-center"
            >
              <Link
                href="/showcase?tab=Editor"
                className="inline-flex items-center space-x-2 px-4 py-3 sm:px-6 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105 group min-h-[44px]"
              >
                <span className="text-xs sm:text-sm font-semibold">View Full Creative Portfolio</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>


          {/* Stories I've told Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.2 }}
            className="w-full max-w-6xl space-y-6 sm:space-y-8"
          >
            {/* Stories I've told Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.4 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground"
            >
              Stories I've told
            </motion.h2>

            {/* Stories I've told description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
            >
              From scripting to storytelling to figuring out what viewers want I've picked up some experience along the way. Never been the most consistent creator, but seeing comments from people who genuinely found value in my videos is pretty satisfying.
            </motion.p>

            {/* Moving Skills Stripe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.6 }}
              className="relative overflow-hidden py-4 sm:py-6 bg-muted/50 rounded-xl sm:rounded-2xl border border-border"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10"></div>
              <motion.div
                className="flex space-x-6 whitespace-nowrap will-change-transform"
                animate={{
                  x: [0, -1920],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 25,
                    ease: 'linear',
                  },
                }}
                style={{ width: 'max-content' }}
              >
                {['YouTube', 'Video Editing', 'Storytelling', 'OBS Studio', 'DaVinci Resolve', 'Audacity', 'SEO', 'Analytics', 'Audience Growth', 'Content Strategy', 'Premiere Pro', 'After Effects', 'Thumbnail Design', 'Script Writing', 'Live Streaming', 'Community Management', 'Brand Collaboration', 'YouTube', 'Video Editing', 'Storytelling', 'OBS Studio', 'DaVinci Resolve', 'Audacity', 'SEO', 'Analytics', 'Audience Growth', 'Content Strategy', 'Premiere Pro', 'After Effects', 'Thumbnail Design', 'Script Writing', 'Live Streaming', 'Community Management', 'Brand Collaboration', 'YouTube', 'Video Editing', 'Storytelling', 'OBS Studio', 'DaVinci Resolve', 'Audacity', 'SEO', 'Analytics', 'Audience Growth', 'Content Strategy', 'Premiere Pro', 'After Effects', 'Thumbnail Design', 'Script Writing', 'Live Streaming', 'Community Management', 'Brand Collaboration'].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center px-5 py-3 bg-primary/10 rounded-full border border-primary/30 shadow-sm hover:bg-primary/20 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

          </motion.div>

            {/* YouTube Stats - Full Width with End-to-End Padding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.8 }}
              className="w-full px-6 md:px-8 lg:px-12"
            >
              <YouTubeStats 
                channelUrl="https://www.youtube.com/@farhanoic" 
                className="bg-card/50 w-full"
                showVideos={false}
              />
            </motion.div>

            {/* View Full Creator Portfolio Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 4.0 }}
              className="text-center"
            >
              <Link
                href="/showcase?tab=Creator"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg transition-all duration-300 hover:scale-105 group"
              >
                <span className="text-sm font-semibold">View Full Creator Portfolio</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

          {/* Work Timeline Section */}
          <Timeline 
            items={timelineItems}
            animationDelay={4.2}
          />

        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleModalClose}
      />
    </section>

    {/* Bottom exploration note */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 4.4 }}
      className="py-8 text-center"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 border border-border rounded-full backdrop-blur-sm">
          {/* Live status indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
          
          <div className="w-px h-4 bg-border"></div>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Currently exploring the data science and AI space, always something new to figure out.
          </p>
        </div>
      </div>
    </motion.div>
    
    {/* Terminal Footer - Edge to Edge */}
    <TerminalFooter animationDelay={4.6} />
    </>
  );
}