export interface PortfolioProject {
  id: string;
  title: string;
  longDescription: string;
  category: 'Design' | 'Video' | 'Marketing' | 'Development';
  thumbnail: string;
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  client?: string;
  technologies?: string[];
  featured: boolean;
  createdAt: string;
}

export const portfolioProjects: PortfolioProject[] = [
  // Featured Creative Projects
  {
    id: 'brand-identity-design',
    title: 'Brand Identity Design',
    longDescription: 'Comprehensive brand identity design for a modern tech startup. This project involved creating a cohesive visual system including logo design, color palette, typography guidelines, and brand applications across various touchpoints.',
    category: 'Design',
    thumbnail: '/images/portfolio/brand-identity-thumb.jpg',
    client: 'TechFlow Startup',
    technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    featured: true,
    createdAt: '2024-11-01'
  },
  {
    id: 'product-demo-video',
    title: 'Product Demo Video',
    longDescription: 'High-impact product demonstration video featuring custom motion graphics, smooth transitions, and compelling storytelling. The video successfully increased product conversion rates by 40%.',
    category: 'Video',
    thumbnail: '/images/portfolio/product-demo-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    client: 'InnovateTech',
    technologies: ['Adobe Premiere Pro', 'After Effects', 'Cinema 4D'],
    featured: true,
    createdAt: '2024-10-01'
  },
  {
    id: 'ecommerce-platform',
    title: 'E-commerce Platform',
    longDescription: 'Complete e-commerce platform built with Next.js, featuring user authentication, product management, shopping cart, secure payments via Stripe, and admin dashboard.',
    category: 'Development',
    thumbnail: '/images/portfolio/ecommerce-thumb.jpg',
    demoUrl: 'https://demo-ecommerce.example.com',
    githubUrl: 'https://github.com/farhanoic/ecommerce-platform',
    client: 'RetailCorp',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'Tailwind CSS'],
    featured: true,
    createdAt: '2024-09-01'
  },
  {
    id: 'marketing-campaign',
    title: 'Marketing Campaign',
    longDescription: 'Comprehensive marketing campaign including social media strategy, content creation, email marketing templates, and performance analytics. Achieved 300% increase in brand awareness.',
    category: 'Marketing',
    thumbnail: '/images/portfolio/marketing-thumb.jpg',
    client: 'GrowthCo',
    technologies: ['Adobe Creative Suite', 'Canva', 'Analytics Tools'],
    featured: false,
    createdAt: '2024-08-01'
  },
  
  // Additional Creative Projects
  {
    id: 'corporate-video',
    title: 'Corporate Video',
    longDescription: 'Professional corporate video featuring executive interviews, company culture highlights, and custom animated graphics. Used for investor presentations and company website.',
    category: 'Video',
    thumbnail: '/images/portfolio/corporate-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    client: 'Enterprise Solutions Inc',
    technologies: ['Adobe Premiere Pro', 'After Effects', 'Audition'],
    featured: false,
    createdAt: '2024-07-01'
  },
  {
    id: 'mobile-app-ui',
    title: 'Mobile App UI Design',
    longDescription: 'Complete mobile app UI/UX design for a fitness tracking application. Includes user research, wireframing, prototyping, and final high-fidelity designs.',
    category: 'Design',
    thumbnail: '/images/portfolio/mobile-app-thumb.jpg',
    client: 'FitTrack App',
    technologies: ['Figma', 'Adobe XD', 'Principle'],
    featured: false,
    createdAt: '2024-06-01'
  },
  {
    id: 'api-development',
    title: 'RESTful API Development',
    longDescription: 'Robust RESTful API built with Node.js and Express, featuring JWT authentication, real-time WebSocket connections, comprehensive documentation, and automated testing.',
    category: 'Development',
    thumbnail: '/images/portfolio/api-thumb.jpg',
    githubUrl: 'https://github.com/farhanoic/api-project',
    client: 'DataFlow Systems',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
    featured: false,
    createdAt: '2024-05-01'
  },
  {
    id: 'social-media-content',
    title: 'Social Media Content Series',
    longDescription: 'Monthly social media content creation including graphics, short videos, and copy writing for Instagram, LinkedIn, and Twitter. Maintained consistent brand voice and visual identity.',
    category: 'Marketing',
    thumbnail: '/images/portfolio/social-content-thumb.jpg',
    client: 'Lifestyle Brand Co',
    technologies: ['Adobe Creative Suite', 'Canva', 'Figma'],
    featured: false,
    createdAt: '2024-04-01'
  },
  {
    id: 'youtube-channel-branding',
    title: 'YouTube Channel Branding',
    longDescription: 'Comprehensive YouTube channel branding including channel art, thumbnail templates, intro/outro animations, and brand guidelines for consistent content creation.',
    category: 'Design',
    thumbnail: '/images/portfolio/youtube-branding-thumb.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    client: 'Content Creator Pro',
    technologies: ['Adobe After Effects', 'Photoshop', 'Illustrator'],
    featured: false,
    createdAt: '2024-03-01'
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    longDescription: 'Custom portfolio website built with Next.js featuring smooth animations, dark/light theme, project showcase, and contact forms. Optimized for performance and SEO.',
    category: 'Development',
    thumbnail: '/images/portfolio/portfolio-website-thumb.jpg',
    demoUrl: 'https://developer-portfolio.example.com',
    githubUrl: 'https://github.com/farhanoic/portfolio-website',
    client: 'Personal Project',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    featured: false,
    createdAt: '2024-02-01'
  }
];

export const getProjectsByCategory = (category?: string) => {
  if (!category) return portfolioProjects;
  return portfolioProjects.filter(project => project.category === category);
};

export const getFeaturedProjects = () => {
  return portfolioProjects.filter(project => project.featured);
};

export const getProjectById = (id: string) => {
  return portfolioProjects.find(project => project.id === id);
};

export const getAllCategories = () => {
  const categories = [...new Set(portfolioProjects.map(project => project.category))];
  return categories;
};

