import { client, liveClient } from './sanity';
import { 
  serviceCategoriesQuery, 
  serviceFiltersQuery, 
  servicesQuery,
  servicesByCategoryQuery,
  servicesByFilterQuery,
  serviceByIdQuery,
  servicesCatalogQuery,
  portfolioCatalogQuery,
  portfolioProjectsQuery,
  portfolioProjectsByCategoryQuery,
  featuredPortfolioProjectsQuery,
  portfolioCategoriesQuery,
  portfolioProjectByIdQuery,
  portfolioProjectBySlugQuery,
  blogCategoriesQuery,
  blogPostsQuery,
  blogPostsByCategoryQuery,
  blogPostBySlugQuery,
  relatedBlogPostsQuery,
  featuredBlogPostsQuery,
  resourceCategoriesQuery,
  resourcesQuery,
  resourcesByCategoryQuery,
  featuredResourcesQuery,
  resourcesCatalogQuery
} from './sanity-queries';
import type { ServiceCategory, ServiceFilter, ServiceItem } from '@/types/services';
import type { BlogPost, BlogCategory, BlogPostsResponse, BlogSearchParams } from '@/types/blog';
import { BLOG_AUTHOR } from '@/lib/author-constants';
import type { ResourceCategory, Resource, ResourcesCatalogData, ResourceSearchParams } from '@/types/resources';

// Use live client in development for real-time updates
const isDevelopment = process.env.NODE_ENV === 'development';
const activeClient = isDevelopment ? liveClient : client;

// Fetch all service categories
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    return await activeClient.fetch(serviceCategoriesQuery);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
}

// Fetch all service filters
export async function getServiceFilters(): Promise<ServiceFilter[]> {
  try {
    return await activeClient.fetch(serviceFiltersQuery);
  } catch (error) {
    console.error('Error fetching service filters:', error);
    return [];
  }
}

// Fetch all services
export async function getServices(): Promise<ServiceItem[]> {
  try {
    return await activeClient.fetch(servicesQuery);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Fetch services by category
export async function getServicesByCategory(categorySlug: string): Promise<ServiceItem[]> {
  try {
    return await activeClient.fetch(servicesByCategoryQuery, { categorySlug });
  } catch (error) {
    console.error('Error fetching services by category:', error);
    return [];
  }
}

// Fetch services by filter
export async function getServicesByFilter(filterSlug: string): Promise<ServiceItem[]> {
  try {
    return await activeClient.fetch(servicesByFilterQuery, { filterSlug });
  } catch (error) {
    console.error('Error fetching services by filter:', error);
    return [];
  }
}

// Fetch a single service by ID
export async function getServiceById(serviceId: string): Promise<ServiceItem | null> {
  try {
    return await activeClient.fetch(serviceByIdQuery, { serviceId });
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return null;
  }
}

// Fetch all data for the service catalog
export async function getServicesCatalogData(): Promise<{
  categories: ServiceCategory[];
  filters: ServiceFilter[];
  services: ServiceItem[];
}> {
  try {
    const data = await activeClient.fetch(servicesCatalogQuery);
    
    console.log('📊 Services catalog data fetched:', {
      categories: data?.categories?.length || 0,
      filters: data?.filters?.length || 0,
      services: data?.services?.length || 0
    });
    
    return {
      categories: data.categories || [],
      filters: data.filters || [],
      services: data.services || []
    };
  } catch (error) {
    console.error('❌ Error fetching services catalog data:', error);
    return {
      categories: [],
      filters: [],
      services: []
    };
  }
}

// Portfolio Data Types and Functions

export interface PortfolioCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface PortfolioProject {
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
  workType: 'Creative' | 'Development' | 'Content';
  _createdAt: string;
  _updatedAt: string;
}

// Fetch all portfolio data (categories and projects)
export async function getPortfolioCatalogData(): Promise<{
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
}> {
  try {
    const data = await activeClient.fetch(portfolioCatalogQuery);
    
    console.log('📊 Portfolio catalog data fetched:', {
      categories: data?.categories?.length || 0,
      projects: data?.projects?.length || 0
    });
    
    return {
      categories: data.categories || [],
      projects: data.projects || []
    };
  } catch (error) {
    console.error('❌ Error fetching portfolio catalog data:', error);
    return {
      categories: [],
      projects: []
    };
  }
}

// Fetch all portfolio projects
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  try {
    const projects = await activeClient.fetch(portfolioProjectsQuery);
    console.log('📄 Portfolio projects fetched:', projects?.length || 0);
    return projects || [];
  } catch (error) {
    console.error('❌ Error fetching portfolio projects:', error);
    return [];
  }
}

// Fetch portfolio projects by category
export async function getPortfolioProjectsByCategory(categorySlug: string): Promise<PortfolioProject[]> {
  try {
    const projects = await activeClient.fetch(portfolioProjectsByCategoryQuery, { categorySlug });
    console.log(`📂 Portfolio projects for category '${categorySlug}':`, projects?.length || 0);
    return projects || [];
  } catch (error) {
    console.error('❌ Error fetching portfolio projects by category:', error);
    return [];
  }
}

// Fetch featured portfolio projects
export async function getFeaturedPortfolioProjects(): Promise<PortfolioProject[]> {
  try {
    const projects = await activeClient.fetch(featuredPortfolioProjectsQuery);
    console.log('⭐ Featured portfolio projects fetched:', projects?.length || 0);
    return projects || [];
  } catch (error) {
    console.error('❌ Error fetching featured portfolio projects:', error);
    return [];
  }
}

// Fetch all portfolio categories
export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  try {
    const categories = await activeClient.fetch(portfolioCategoriesQuery);
    console.log('📋 Portfolio categories fetched:', categories?.length || 0);
    return categories || [];
  } catch (error) {
    console.error('❌ Error fetching portfolio categories:', error);
    return [];
  }
}

