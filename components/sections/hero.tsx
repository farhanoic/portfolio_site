"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Grid } from "lucide-react";
import CompactPortfolioCard from "@/components/portfolio/CompactPortfolioCard";
import ProjectModal from "@/components/portfolio/ProjectModal";
import { urlFor } from "@/lib/sanity";
import type { PortfolioProject as SanityPortfolioProject } from "@/lib/sanity-data";
import type { PortfolioProject } from "@/types/portfolio";
import { categorizeWorkType } from "@/types/portfolio";

// Transform Sanity data to component format
function transformSanityProject(project: SanityPortfolioProject): PortfolioProject {
  return {
    id: project._id,
    title: project.title,
    slug: project.slug,
    longDescription: project.longDescription,
    category: project.category.name,
    workType: project.workType || categorizeWorkType(project.category.name),
    thumbnail: project.thumbnail ? urlFor(project.thumbnail).width(400).height(300).url() : '',
    videoUrl: project.videoUrl,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    client: project.client,
    technologies: project.technologies || [],
    featured: project.featured,
    createdAt: project._createdAt
  };
}

// Hero component props interface
interface HeroProps {
  portfolioProjects?: SanityPortfolioProject[];
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


// Interactive Timeline component with scroll-based glow effect
function Timeline({ items, animationDelay = 0 }: { items: any[]; animationDelay?: number }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineElement = timelineRef.current;
      const timelineRect = timelineElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on timeline position relative to viewport
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      
      // Start filling when timeline enters bottom 70% of viewport
      // Complete when timeline exits top 30% of viewport  
      const startPoint = windowHeight * 0.7;
      const endPoint = -timelineHeight * 0.3;
      
      let progress = 0;
      if (timelineTop <= startPoint) {
        const scrollDistance = startPoint - timelineTop;
        const totalDistance = startPoint - endPoint;
        progress = Math.min(100, Math.max(0, (scrollDistance / totalDistance) * 100));
      }
      
      setScrollProgress(progress);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return (
    <motion.div
      ref={timelineRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: animationDelay }}
      className="w-full max-w-4xl mx-auto"
    >
      <h3 className="text-lg md:text-xl font-medium text-center text-primary border-b border-border pb-4 mb-8">
        Work Timeline
      </h3>
      
      <div className="relative">
        {/* Base timeline line */}
        <div className="absolute left-4 md:left-6 top-0 w-0.5 h-full bg-border z-0" />
        
        {/* Animated progress line with glow */}
        <div 
          className="absolute left-4 md:left-6 top-0 w-0.5 bg-gradient-to-b from-primary via-primary to-primary/50 z-10 transition-all duration-300 ease-out"
          style={{ 
            height: `${scrollProgress}%`,
            boxShadow: scrollProgress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        />
        
        {/* Glow point at progress end */}
        {scrollProgress > 0 && (
          <div 
            className="absolute left-3 md:left-5 w-2 h-2 bg-primary rounded-full z-20 transition-all duration-300 ease-out"
            style={{ 
              top: `${scrollProgress}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)',
              animation: scrollProgress > 0 ? 'pulse 2s infinite' : 'none'
            }}
          />
        )}
        
        {/* Timeline items */}
        <div className="space-y-8 md:space-y-10">
          {items.map((item, index) => {
            const itemProgress = (index + 1) / items.length * 100;
            const isActive = scrollProgress >= itemProgress;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: animationDelay + 0.5 + index * 0.2 }}
                className="relative flex items-start"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: animationDelay + 0.7 + index * 0.2 }}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                      item.type === 'ongoing' 
                        ? 'bg-primary border-primary shadow-lg shadow-primary/50' 
                        : isActive
                          ? 'bg-primary border-primary shadow-lg shadow-primary/50'
                          : 'bg-muted border-border'
                    }`}
                  />
                </div>
                
                {/* Timeline content */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`ml-6 md:ml-8 flex-1 dashboard-card p-6 md:p-8 space-y-4 md:space-y-5 transition-all duration-300 ${
                    isActive ? 'ring-1 ring-primary/20 shadow-lg shadow-primary/10' : ''
                  }`}
                >
                  {/* Date range badge */}
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                      item.type === 'ongoing'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-muted border border-border text-muted-foreground'
                    }`}>
                      {item.dateRange}
                    </span>
                    {item.type === 'ongoing' && (
                      <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {/* Job title and company */}
                  <div className="space-y-2 md:space-y-3">
                    <h4 className="text-sm md:text-base font-semibold text-foreground leading-tight">
                      {item.title}
                    </h4>
                    {item.company && (
                      <p className="text-sm text-primary font-medium">
                        {item.company}
                      </p>
                    )}
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </motion.div>
  );
}

export function Hero({ portfolioProjects = [] }: HeroProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("Hero component mounted - animations should start");
  }, []);

  // Transform portfolio projects and filter by work type
  const transformedProjects = portfolioProjects.map(transformSanityProject);
  
  const creativeProjects = transformedProjects
    .filter(project => project.workType === 'Creative')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const developmentProjects = transformedProjects
    .filter(project => project.workType === 'Development')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const contentProjects = transformedProjects
    .filter(project => project.workType === 'Content')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleProjectClick = (project: PortfolioProject) => {
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
  

  // Work timeline data
  const timelineItems = [
    {
      id: 1,
      dateRange: "2020 - Present",
      title: "My Own YouTube Channel",
      company: "",
      type: "ongoing",
      description: "Content creation and video production"
    },
    {
      id: 2,
      dateRange: "2023 - 2024",
      title: "Video Editor",
      company: "Paradox Fest",
      type: "completed",
      description: "Professional video editing for events"
    },
    {
      id: 3,
      dateRange: "2024 - 2025",
      title: "Video Editor",
      company: "IIT Madras",
      type: "completed",
      description: "Educational content and promotional videos"
    },
    {
      id: 4,
      dateRange: "2025 - Present",
      title: "Freelancer",
      company: "",
      type: "ongoing",
      description: "Independent creative and development projects"
    }
  ];
  const socialLinks = [
    { name: "GitHub", url: "https://github.com/farhanoic" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/farhanoic/" },
    { name: "X", url: "https://x.com/farhanoic" },
    { name: "Instagram", url: "https://www.instagram.com/take2farhan/" },
    { name: "YouTube", url: "https://www.youtube.com/@farhanoic" },
  ];

  return (
    <>
    <section className="min-h-screen pt-16 flex items-center justify-center py-8">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 max-w-4xl mx-auto"
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
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/20 overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-primary/30"
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
            <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight">
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

            {/* Typing subtitle */}
            <motion.p
              variants={subtitleVariants}
              className="text-base md:text-lg text-muted-foreground"
              onAnimationComplete={() => console.log("Subtitle animation completed")}
            >
              You can call me a <TypingText roles={roles} delay={800} />
            </motion.p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-3"
          >
            {/* Email */}
            <motion.a
              href="mailto:hello@farhanoic.me"
              whileHover={{ scale: 1.05 }}
              className="inline-block text-sm md:text-base text-primary font-medium hover:underline"
            >
              hello@farhanoic.me
            </motion.a>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, index) => (
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
                  className="relative hover:text-primary transition-all duration-300 text-xs md:text-sm px-2 py-1 rounded-md hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="space-y-3 max-w-2xl"
          >
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              I create modern digital experiences with clean code and thoughtful design. 
              Passionate about building products that are both beautiful and functional.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/80">
              5+ years experience turning ideas into reality.
            </p>
          </motion.div>

          {/* Section Separator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          />

          {/* Skills & Portfolio Pairs Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="w-full max-w-7xl mt-8 md:mt-16 space-y-12 lg:space-y-16"
          >
            {/* Creative Skills & Portfolio Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Creative Skills Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="dashboard-card p-5 md:p-8 space-y-5 h-fit"
              >
                <h3 className="text-sm md:text-base font-medium text-center text-primary border-b border-border pb-2">
                  Creative Stack
                </h3>
                <div className="space-y-4">
                  {Object.entries(creativeSkills).map(([category, skills], categoryIndex) => (
                    <div key={category} className="space-y-2">
                      {/* Category Header */}
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>
                      
                      {/* Skills in Category */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 2.1 + (categoryIndex * skills.length + skillIndex) * 0.05 }}
                            className="flex items-center space-x-1"
                          >
                            <span className={`px-3 py-1 bg-muted border rounded-md text-xs md:text-sm hover:scale-105 transition-all ${getProficiencyColor(skill.level)}`}>
                              {skill.name}
                            </span>
                            <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor(skill.level)} bg-muted/50`}>
                              {skill.level.charAt(0)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Proficiency Legend */}
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex justify-center items-center space-x-6 text-xs">
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Expert')} bg-muted/50`}>
                          E
                        </span>
                        <span className="text-muted-foreground">Expert</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Intermediate')} bg-muted/50`}>
                          I
                        </span>
                        <span className="text-muted-foreground">Intermediate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Creative Work Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="space-y-4"
              >
                {/* Header with View All Link */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-medium text-primary border-b border-border pb-2">
                    Creative Work
                  </h3>
                  <Link
                    href="/hire-me#portfolio"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Portfolio Cards Row */}
                {creativeProjects.length > 0 ? (
                  <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                    {creativeProjects.slice(0, 6).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 2.3 + index * 0.05 }}
                      >
                        <CompactPortfolioCard
                          project={project}
                          onClick={() => handleProjectClick(project)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                    <p>No creative projects available</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Development Skills & Portfolio Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Development Skills Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="dashboard-card p-5 md:p-8 space-y-5 h-fit"
              >
                <h3 className="text-sm md:text-base font-medium text-center text-primary border-b border-border pb-2">
                  Development Stack
                </h3>
                <div className="space-y-4">
                  {Object.entries(developmentSkills).map(([category, skills], categoryIndex) => (
                    <div key={category} className="space-y-2">
                      {/* Category Header */}
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>
                      
                      {/* Skills in Category */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 2.5 + (categoryIndex * skills.length + skillIndex) * 0.05 }}
                            className="flex items-center space-x-1"
                          >
                            <span className={`px-3 py-1 bg-muted border rounded-md text-xs md:text-sm hover:scale-105 transition-all ${getProficiencyColor(skill.level)}`}>
                              {skill.name}
                            </span>
                            <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor(skill.level)} bg-muted/50`}>
                              {skill.level.charAt(0)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Proficiency Legend */}
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex justify-center items-center space-x-6 text-xs">
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Expert')} bg-muted/50`}>
                          E
                        </span>
                        <span className="text-muted-foreground">Expert</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Intermediate')} bg-muted/50`}>
                          I
                        </span>
                        <span className="text-muted-foreground">Intermediate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Development Work Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="space-y-4"
              >
                {/* Header with View All Link */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-medium text-primary border-b border-border pb-2">
                    Development Work
                  </h3>
                  <Link
                    href="/hire-me#portfolio"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                {/* Portfolio Cards Row */}
                {developmentProjects.length > 0 ? (
                  <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                    {developmentProjects.slice(0, 6).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 2.7 + index * 0.05 }}
                      >
                        <CompactPortfolioCard
                          project={project}
                          onClick={() => handleProjectClick(project)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                    <p>No development projects available</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Creator Skills & Content Creations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Creator Skills Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.9 }}
                className="dashboard-card p-5 md:p-8 space-y-5 h-fit"
              >
                <h3 className="text-sm md:text-base font-medium text-center text-primary border-b border-border pb-2">
                  Creator Stack
                </h3>
                <div className="space-y-4">
                  {Object.entries(creatorSkills).map(([category, skills], categoryIndex) => (
                    <div key={category} className="space-y-2">
                      {/* Category Header */}
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="flex-1 h-px bg-border"></div>
                      </div>
                      
                      {/* Skills in Category */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 3.0 + (categoryIndex * skills.length + skillIndex) * 0.05 }}
                            className="flex items-center space-x-1"
                          >
                            <span className={`px-3 py-1 bg-muted border rounded-md text-xs md:text-sm hover:scale-105 transition-all ${getProficiencyColor(skill.level)}`}>
                              {skill.name}
                            </span>
                            <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor(skill.level)} bg-muted/50`}>
                              {skill.level.charAt(0)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Proficiency Legend */}
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex justify-center items-center space-x-6 text-xs">
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Expert')} bg-muted/50`}>
                          E
                        </span>
                        <span className="text-muted-foreground">Expert</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getProficiencyColor('Intermediate')} bg-muted/50`}>
                          I
                        </span>
                        <span className="text-muted-foreground">Intermediate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Creations Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.9 }}
                className="space-y-4"
              >
                {/* Header with View All Link */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-medium text-primary border-b border-border pb-2">
                    Content Creations
                  </h3>
                  <Link
                    href="/hire-me#portfolio"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Content Portfolio Cards */}
                {contentProjects.length > 0 ? (
                  <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                    {contentProjects.slice(0, 6).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 3.2 + index * 0.05 }}
                      >
                        <CompactPortfolioCard
                          project={project}
                          onClick={() => handleProjectClick(project)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-card p-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-8 h-8 text-red-500" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Content Creation Projects Coming Soon
                        </p>
                        <p className="text-xs text-muted-foreground/70 max-w-xs">
                          Add content projects with categories like "YouTube", "Tutorial", or "Content" in Sanity CMS
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Section Separator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 3.4 }}
            className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          />

          {/* Work Timeline Section */}
          <Timeline 
            items={timelineItems}
            animationDelay={3.6}
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
    
    {/* Terminal Footer - Edge to Edge */}
    <TerminalFooter animationDelay={4.0} />
    </>
  );
}