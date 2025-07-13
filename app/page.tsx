import { Hero } from "@/components/sections/hero";
import { getPortfolioProjects } from "@/lib/sanity-data";
import { unstable_noStore } from 'next/cache';

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  // Fetch portfolio projects for Hero component
  let portfolioProjects: any[] = [];
  try {
    portfolioProjects = await getPortfolioProjects();
  } catch (error) {
    console.error('Error fetching portfolio projects for homepage:', error);
    portfolioProjects = [];
  }

  return (
    <main>
      <Hero portfolioProjects={portfolioProjects} />
    </main>
  );
}