// Fetch single portfolio project by ID
export async function getPortfolioProjectById(projectId: string): Promise<PortfolioProject | null> {
  try {
    const project = await activeClient.fetch(portfolioProjectByIdQuery, { projectId });
    console.log(`🔍 Portfolio project by ID '${projectId}':`, project ? 'found' : 'not found');
    return project;
  } catch (error) {
    console.error('❌ Error fetching portfolio project by ID:', error);
    return null;
  }
}

// Fetch single portfolio project by slug
export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    const project = await activeClient.fetch(portfolioProjectBySlugQuery, { slug });
    console.log(`🔍 Portfolio project by slug '${slug}':`, project ? 'found' : 'not found');
    return project;
  } catch (error) {
    console.error('❌ Error fetching portfolio project by slug:', error);
    return null;
  }
}

// Helper function to inject hardcoded author into blog posts
function injectAuthorIntoPosts<T extends { author?: any }>(posts: T[]): T[] {
  return posts.map(post => ({
    ...post,
    author: BLOG_AUTHOR
  }));
}

function injectAuthorIntoPost<T extends { author?: any }>(post: T | null): T | null {
  if (!post) return null;
  return {
    ...post,
    author: BLOG_AUTHOR
  };
}

// Environment-aware revalidation
export const revalidate = isDevelopment ? 0 : 3600; // No cache in dev, 1 hour in production

// =============================================================================
// BLOG DATA FUNCTIONS
// =============================================================================

// Fetch all blog categories
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await activeClient.fetch(blogCategoriesQuery);
    console.log('📚 Blog categories fetched:', categories?.length || 0);
    return categories || [];
  } catch (error) {
    console.error('❌ Error fetching blog categories:', error);
    return [];
  }
}

// Fetch all published blog posts with pagination
export async function getBlogPosts(params: BlogSearchParams = {}): Promise<BlogPostsResponse> {
  try {
    const { category, limit = 9, offset = 0 } = params;
    
    const query = category ? blogPostsByCategoryQuery : blogPostsQuery;
    const queryParams = { 
      offset, 
      limit,
      ...(category && { categorySlug: category })
    };
    
    const data = await activeClient.fetch(query, queryParams);
    
    console.log('📄 Blog posts fetched:', {
      posts: data?.posts?.length || 0,
      total: data?.total || 0,
      category: category || 'all'
    });
    
    return {
      posts: injectAuthorIntoPosts(data.posts || []),
      total: data.total || 0
    };
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return {
      posts: [],
      total: 0
    };
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await activeClient.fetch(blogPostBySlugQuery, { slug });
    console.log(`🔍 Blog post by slug '${slug}':`, post ? 'found' : 'not found');
    return injectAuthorIntoPost(post);
  } catch (error) {
    console.error('❌ Error fetching blog post by slug:', error);
    return null;
  }
}

