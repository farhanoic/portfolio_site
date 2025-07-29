import { Metadata } from 'next';
import { ShowcaseClient } from '@/components/pages/ShowcaseClient';
import { getDevelopmentProjects, getCreativeProjects } from '@/lib/sanity-data';
import { unstable_noStore } from 'next/cache';

export const metadata: Metadata = {
  title: 'Showcase - Farhan Azhar',
  description: 'A comprehensive showcase of my works, achievements, and creative projects across development, design, and content creation.',
  keywords: ['Farhan Azhar', 'Portfolio', 'Showcase', 'Works', 'Achievements', 'Projects'],
  openGraph: {
    title: 'Showcase - Farhan Azhar',
    description: 'A comprehensive showcase of my works, achievements, and creative projects.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showcase - Farhan Azhar',
    description: 'A comprehensive showcase of my works, achievements, and creative projects.',
  },
};

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShowcasePage() {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  // Fetch development and creative projects separately
  let developmentProjects: any[] = [];
  let creativeProjects: any[] = [];
  
  try {
    console.log('🚀 Starting to fetch projects for showcase...');
    
    // Try to fetch the new project types
    [developmentProjects, creativeProjects] = await Promise.all([
      getDevelopmentProjects().catch(err => {
        console.log('⚠️  Development projects fetch failed for showcase, using empty array:', err.message);
        return [];
      }),
      getCreativeProjects().catch(err => {
        console.log('⚠️  Creative projects fetch failed for showcase, using empty array:', err.message);
        return [];
      })
    ]);
    
    console.log('✅ Successfully fetched projects for showcase:', {
      developmentProjects: developmentProjects.length,
      creativeProjects: creativeProjects.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching projects for showcase:', error);
    developmentProjects = [];
    creativeProjects = [];
  }

  return (
    <ShowcaseClient 
      developmentProjects={developmentProjects} 
      creativeProjects={creativeProjects} 
    />
  );
}