import { getServicesCatalogData, getPortfolioCatalogData } from "@/lib/sanity-data";
import HireMeClient from "@/components/pages/HireMeClient";
import type { ServiceCategory, ServiceFilter, ServiceItem } from "@/types/services";
import { unstable_noStore } from 'next/cache';

// Default fallback data in case Sanity is empty
const fallbackCategories: ServiceCategory[] = [
  {
    _id: "video-editing",
    name: "Video Editing",
    slug: "video-editing",
    description: "Professional video editing services",
    order: 1
  },
  {
    _id: "design",
    name: "Design & Branding", 
    slug: "design",
    description: "Creative design and branding solutions",
    order: 2
  }
];

const fallbackFilters: ServiceFilter[] = [
  {
    _id: "youtube",
    name: "YouTube Videos",
    slug: "youtube",
    category: { _id: "video-editing", slug: "video-editing" },
    order: 1
  },
  {
    _id: "logo",
    name: "Logo Design", 
    slug: "logo",
    category: { _id: "design", slug: "design" },
    order: 1
  }
];

interface HireMePageProps {
  categories: ServiceCategory[];
  filters: ServiceFilter[];
  services: ServiceItem[];
  portfolioCategories: any[];
  portfolioProjects: any[];
}

// Server-side data fetching
async function getData(): Promise<HireMePageProps> {
  // Disable caching in development for live updates
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }
  
  try {
    // Fetch both services and portfolio data
    const [servicesData, portfolioData] = await Promise.all([
      getServicesCatalogData(),
      getPortfolioCatalogData()
    ]);
    
    // Use fallback data if Sanity is empty
    return {
      categories: servicesData.categories.length > 0 ? servicesData.categories : fallbackCategories,
      filters: servicesData.filters.length > 0 ? servicesData.filters : fallbackFilters,
      services: servicesData.services || [],
      portfolioCategories: portfolioData.categories || [],
      portfolioProjects: portfolioData.projects || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      categories: fallbackCategories,
      filters: fallbackFilters,
      services: [],
      portfolioCategories: [],
      portfolioProjects: []
    };
  }
}

// Dynamic rendering for development, static for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HireMePage() {
  const { categories, filters, services, portfolioCategories, portfolioProjects } = await getData();

  return (
    <HireMeClient 
      categories={categories}
      filters={filters}
      services={services}
      portfolioCategories={portfolioCategories}
      portfolioProjects={portfolioProjects}
    />
  );
}