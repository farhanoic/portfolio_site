import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Environment-aware configuration
const isDevelopment = process.env.NODE_ENV === 'development'

export const client = createClient({
  projectId: '0w8c4md0',
  dataset: 'production',
  // Disable CDN in development for real-time updates, enable in production for performance
  useCdn: !isDevelopment,
  apiVersion: '2024-01-01',
  // Add cache-busting in development
  perspective: isDevelopment ? 'drafts' : 'published',
})

// Create a separate client for live updates in development
export const liveClient = createClient({
  projectId: '0w8c4md0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  perspective: 'drafts',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}