// Fetch related blog posts
export async function getRelatedBlogPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(relatedBlogPostsQuery, { 
      slug: currentSlug, 
      limit 
    });
    console.log(`🔗 Related posts for '${currentSlug}':`, posts?.length || 0);
    return injectAuthorIntoPosts(posts || []);
  } catch (error) {
    console.error('❌ Error fetching related blog posts:', error);
    return [];
  }
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(featuredBlogPostsQuery, { limit });
    console.log('⭐ Featured blog posts fetched:', posts?.length || 0);
    return injectAuthorIntoPosts(posts || []);
  } catch (error) {
    console.error('❌ Error fetching featured blog posts:', error);
    return [];
  }
}


// Fetch blog posts by category (helper function)
export async function getBlogPostsByCategory(categorySlug: string, params: BlogSearchParams = {}): Promise<BlogPostsResponse> {
  return getBlogPosts({
    ...params,
    category: categorySlug
  });
}

// Calculate reading time from content
export function calculateReadingTime(content: any[]): number {
  if (!content || !Array.isArray(content)) return 1;
  
  let wordCount = 0;
  
  const countWords = (blocks: any[]): void => {
    blocks.forEach(block => {
      if (block._type === 'block' && block.children) {
        block.children.forEach((child: any) => {
          if (child.text) {
            wordCount += child.text.split(/\s+/).filter((word: string) => word.length > 0).length;
          }
        });
      } else if (block._type === 'codeBlock' && block.code) {
        // Count code as fewer words since it's typically scanned rather than read
        wordCount += Math.ceil(block.code.split(/\s+/).length * 0.3);
      }
    });
  };
  
  countWords(content);
  
  // Average reading speed is 200-250 words per minute, we'll use 225
  const readingTime = Math.ceil(wordCount / 225);
  return Math.max(1, readingTime); // Minimum 1 minute
}

// Get all unique tags from published blog posts
export async function getBlogTags(): Promise<string[]> {
  try {
    const tagsQuery = `*[_type == "blogPost" && status == "published"].tags[]`;
    const tags = await activeClient.fetch(tagsQuery);
    
    // Remove duplicates and sort alphabetically
    const uniqueTags = [...new Set(tags.filter(Boolean) as string[])].sort();
    
    console.log('🏷️ Blog tags fetched:', uniqueTags?.length || 0);
    return uniqueTags;
  } catch (error) {
    console.error('❌ Error fetching blog tags:', error);
    return [];
  }
}

// =============================================================================
// RESOURCE DATA FUNCTIONS
// =============================================================================

// Fetch all resource categories
export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    const categories = await activeClient.fetch(resourceCategoriesQuery);
    console.log('📂 Resource categories fetched:', categories?.length || 0);
    return categories || [];
  } catch (error) {
    console.error('❌ Error fetching resource categories:', error);
    return [];
  }
}

// Fetch all resources
export async function getResources(): Promise<Resource[]> {
  try {
    const resources = await activeClient.fetch(resourcesQuery);
    console.log('🔧 Resources fetched:', resources?.length || 0);
    return resources || [];
  } catch (error) {
    console.error('❌ Error fetching resources:', error);
    return [];
  }
}

// Fetch resources by category
export async function getResourcesByCategory(categorySlug: string): Promise<Resource[]> {
  try {
    const resources = await activeClient.fetch(resourcesByCategoryQuery, { categorySlug });
    console.log(`🏷️ Resources for category '${categorySlug}':`, resources?.length || 0);
    return resources || [];
  } catch (error) {
    console.error('❌ Error fetching resources by category:', error);
    return [];
  }
}

// Fetch featured resources
export async function getFeaturedResources(): Promise<Resource[]> {
  try {
    const resources = await activeClient.fetch(featuredResourcesQuery);
    console.log('⭐ Featured resources fetched:', resources?.length || 0);
    return resources || [];
  } catch (error) {
    console.error('❌ Error fetching featured resources:', error);
    return [];
  }
}

// Fetch all resource data (categories and resources)
export async function getResourcesCatalogData(): Promise<ResourcesCatalogData> {
  try {
    const data = await activeClient.fetch(resourcesCatalogQuery);
    
    console.log('📊 Resources catalog data fetched:', {
      categories: data?.categories?.length || 0,
      resources: data?.resources?.length || 0
    });
    
    return {
      categories: data.categories || [],
      resources: data.resources || []
    };
  } catch (error) {
    console.error('❌ Error fetching resources catalog data:', error);
    return {
      categories: [],
      resources: []
    };
  }
}