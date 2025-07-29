import { type SchemaTypeDefinition } from 'sanity'
import { serviceCategory } from './serviceCategory'
import { serviceFilter } from './serviceFilter'
import { service } from './service'
import { developmentProject } from './developmentProject'
import { creativeProject } from './creativeProject'
import { client } from './client'
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
    // Project schemas
    developmentProject,
    creativeProject,
    client,
    // Blog schemas
    blogCategory,
    blogPost,
    // Resource schemas
    resourceCategory,
    resource,
  ],
}