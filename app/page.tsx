import { Hero } from "@/components/sections/hero";
import { getDevelopmentProjects, getCreativeProjects, getCreativeClients } from "@/lib/sanity-data";
import { unstable_noStore } from 'next/cache';

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }

  // Fetch projects and clients for Hero component
  let developmentProjects: any[] = [];
  let creativeProjects: any[] = [];
  let creativeClients: any[] = [];
  
  try {
    console.log('🚀 Starting to fetch data for homepage...');
    
    // Try to fetch projects and clients
    const [devProjects, creativeProjectsData, clientsData] = await Promise.all([
      getDevelopmentProjects().catch(err => {
        console.log('⚠️  Development projects fetch failed, using empty array:', err.message);
        return [];
      }),
      getCreativeProjects().catch(err => {
        console.log('⚠️  Creative projects fetch failed, using empty array:', err.message);
        return [];
      }),
      getCreativeClients().catch(err => {
        console.log('⚠️  Creative clients fetch failed, using empty array:', err.message);
        return [];
      })
    ]);
    
    developmentProjects = devProjects;
    creativeProjects = creativeProjectsData;
    creativeClients = clientsData;
    
    console.log('✅ Successfully fetched data:', {
      developmentProjects: developmentProjects.length,
      creativeProjects: creativeProjects.length,
      creativeClients: creativeClients.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching data for homepage:', error);
    developmentProjects = [];
    creativeProjects = [];
    creativeClients = [];
  }

  return (
    <main>
      <Hero 
        developmentProjects={developmentProjects} 
        creativeProjects={creativeProjects}
        creativeClients={creativeClients}
      />
    </main>
  );
}
