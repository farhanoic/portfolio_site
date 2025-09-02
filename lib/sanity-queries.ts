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
    blogPosts[]{
      title,
      url
    },
    useCases[],
    toolType,
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
    blogPosts[]{
      title,
      url
    },
    useCases[],
    toolType,
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
    blogPosts[]{
      title,
      url
    },
    useCases[],
    toolType,
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
      blogPosts[]{
        title,
        url
      },
      useCases[],
      toolType,
      _createdAt,
      _updatedAt
    }
  }
`;

// =============================================================================
// DEVELOPMENT PROJECT QUERIES
// =============================================================================

// Query to fetch all development projects
export const developmentProjectsQuery = groq`
  *[_type == "developmentProject"] | order(featured desc, _createdAt desc) {
    _id,
    projectName,
    "slug": slug.current,
    description,
    thumbnail,
    clientName,
    clientLogo,
    techStack[],
    githubLink,
    siteLink,
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch featured development projects
export const featuredDevelopmentProjectsQuery = groq`
  *[_type == "developmentProject" && featured == true] | order(order asc, _createdAt desc) {
    _id,
    projectName,
    "slug": slug.current,
    description,
    thumbnail,
    clientName,
    clientLogo,
    techStack[],
    githubLink,
    siteLink,
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single development project by ID
export const developmentProjectByIdQuery = groq`
  *[_type == "developmentProject" && _id == $projectId][0] {
    _id,
    projectName,
    "slug": slug.current,
    description,
    thumbnail,
    clientName,
    clientLogo,
    techStack[],
    githubLink,
    siteLink,
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single development project by slug
export const developmentProjectBySlugQuery = groq`
  *[_type == "developmentProject" && slug.current == $slug][0] {
    _id,
    projectName,
    "slug": slug.current,
    description,
    thumbnail,
    clientName,
    clientLogo,
    techStack[],
    githubLink,
    siteLink,
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// =============================================================================
// CREATIVE PROJECT QUERIES
// =============================================================================

// Query to fetch all creative projects
export const creativeProjectsQuery = groq`
  *[_type == "creativeProject"] | order(featured desc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch creative projects by kind
export const creativeProjectsByKindQuery = groq`
  *[_type == "creativeProject" && kind == $kind] | order(featured desc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch creative projects by duration type
export const creativeProjectsByDurationQuery = groq`
  *[_type == "creativeProject" && durationType == $durationType] | order(featured desc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch featured creative projects
export const featuredCreativeProjectsQuery = groq`
  *[_type == "creativeProject" && featured == true] | order(order asc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single creative project by ID
export const creativeProjectByIdQuery = groq`
  *[_type == "creativeProject" && _id == $projectId][0] {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query to fetch a single creative project by slug
export const creativeProjectBySlugQuery = groq`
  *[_type == "creativeProject" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    thumbnail,
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo, clientLogo),
    kind,
    durationType,
    videoLink,
    softwareTools[],
    featured,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Combined query to fetch all project data
export const projectsCatalogQuery = groq`
  {
    "developmentProjects": *[_type == "developmentProject"] | order(featured desc, _createdAt desc) {
      _id,
      projectName,
      "slug": slug.current,
      description,
      thumbnail,
      clientName,
      clientLogo,
      techStack[],
      githubLink,
      siteLink,
      featured,
      order,
      _createdAt,
      _updatedAt
    },
    "creativeProjects": *[_type == "creativeProject"] | order(featured desc, _createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      thumbnail,
      "clientName": coalesce(client->name, clientName),
      "clientLogo": coalesce(client->logo, clientLogo),
      kind,
      durationType,
      videoLink,
      softwareTools[],
      featured,
      order,
      _createdAt,
      _updatedAt
    }
  }
`;

// =============================================================================
// CLIENT SHOWCASE QUERIES
// =============================================================================

// Query to fetch unique clients from creative projects for the client showcase
export const creativeClientsQuery = groq`
  *[_type == "creativeProject" && defined(coalesce(client->name, clientName))] {
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo.asset->url, clientLogo.asset->url),
    "clientSlug": coalesce(client->slug.current, clientName),
    "featured": featured,
    "industry": client->industry,
    "website": client->website,
    _createdAt
  } | order(featured desc, _createdAt desc)
`;

// Query to fetch clients with their project counts and latest project info
export const creativeClientsWithProjectsQuery = groq`
  *[_type == "creativeProject" && defined(coalesce(client->name, clientName))] {
    "clientName": coalesce(client->name, clientName),
    "clientLogo": coalesce(client->logo.asset->url, clientLogo.asset->url),
    "clientSlug": coalesce(client->slug.current, clientName),
    "industry": client->industry,
    "website": client->website,
    "projects": *[_type == "creativeProject" && coalesce(client->name, clientName) == ^.clientName] | order(_createdAt desc) {
      _id,
      name,
      kind,
      durationType,
      featured,
      _createdAt
    },
    "projectCount": count(*[_type == "creativeProject" && coalesce(client->name, clientName) == ^.clientName]),
    "featuredProjectCount": count(*[_type == "creativeProject" && featured == true && coalesce(client->name, clientName) == ^.clientName]),
    "latestProject": *[_type == "creativeProject" && coalesce(client->name, clientName) == ^.clientName] | order(_createdAt desc)[0] {
      name,
      _createdAt
    },
    _createdAt
  } | order(featuredProjectCount desc, projectCount desc, _createdAt desc)
`;