"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Brain, Palette, Globe, GraduationCap, Zap } from 'lucide-react';
import type { ResourceCategory, Resource } from '@/types/resources';
import ResourceModal from '@/components/ui/ResourceModal';
import ResourceIcon from '@/components/ui/ResourceIcon';

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
  // New fields for enhanced modal
  blogPosts?: Array<{
    title: string;
    url: string;
  }>;
  useCases: string[];
  toolType: string;
}

// Transform Sanity resource to client-side format
function transformSanityResource(resource: Resource): ClientResource {
  // Map category slugs to client categories
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
}

// Component props interface
interface ResourcesClientProps {
  categories: ResourceCategory[];
  resources: Resource[];
}

// Category configuration type
type CategoryConfig = {
  id: ClientResourceCategory;
  name: string;
  icon: any;
  count: number;
};

// Resource Card Component
function ResourceCard({ resource, onClick }: { resource: ClientResource; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        <div className="group-hover:scale-110 transition-transform duration-300">
          <ResourceIcon icon={resource.icon} size="medium" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {resource.name}
            </h3>
            {resource.featured && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Category Filter Component
function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: CategoryConfig[];
  activeCategory: ClientResourceCategory;
  onCategoryChange: (category: ClientResourceCategory) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{category.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              isActive ? 'bg-primary-foreground/20' : 'bg-muted'
            }`}>
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Main Resources Component - SIMPLIFIED VERSION
export default function ResourcesClient({ categories, resources }: ResourcesClientProps) {
  const [activeCategory, setActiveCategory] = useState<ClientResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ClientResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle resource card click
  const handleResourceClick = (resource: ClientResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  // Transform Sanity resources to client-side format - SIMPLIFIED
  const clientResources = useMemo(() => {
    if (!resources || !Array.isArray(resources)) return [];
    return resources.map(transformSanityResource);
  }, [resources]);

  // Create static category configuration - SIMPLIFIED
  const categoryConfig: CategoryConfig[] = useMemo(() => {
    const totalResources = clientResources.length;
    
    return [
      { id: 'all', name: 'All Resources', icon: Globe, count: totalResources },
      { id: 'development', name: 'Development', icon: Code, count: clientResources.filter(r => r.category === 'development').length },
      { id: 'ai', name: 'AI Tools', icon: Brain, count: clientResources.filter(r => r.category === 'ai').length },
      { id: 'design', name: 'Design', icon: Palette, count: clientResources.filter(r => r.category === 'design').length },
      { id: 'websites', name: 'Websites', icon: Globe, count: clientResources.filter(r => r.category === 'websites').length },
      { id: 'learning', name: 'Learning', icon: GraduationCap, count: clientResources.filter(r => r.category === 'learning').length },
      { id: 'productivity', name: 'Productivity', icon: Zap, count: clientResources.filter(r => r.category === 'productivity').length }
    ];
  }, [clientResources]);

  // Filter resources based on category and search - SIMPLIFIED
  const filteredResources = useMemo(() => {
    if (!clientResources || !Array.isArray(clientResources)) return [];
    
    return clientResources.filter((resource) => {
      if (!resource) return false;
      
      const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        (resource.name && resource.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (resource.tags && resource.tags.some(tag => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      return matchesCategory && matchesSearch;
    });
  }, [clientResources, activeCategory, searchQuery]);

  // Sort filtered resources to show featured first - SIMPLIFIED
  const sortedResources = useMemo(() => {
    if (!filteredResources || !Array.isArray(filteredResources)) return [];
    
    return filteredResources.sort((a, b) => {
      if (!a || !b) return 0;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [filteredResources]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Resources
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          A curated collection of tools, AI platforms, websites, and learning resources 
          I use for development, design, and content creation.
        </p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <CategoryFilter
          categories={categoryConfig}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <ResourceCard resource={resource} onClick={() => handleResourceClick(resource)} />
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {sortedResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or selecting a different category.
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-12 pt-8 border-t border-border"
      >
        <p className="text-sm text-muted-foreground">
          Showing {sortedResources.length} of {clientResources.length} resources
          {activeCategory !== 'all' && ` in ${categoryConfig.find(c => c.id === activeCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </motion.div>

      {/* Resource Modal */}
      <ResourceModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}