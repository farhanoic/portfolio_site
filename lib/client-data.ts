// Client showcase configuration for the Design/Video Editor section
// Note: Client data is now fetched from Sanity CMS instead of hardcoded arrays

// Legacy hardcoded data - no longer used (kept for reference)
// Client data is now fetched dynamically from Sanity CMS via getCreativeClients()
export const creativeClients = [
  // This data is no longer used - clients are fetched from Sanity CMS
  // See: /lib/sanity-data.ts -> getCreativeClients()
  // See: /types/clients.ts for TypeScript interfaces
  ['IIT Madras', 'Paradox Fest', 'Tech Startup Inc', 'Creative Agency'],
];

// Configuration options
export const clientShowcaseConfig = {
  // Time each set is displayed (in milliseconds)
  cycleDuration: 4000,
  
  // Animation settings
  animationDuration: 0.8,
  staggerDelay: 0.15,
  
  // Display settings
  showHeader: true,
  headerText: 'Trusted by Amazing Clients',
  projectTypeText: 'Creative Project',
};