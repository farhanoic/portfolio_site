// Client showcase types

export interface CreativeClient {
  clientName: string;
  clientLogo?: string;
  clientSlug: string;
  projectCount: number;
  featured?: boolean;
  industry?: string;
  website?: string;
  _createdAt: string;
}

export interface CreativeClientWithProjects extends CreativeClient {
  projects: {
    _id: string;
    name: string;
    kind: string;
    durationType: string;
    featured?: boolean;
    _createdAt: string;
  }[];
  featuredProjectCount: number;
  latestProject?: {
    name: string;
    _createdAt: string;
  };
}

export interface ClientShowcaseProps {
  clients: CreativeClient[];
  animationDelay?: number;
}