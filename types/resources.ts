// Resource category types
export interface ResourceCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  order: number;
}

// Resource types
export interface Resource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  url: string;
  icon: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  featured: boolean;
  order: number;
  // New fields for enhanced modal
  blogPosts?: Array<{
    title: string;
    url: string;
  }>;
  useCases: string[];
  toolType: string;
  _createdAt: string;
  _updatedAt: string;
}

// Client-side resource category types (for filtering)
export type ResourceCategorySlug = 'all' | 'development' | 'ai' | 'design' | 'websites' | 'learning' | 'productivity';

// Resource catalog response type
export interface ResourcesCatalogData {
  categories: ResourceCategory[];
  resources: Resource[];
}

// Resource search/filter parameters
export interface ResourceSearchParams {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

// Client-side resource interface (transformed from Sanity)
export interface ClientResource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategorySlug;
  url: string;
  icon: string;
  tags: string[];
  featured: boolean;
  // New fields for enhanced modal
  blogPosts?: Array<{
    title: string;
    url: string;
  }>;
  useCases: string[];
  toolType: string;
}

// Category configuration for client-side filtering
export interface CategoryConfig {
  id: ResourceCategorySlug;
  name: string;
  icon: any; // Lucide icon component
  count: number;
}