// Portfolio TypeScript Types for Sanity Integration

export interface SanityPortfolioCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface SanityPortfolioProject {
  _id: string;
  title: string;
  slug: string;
  longDescription: string;
  thumbnail: any; // Sanity image object
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  client?: string;
  technologies?: string[];
  featured: boolean;
  order: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

// Work type categorization
export type WorkType = 'Creative' | 'Development' | 'Content';

// Processed portfolio project type (for use in components)
export interface PortfolioProject {
  id: string; // Maps from _id
  title: string;
  slug: string;
  longDescription: string;
  thumbnail: string; // Processed image URL
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  client?: string;
  technologies?: string[];
  featured: boolean;
  category: string; // Just the name for simplicity
  workType: WorkType; // Creative or Development categorization
  createdAt: string; // For sorting
}

// Portfolio category for components
export interface PortfolioCategory {
  id: string; // Maps from _id
  name: string;
  slug: string;
  description?: string;
  order: number;
}

// Portfolio data structure for components
export interface PortfolioCatalogData {
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
}

// Utility function to determine work type based on category
export function categorizeWorkType(categoryName: string): WorkType {
  const contentCategoryKeywords = [
    'youtube', 'video', 'content', 'creator', 'vlog', 'tutorial', 
    'streaming', 'podcast', 'channel', 'series', 'episode'
  ];

  const creativeCategoryKeywords = [
    'design', 'motion', 'graphic', 'branding', 'logo', 'ui', 'ux', 
    'visual', 'art', 'creative', 'animation', 'edit', 'marketing', 
    'photography', 'illustration', 'print', 'media', 'social'
  ];
  
  const developmentCategoryKeywords = [
    'development', 'web', 'app', 'software', 'code', 'programming', 'frontend', 
    'backend', 'fullstack', 'api', 'database', 'mobile', 'react', 'next', 
    'javascript', 'typescript', 'node', 'python', 'tech', 'system', 'devops'
  ];
  
  const lowerCategoryName = categoryName.toLowerCase();
  
  // Check if any content keywords match (check this first)
  if (contentCategoryKeywords.some(keyword => lowerCategoryName.includes(keyword))) {
    return 'Content';
  }
  
  // Check if any creative keywords match
  if (creativeCategoryKeywords.some(keyword => lowerCategoryName.includes(keyword))) {
    return 'Creative';
  }
  
  // Check if any development keywords match
  if (developmentCategoryKeywords.some(keyword => lowerCategoryName.includes(keyword))) {
    return 'Development';
  }
  
  // Default to Creative for unknown categories (since most portfolio work tends to be creative)
  return 'Creative';
}