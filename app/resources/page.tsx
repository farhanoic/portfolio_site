import { Metadata } from 'next';
import { getResourcesCatalogData } from '@/lib/sanity-data';
import ResourcesClient from '@/components/pages/ResourcesClient';
import { unstable_noStore } from 'next/cache';

export const metadata: Metadata = {
  title: 'Resources | Farhan Azhar',
  description: 'A curated collection of tools, AI platforms, websites, and learning resources I use for development, design, and content creation.',
  keywords: ['resources', 'tools', 'AI tools', 'development tools', 'design tools', 'learning platforms'],
};

// Fallback data in case Sanity is empty
const fallbackCategories = [
  { _id: 'development', name: 'Development', slug: 'development', icon: '⚡', order: 1 },
  { _id: 'ai', name: 'AI Tools', slug: 'ai', icon: '🤖', order: 2 },
  { _id: 'design', name: 'Design', slug: 'design', icon: '🎨', order: 3 },
  { _id: 'websites', name: 'Websites', slug: 'websites', icon: '🌐', order: 4 },
  { _id: 'learning', name: 'Learning', slug: 'learning', icon: '📚', order: 5 },
  { _id: 'productivity', name: 'Productivity', slug: 'productivity', icon: '⚡', order: 6 }
];

const fallbackResources: any[] = [];

export default async function ResourcesPage() {
  // Disable caching for fresh data
  unstable_noStore();

  let catalogData;
  
  try {
    catalogData = await getResourcesCatalogData();
    
    // If no data from Sanity, show empty state
    if (!catalogData) {
      catalogData = {
        categories: fallbackCategories,
        resources: fallbackResources
      };
    }
  } catch (error) {
    catalogData = {
      categories: fallbackCategories,
      resources: fallbackResources
    };
  }

  return (
    <div className="min-h-screen pt-16">
      <ResourcesClient 
        categories={catalogData.categories}
        resources={catalogData.resources}
      />
    </div>
  );
}