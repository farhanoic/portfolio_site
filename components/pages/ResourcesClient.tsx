"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Brain, Palette, Globe, GraduationCap, Zap } from 'lucide-react';
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
    id: resource._id,
    name: resource.title,
    description: resource.description,
    category: categoryMap[resource.category.slug] || 'development',
    url: resource.url,
    icon: resource.icon,
    tags: resource.tags || [],
    featured: resource.featured || false
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
function ResourceCard({ resource }: { resource: ClientResource }) {
  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
          {resource.icon}
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
    </motion.a>
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

// Main Resources Component
export default function ResourcesClient({ categories, resources }: ResourcesClientProps) {
  const [activeCategory, setActiveCategory] = useState<ClientResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Transform Sanity resources to client-side format
  const clientResources = useMemo(() => {
    return resources.map(transformSanityResource);
  }, [resources]);

  // Create dynamic category configuration from Sanity data
  const categoryConfig: CategoryConfig[] = useMemo(() => {
    // Icon mapping for different category slugs
    const iconMap: Record<string, any> = {
      'development': Code,
      'ai': Brain,
      'design': Palette,
      'websites': Globe,
      'learning': GraduationCap,
      'productivity': Zap
    };

    // Generate categories dynamically from Sanity data
    const dynamicCategories = categories
      .map(category => {
        const categorySlug = category.slug as ClientResourceCategory;
        const resourceCount = clientResources.filter(r => r.category === categorySlug).length;
        
        return {
          id: categorySlug,
          name: category.name,
          icon: iconMap[category.slug] || Globe,
          count: resourceCount
        };
      })
      .filter(cat => cat.count > 0) // Only show categories with resources
      .sort((a, b) => {
        // Sort by the order from Sanity categories, or alphabetically if no order
        const categoryA = categories.find(c => c.slug === a.id);
        const categoryB = categories.find(c => c.slug === b.id);
        const orderA = categoryA?.order || 999;
        const orderB = categoryB?.order || 999;
        return orderA - orderB;
      });

    // Always include "All Resources" at the beginning if there are any resources
    const result: CategoryConfig[] = [];
    if (clientResources.length > 0) {
      result.push({ id: 'all', name: 'All Resources', icon: Globe, count: clientResources.length });
    }
    result.push(...dynamicCategories);

    return result;
  }, [categories, clientResources]);

  // Filter resources based on category and search
  const filteredResources = useMemo(() => {
    return clientResources.filter((resource) => {
      const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [clientResources, activeCategory, searchQuery]);

  // Sort filtered resources to show featured first
  const sortedResources = useMemo(() => {
    return filteredResources.sort((a, b) => {
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
            <ResourceCard resource={resource} />
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
    </div>
  );
}