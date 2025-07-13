import { type SchemaTypeDefinition } from 'sanity'
import { serviceCategory } from './serviceCategory'
import { serviceFilter } from './serviceFilter'
import { service } from './service'
import { portfolioCategory } from './portfolioCategory'
import { portfolioProject } from './portfolioProject'
import { blogCategory } from './blogCategory'
import { blogPost } from './blogPost'
import { resourceCategory } from './resourceCategory'
import { resource } from './resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Service schemas
    serviceCategory, 
    serviceFilter, 
    service,
    // Portfolio schemas
    portfolioCategory,
    portfolioProject,
    // Blog schemas
    blogCategory,
    blogPost,
    // Resource schemas
    resourceCategory,
    resource,
  ],
}