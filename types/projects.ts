// Project TypeScript Types for Sanity Integration

// Development Project Types
export interface SanityDevelopmentProject {
  _id: string;
  projectName: string;
  slug: string;
  description: string;
  thumbnail: any; // Sanity image object
  clientName?: string;
  clientLogo?: any; // Sanity image object
  techStack?: string[];
  githubLink?: string;
  siteLink?: string;
  featured: boolean;
  order: number;
  _createdAt: string;
  _updatedAt: string;
}

// Processed development project type (for use in components)
export interface DevelopmentProject {
  id: string; // Maps from _id
  projectName: string;
  slug: string;
  description: string;
  thumbnail: string; // Processed image URL
  clientName?: string;
  clientLogo?: string; // Processed image URL
  techStack?: string[];
  githubLink?: string;
  siteLink?: string;
  featured: boolean;
  order: number;
  createdAt: string; // For sorting
}

// Creative Project Types
export interface SanityCreativeProject {
  _id: string;
  name: string;
  slug: string;
  thumbnail: any; // Sanity image object
  clientName?: string;
  clientLogo?: any; // Sanity image object
  kind: 'Reels' | 'Landscape';
  durationType: 'Short Form' | 'Long Form';
  videoLink: string;
  softwareTools?: string[];
  featured: boolean;
  order: number;
  _createdAt: string;
  _updatedAt: string;
}

// Processed creative project type (for use in components)
export interface CreativeProject {
  id: string; // Maps from _id
  name: string;
  slug: string;
  thumbnail: string; // Processed image URL
  clientName?: string;
  clientLogo?: string; // Processed image URL
  kind: 'Reels' | 'Landscape';
  durationType: 'Short Form' | 'Long Form';
  videoLink: string;
  softwareTools?: string[];
  featured: boolean;
  order: number;
  createdAt: string; // For sorting
}

// Combined types for components that might use both
export type AnyProject = DevelopmentProject | CreativeProject;
export type AnySanityProject = SanityDevelopmentProject | SanityCreativeProject;

// Utility functions
export function isDevelopmentProject(project: AnyProject): project is DevelopmentProject {
  return 'projectName' in project && 'techStack' in project;
}

export function isCreativeProject(project: AnyProject): project is CreativeProject {
  return 'kind' in project && 'durationType' in project;
}

// Data structure for components
export interface ProjectCatalogData {
  developmentProjects: DevelopmentProject[];
  creativeProjects: CreativeProject[];
}