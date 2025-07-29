import { client, liveClient } from './sanity';
import { 
  serviceCategoriesQuery, 
  serviceFiltersQuery, 
  servicesQuery,
  servicesByCategoryQuery,
  servicesByFilterQuery,
  serviceByIdQuery,
  servicesCatalogQuery,
  developmentProjectsQuery,
  featuredDevelopmentProjectsQuery,
  developmentProjectByIdQuery,
  developmentProjectBySlugQuery,
  creativeProjectsQuery,
  creativeProjectsByKindQuery,
  creativeProjectsByDurationQuery,
  featuredCreativeProjectsQuery,
  creativeProjectByIdQuery,
  creativeProjectBySlugQuery,
  projectsCatalogQuery,
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
import type { 
  SanityDevelopmentProject, 
  DevelopmentProject, 
  SanityCreativeProject, 
  CreativeProject,
  ProjectCatalogData 
} from '@/types/projects';
import { urlFor } from '@/lib/sanity';

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


// =============================================================================
// PROJECT DATA FUNCTIONS
// =============================================================================

// Transform Sanity development project to component format
function transformSanityDevelopmentProject(project: SanityDevelopmentProject): DevelopmentProject {
  return {
    id: project._id,
    projectName: project.projectName,
    slug: project.slug,
    description: project.description,
    thumbnail: project.thumbnail ? urlFor(project.thumbnail).width(600).height(400).url() : '',
    clientName: project.clientName,
    clientLogo: project.clientLogo ? urlFor(project.clientLogo).width(200).height(200).url() : undefined,
    techStack: project.techStack || [],
    githubLink: project.githubLink,
    siteLink: project.siteLink,
    featured: project.featured,
    order: project.order,
    createdAt: project._createdAt
  };
}

// Generate smart thumbnail URL based on project kind
function generateCreativeThumbnailUrl(thumbnail: any, kind: 'Reels' | 'Landscape'): string {
  if (!thumbnail) return '';
  
  // Smart image transformations based on project kind
  if (kind === 'Reels') {
    // Reels: Vertical format optimized for mobile/vertical display
    return urlFor(thumbnail)
      .width(400)
      .height(600)
      .fit('crop')
      .crop('center')
      .auto('format')
      .quality(85)
      .url();
  } else {
    // Landscape: Horizontal format optimized for desktop/horizontal display
    return urlFor(thumbnail)
      .width(600)
      .height(400)
      .fit('crop')
      .crop('center')
      .auto('format')
      .quality(85)
      .url();
  }
}

// Transform Sanity creative project to component format
function transformSanityCreativeProject(project: SanityCreativeProject): CreativeProject {
  return {
    id: project._id,
    name: project.name,
    slug: project.slug,
    thumbnail: generateCreativeThumbnailUrl(project.thumbnail, project.kind),
    clientName: project.clientName,
    clientLogo: project.clientLogo ? urlFor(project.clientLogo).width(200).height(200).url() : undefined,
    kind: project.kind,
    durationType: project.durationType,
    videoLink: project.videoLink,
    softwareTools: project.softwareTools || [],
    featured: project.featured,
    order: project.order,
    createdAt: project._createdAt
  };
}

// Fetch all development projects
export async function getDevelopmentProjects(): Promise<DevelopmentProject[]> {
  try {
    const projects = await activeClient.fetch(developmentProjectsQuery);
    console.log('💻 Development projects fetched:', projects?.length || 0);
    return projects ? projects.map(transformSanityDevelopmentProject) : [];
  } catch (error: any) {
    console.error('❌ Error fetching development projects:', error);
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      query: developmentProjectsQuery
    });
    return [];
  }
}

// Fetch featured development projects
export async function getFeaturedDevelopmentProjects(): Promise<DevelopmentProject[]> {
  try {
    const projects = await activeClient.fetch(featuredDevelopmentProjectsQuery);
    console.log('⭐ Featured development projects fetched:', projects?.length || 0);
    return projects ? projects.map(transformSanityDevelopmentProject) : [];
  } catch (error) {
    console.error('❌ Error fetching featured development projects:', error);
    return [];
  }
}

// Fetch single development project by ID
export async function getDevelopmentProjectById(projectId: string): Promise<DevelopmentProject | null> {
  try {
    const project = await activeClient.fetch(developmentProjectByIdQuery, { projectId });
    console.log(`🔍 Development project by ID '${projectId}':`, project ? 'found' : 'not found');
    return project ? transformSanityDevelopmentProject(project) : null;
  } catch (error) {
    console.error('❌ Error fetching development project by ID:', error);
    return null;
  }
}

