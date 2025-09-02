"use client";

import type { ResourceCategory, Resource } from '@/types/resources';

// Client-side resource category types
export type ClientResourceCategory = 'all' | 'development' | 'ai' | 'design' | 'websites' | 'learning' | 'productivity';

// Client-side resource interface (transformed from Sanity)
export interface ClientResource {
  id: string;
  name: string;
  description: string;
  category: ClientResourceCategory;
  url: string;
  icon: string;
  tags: string[];
  featured: boolean;
  blogPosts?: Array<{
    title: string;
    url: string;
  }>;
  useCases: string[];
  toolType: string;
}

// Transform Sanity resource to client-side format
const transformSanityResource = (resource: Resource): ClientResource => {
  const categoryMap: Record<string, ClientResourceCategory> = {
    'development': 'development',
    'ai': 'ai',
    'design': 'design',
    'websites': 'websites',
    'learning': 'learning',
    'productivity': 'productivity'
  };

  return {
    id: resource._id || '',
    name: resource.title || 'Untitled',
    description: resource.description || 'No description available',
    category: categoryMap[resource.category?.slug] || 'development',
    url: resource.url || '#',
    icon: resource.icon || '🔧',
    tags: resource.tags || [],
    featured: resource.featured || false,
    blogPosts: resource.blogPosts || [],
    useCases: resource.useCases || [],
    toolType: resource.toolType || 'Tool'
  };
};

// Component props interface
interface ResourcesClientProps {
  categories: ResourceCategory[];
  resources: Resource[];
}

// Resource Icon Component - Handle both emoji and URL icons
const ResourceIconDisplay = ({ icon, name }: { icon: string; name: string }) => {
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return (
      <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-md bg-muted/10">
        <img
          src={icon}
          alt={`${name} logo`}
          className="w-8 h-8 object-contain"
          onError={(e) => {
            // Replace with fallback emoji if image fails
            const fallback = document.createElement('div');
            fallback.className = 'w-8 h-8 flex items-center justify-center text-2xl';
            fallback.textContent = '🔧';
            e.currentTarget.parentNode?.replaceChild(fallback, e.currentTarget);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 flex items-center justify-center text-2xl">
      {icon}
    </div>
  );
};

// NO HOOKS VERSION - Working Resources Component
export default function ResourcesClient({ categories, resources }: ResourcesClientProps) {
  // Transform resources - DIRECT, NO HOOKS
  const clientResources = (resources || []).map(transformSanityResource);

  const handleResourceClick = (resource: ClientResource) => {
    // Direct redirect - no modal for now
    window.open(resource.url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          A curated collection of tools, AI platforms, websites, and learning resources 
          I use for development, design, and content creation.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {clientResources.map((resource) => (
          <div
            key={resource.id}
            onClick={() => handleResourceClick(resource)}
            className="group p-6 bg-card border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ResourceIconDisplay icon={resource.icon} name={resource.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {resource.name}
                  </h3>
                  {resource.featured && (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {resource.toolType}
                  </span>
                  {resource.tags.length > 0 && (
                    <div className="flex gap-1">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-accent/10 text-accent-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clientResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No resources yet</h3>
          <p className="text-muted-foreground">
            Resources will appear here once you add them in Sanity.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="text-center mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {clientResources.length} {clientResources.length === 1 ? 'resource' : 'resources'} available
        </p>
      </div>
    </div>
  );
}