"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import type { PortfolioProject as SanityPortfolioProject, PortfolioCategory as SanityPortfolioCategory } from '@/lib/sanity-data';
import type { PortfolioProject } from '@/types/portfolio';
import { categorizeWorkType } from '@/types/portfolio';
import CategorySection from './CategorySection';
import ProjectModal from './ProjectModal';

// Transform Sanity data to component-friendly format
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

interface PortfolioShowcaseProps {
  categories: SanityPortfolioCategory[];
  projects: SanityPortfolioProject[];
}

export default function PortfolioShowcase({ categories, projects }: PortfolioShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Transform Sanity data and group projects by category
  const projectsByCategory = useMemo(() => {
    const transformedProjects = projects.map(transformSanityProject);
    
    const categorizedProjects = categories.map(category => ({
      category: category.name,
      projects: transformedProjects
        .filter(project => project.category === category.name)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })).filter(group => group.projects.length > 0);

    return categorizedProjects;
  }, [categories, projects]);

  const totalProjects = projects.length;
  const totalCategories = categories.length;

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center space-x-4 text-sm text-muted-foreground"
      >
        <span className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{totalProjects} Projects</span>
        </span>
        <span className="flex items-center space-x-1">
          <Tag className="w-4 h-4" />
          <span>{totalCategories} Categories</span>
        </span>
      </motion.div>

      {/* Category Sections */}
      <div className="space-y-8">
        {projectsByCategory.map((group, index) => (
          <CategorySection
            key={group.category}
            category={group.category}
            projects={group.projects}
            onProjectClick={handleProjectClick}
            index={index}
          />
        ))}

        {projectsByCategory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Tag className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No projects available</h3>
            <p className="text-muted-foreground text-sm">
              Projects will appear here once they're added to the portfolio
            </p>
          </motion.div>
        )}
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