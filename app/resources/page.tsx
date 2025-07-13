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

const fallbackResources = [
  {
    _id: 'vscode',
    title: 'Visual Studio Code',
    slug: 'vscode',
    description: 'My primary code editor with extensive extensions for web development.',
    url: 'https://code.visualstudio.com/',
    icon: '⚡',
    category: { _id: 'development', name: 'Development', slug: 'development' },
    tags: ['editor', 'IDE', 'development'],
    featured: true,
    order: 0,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString()
  }
];

export default async function ResourcesPage() {
  // Disable caching for fresh data
  unstable_noStore();

  let catalogData;
  
  try {
    catalogData = await getResourcesCatalogData();
    
    // Use fallback data if Sanity returns empty results
    if (!catalogData.categories.length && !catalogData.resources.length) {
      console.log('📝 Using fallback resource data (Sanity appears empty)');
      catalogData = {
        categories: fallbackCategories,
        resources: fallbackResources
      };
    }
  } catch (error) {
    console.error('❌ Error fetching resources data, using fallback:', error);
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