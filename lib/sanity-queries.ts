import { groq } from 'next-sanity';

// =============================================================================
// BLOG QUERIES
// =============================================================================

// Query to fetch all blog categories
export const blogCategoriesQuery = groq`
  *[_type == "blogCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    color,
    order
  }
`;

// Query to fetch all published blog posts with pagination
export const blogPostsQuery = groq`
  {
    "posts": *[_type == "blogPost" && status == "published"] | order(publishedAt desc) [$offset...$limit] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      excerpt,
      "featuredImage": coalesce(featuredImage.asset->url, ""),
      "featuredImageAlt": featuredImage.alt,
      category->{
        _id,
        name,
        "slug": slug.current,
        color
      },
      tags,
      publishedAt,
      readingTime,
      featured,
      seo
    },
    "total": count(*[_type == "blogPost" && status == "published"])
  }
`;

// Query to fetch blog posts by category with pagination
export const blogPostsByCategoryQuery = groq`
  {
    "posts": *[_type == "blogPost" && status == "published" && category->slug.current == $categorySlug] | order(publishedAt desc) [$offset...$limit] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      excerpt,
      "featuredImage": coalesce(featuredImage.asset->url, ""),
      "featuredImageAlt": featuredImage.alt,
      category->{
        _id,
        name,
        "slug": slug.current,
        color
      },
      tags,
      publishedAt,
      readingTime,
      featured,
      seo
    },
    "total": count(*[_type == "blogPost" && status == "published" && category->slug.current == $categorySlug])
  }
`;

// Query to fetch a single blog post by slug
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    content,
    "featuredImage": coalesce(featuredImage.asset->url, ""),
    "featuredImageAlt": featuredImage.alt,
    category->{
      _id,
      name,
      "slug": slug.current,
      color
    },
    tags,
    publishedAt,
    readingTime,
    featured,
    seo,
    relatedPosts[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "featuredImage": coalesce(featuredImage.asset->url, ""),
      "featuredImageAlt": featuredImage.alt,
      publishedAt,
      readingTime,
      category->{
        name,
        color
      }
    }
  }
`;

// Query to fetch related blog posts (by category and tags)
export const relatedBlogPostsQuery = groq`
  *[
    _type == "blogPost" && 
    status == "published" && 
    slug.current != $slug && 
    (
      category._ref in *[_type == "blogPost" && slug.current == $slug][0].category._ref ||
      count(tags[@ in *[_type == "blogPost" && slug.current == $slug][0].tags]) > 0
    )
  ] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "featuredImage": coalesce(featuredImage.asset->url, ""),
    "featuredImageAlt": featuredImage.alt,
    category->{
      name,
      color
    },
    tags,
    publishedAt,
    readingTime,
    featured
  }
`;

// Query to fetch featured blog posts
export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && status == "published" && featured == true] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "featuredImage": coalesce(featuredImage.asset->url, ""),
    "featuredImageAlt": featuredImage.alt,
    category->{
      name,
      color
    },
    publishedAt,
    readingTime
  }
`;


// =============================================================================
// SERVICE QUERIES (EXISTING)
// =============================================================================

// Query to fetch all service categories
export const serviceCategoriesQuery = groq`
  *[_type == "serviceCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    order
  }
`;

// Query to fetch all service filters
export const serviceFiltersQuery = groq`
  *[_type == "serviceFilter"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    category->{
      _id,
      "slug": slug.current
    },
    order
  }
`;

// Query to fetch all services with full details
export const servicesQuery = groq`
  *[_type == "service"] | order(_createdAt desc) {
    _id,
    title,
    description,
    thumbnail,
    demoVideo,
    videoThumbnail,
    demoVideos[]{
      url,
      title
    },
    price,
    duration,
    category->{
      _id,
      "slug": slug.current,
      name
    },
    filter->{
      _id,
      "slug": slug.current,
      name
    },
    tags[],
    _createdAt
  }
`;

// Query to fetch services by category
export const servicesByCategoryQuery = groq`
  *[_type == "service" && category->slug.current == $categorySlug] | order(_createdAt desc) {
    _id,
    title,
    description,
    thumbnail,
    demoVideo,
    videoThumbnail,
    demoVideos[]{
      url,
      title
    },
    price,
    duration,
    category->{
      _id,
      "slug": slug.current,
      name
    },
    filter->{
      _id,
      "slug": slug.current,
      name
    },
    tags[],
    _createdAt
  }
`;

// Query to fetch services by filter
export const servicesByFilterQuery = groq`
  *[_type == "service" && filter->slug.current == $filterSlug] | order(_createdAt desc) {
    _id,
    title,
    description,
    thumbnail,
    demoVideo,
    videoThumbnail,
    demoVideos[]{
      url,
      title
    },
    price,
    duration,
    category->{
      _id,
      "slug": slug.current,
      name
    },
    filter->{
      _id,
      "slug": slug.current,
      name
    },
    tags[],
    _createdAt
  }
`;

