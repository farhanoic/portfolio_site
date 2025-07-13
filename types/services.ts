// TypeScript interfaces for Sanity service data

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface SanityFile {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: SanityImage;
  order: number;
}

export interface ServiceFilter {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    slug: string;
  };
  order: number;
}


export interface DemoVideo {
  url: string;
  title?: string;
}

export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  filter: {
    _id: string;
    name: string;
    slug: string;
  };
  thumbnail: SanityImage | string;
  // Legacy fields for backward compatibility
  demoVideo?: string;
  videoThumbnail?: SanityImage;
  // New multiple videos field
  demoVideos?: DemoVideo[];
  previewVideo?: SanityFile;
  price: string;
  duration: string;
  tags?: string[];
  order?: number;
}


// Component props interfaces
export interface ServiceCatalogProps {
  categories: ServiceCategory[];
  filters: ServiceFilter[];
  items: ServiceItem[];
}

export interface CategoryTabsProps {
  categories: ServiceCategory[];
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
}

export interface FilterButtonsProps {
  filters: ServiceFilter[];
  selectedFilter: string;
  onFilterChange: (filterSlug: string) => void;
}

export interface ServiceGridProps {
  items: ServiceItem[];
  onItemClick: (item: ServiceItem) => void;
}

export interface ServiceCardProps {
  item: ServiceItem;
  onClick: (item: ServiceItem) => void;
}

export interface ServiceModalProps {
  item: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}