// Fetch single development project by slug
export async function getDevelopmentProjectBySlug(slug: string): Promise<DevelopmentProject | null> {
  try {
    const project = await activeClient.fetch(developmentProjectBySlugQuery, { slug });
    console.log(`🔍 Development project by slug '${slug}':`, project ? 'found' : 'not found');
    return project ? transformSanityDevelopmentProject(project) : null;
  } catch (error) {
    console.error('❌ Error fetching development project by slug:', error);
    return null;
  }
}

// Fetch all creative projects
export async function getCreativeProjects(): Promise<CreativeProject[]> {
  try {
    const projects = await activeClient.fetch(creativeProjectsQuery);
    console.log('🎨 Creative projects fetched:', projects?.length || 0);
    return projects ? projects.map(transformSanityCreativeProject) : [];
  } catch (error: any) {
    console.error('❌ Error fetching creative projects:', error);
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      query: creativeProjectsQuery
    });
    return [];
  }
}

// Fetch creative projects by kind
export async function getCreativeProjectsByKind(kind: 'Reels' | 'Landscape'): Promise<CreativeProject[]> {
  try {
    const projects = await activeClient.fetch(creativeProjectsByKindQuery, { kind });
    console.log(`🎬 Creative projects by kind '${kind}':`, projects?.length || 0);
    return projects ? projects.map(transformSanityCreativeProject) : [];
  } catch (error) {
    console.error('❌ Error fetching creative projects by kind:', error);
    return [];
  }
}

// Fetch creative projects by duration type
export async function getCreativeProjectsByDuration(durationType: 'Short Form' | 'Long Form'): Promise<CreativeProject[]> {
  try {
    const projects = await activeClient.fetch(creativeProjectsByDurationQuery, { durationType });
    console.log(`⏱️ Creative projects by duration '${durationType}':`, projects?.length || 0);
    return projects ? projects.map(transformSanityCreativeProject) : [];
  } catch (error) {
    console.error('❌ Error fetching creative projects by duration:', error);
    return [];
  }
}

// Fetch featured creative projects
export async function getFeaturedCreativeProjects(): Promise<CreativeProject[]> {
  try {
    const projects = await activeClient.fetch(featuredCreativeProjectsQuery);
    console.log('⭐ Featured creative projects fetched:', projects?.length || 0);
    return projects ? projects.map(transformSanityCreativeProject) : [];
  } catch (error) {
    console.error('❌ Error fetching featured creative projects:', error);
    return [];
  }
}

// Fetch single creative project by ID
export async function getCreativeProjectById(projectId: string): Promise<CreativeProject | null> {
  try {
    const project = await activeClient.fetch(creativeProjectByIdQuery, { projectId });
    console.log(`🔍 Creative project by ID '${projectId}':`, project ? 'found' : 'not found');
    return project ? transformSanityCreativeProject(project) : null;
  } catch (error) {
    console.error('❌ Error fetching creative project by ID:', error);
    return null;
  }
}

// Fetch single creative project by slug
export async function getCreativeProjectBySlug(slug: string): Promise<CreativeProject | null> {
  try {
    const project = await activeClient.fetch(creativeProjectBySlugQuery, { slug });
    console.log(`🔍 Creative project by slug '${slug}':`, project ? 'found' : 'not found');
    return project ? transformSanityCreativeProject(project) : null;
  } catch (error) {
    console.error('❌ Error fetching creative project by slug:', error);
    return null;
  }
}

// Fetch all project data (combined)
export async function getProjectsCatalogData(): Promise<ProjectCatalogData> {
  try {
    const data = await activeClient.fetch(projectsCatalogQuery);
    
    console.log('📊 Projects catalog data fetched:', {
      developmentProjects: data?.developmentProjects?.length || 0,
      creativeProjects: data?.creativeProjects?.length || 0
    });
    
    return {
      developmentProjects: data.developmentProjects ? data.developmentProjects.map(transformSanityDevelopmentProject) : [],
      creativeProjects: data.creativeProjects ? data.creativeProjects.map(transformSanityCreativeProject) : []
    };
  } catch (error) {
    console.error('❌ Error fetching projects catalog data:', error);
    return {
      developmentProjects: [],
      creativeProjects: []
    };
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