// Query to fetch a single service by ID
export const serviceByIdQuery = groq`
  *[_type == "service" && _id == $serviceId][0] {
    _id,
    title,
    description,
    thumbnail,
    demoVideo,
    videoThumbnail,
    demoVideos[]{
      url,
      title
    },
    price,
    duration,
    category->{
      _id,
      "slug": slug.current,
      name
    },
    filter->{
      _id,
      "slug": slug.current,
      name
    },
    tags[],
    _createdAt,
    _updatedAt
  }
`;

// Combined query to fetch all data for the service catalog
export const servicesCatalogQuery = groq`
  {
    "categories": *[_type == "serviceCategory"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      icon,
      order
    },
    "filters": *[_type == "serviceFilter"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      category->{
        _id,
        "slug": slug.current
      },
      order
    },
    "services": *[_type == "service"] | order(_createdAt desc) {
      _id,
      title,
      description,
      thumbnail,
      demoVideo,
      videoThumbnail,
      demoVideos[]{
        url,
        title
      },
      price,
      duration,
      category->{
        _id,
        "slug": slug.current,
        name
      },
      filter->{
        _id,
        "slug": slug.current,
        name
      },
      tags[],
      gallery[]{
        _type,
        _type == "image" => {
          asset,
          alt
        },
        _type == "videoItem" => {
          videoUrl,
          title,
          description
        }
      },
      process[]{
        title,
        description
      },
      _createdAt
    }
  }
`;

// Portfolio Queries

// Query to fetch all portfolio categories
export const portfolioCategoriesQuery = groq`
  *[_type == "portfolioCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    order
  }
`;

// Query to fetch all portfolio projects
export const portfolioProjectsQuery = groq`
  *[_type == "portfolioProject"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    longDescription,
    thumbnail,
    videoUrl,
    demoUrl,
    githubUrl,
    client,
    technologies[],
    featured,
    order,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    workType,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch portfolio projects by category
export const portfolioProjectsByCategoryQuery = groq`
  *[_type == "portfolioProject" && category->slug.current == $categorySlug] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    longDescription,
    thumbnail,
    videoUrl,
    demoUrl,
    githubUrl,
    client,
    technologies[],
    featured,
    order,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    workType,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch featured portfolio projects
export const featuredPortfolioProjectsQuery = groq`
  *[_type == "portfolioProject" && featured == true] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    longDescription,
    thumbnail,
    videoUrl,
    demoUrl,
    githubUrl,
    client,
    technologies[],
    featured,
    order,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    workType,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single portfolio project by ID
export const portfolioProjectByIdQuery = groq`
  *[_type == "portfolioProject" && _id == $projectId][0] {
    _id,
    title,
    "slug": slug.current,
    longDescription,
    thumbnail,
    videoUrl,
    demoUrl,
    githubUrl,
    client,
    technologies[],
    featured,
    order,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    workType,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single portfolio project by slug
export const portfolioProjectBySlugQuery = groq`
  *[_type == "portfolioProject" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    longDescription,
    thumbnail,
    videoUrl,
    demoUrl,
    githubUrl,
    client,
    technologies[],
    featured,
    order,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    workType,
    _createdAt,
    _updatedAt
  }
`;

// Combined query to fetch all portfolio data
export const portfolioCatalogQuery = groq`
  {
    "categories": *[_type == "portfolioCategory"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      order
    },
    "projects": *[_type == "portfolioProject"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      longDescription,
      thumbnail,
      videoUrl,
      demoUrl,
      githubUrl,
      client,
      technologies[],
      featured,
      order,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      workType,
      _createdAt,
      _updatedAt
    }
  }
`;

// =============================================================================
// RESOURCE QUERIES
// =============================================================================

// Query to fetch all resource categories
export const resourceCategoriesQuery = groq`
  *[_type == "resourceCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    order
  }
`;

// Query to fetch all resources
export const resourcesQuery = groq`
  *[_type == "resource"] | order(featured desc, order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    url,
    icon,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    tags[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch resources by category
export const resourcesByCategoryQuery = groq`
  *[_type == "resource" && category->slug.current == $categorySlug] | order(featured desc, order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    url,
    icon,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    tags[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch featured resources
export const featuredResourcesQuery = groq`
  *[_type == "resource" && featured == true] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    url,
    icon,
    category->{
      _id,
      name,
      "slug": slug.current
    },
    tags[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Combined query to fetch all resource data
export const resourcesCatalogQuery = groq`
  {
    "categories": *[_type == "resourceCategory"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      icon,
      order
    },
    "resources": *[_type == "resource"] | order(featured desc, order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      url,
      icon,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      tags[],
      featured,
      order,
      _createdAt,
      _updatedAt
    }
  }
`;