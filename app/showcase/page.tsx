import { Metadata } from 'next';
import { ShowcaseClient } from '@/components/pages/ShowcaseClient';
import { getPortfolioProjects } from '@/lib/sanity-data';
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

  // Fetch all portfolio projects
  let portfolioProjects: any[] = [];
  try {
    portfolioProjects = await getPortfolioProjects();
  } catch (error) {
    console.error('Error fetching portfolio projects for showcase:', error);
    portfolioProjects = [];
  }

  return <ShowcaseClient portfolioProjects={portfolioProjects} />;
}