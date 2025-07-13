// Conditional PostCSS config that adapts to the environment
// Next.js uses Tailwind CSS v4, Sanity Studio needs minimal config

const isNextJs = process.env.NODE_ENV !== undefined && (
  process.argv.some(arg => arg.includes('next')) ||
  process.env.npm_lifecycle_event?.includes('dev') ||
  process.env.npm_lifecycle_event?.includes('build') ||
  process.env.npm_lifecycle_event?.includes('start')
);

const isSanity = process.argv.some(arg => arg.includes('sanity')) ||
  process.env.npm_lifecycle_event?.includes('sanity');

let config;

if (isSanity) {
  // Empty config for Sanity Studio (Vite handles its own styling)
  config = {
    plugins: []
  };
} else if (isNextJs) {
  // Next.js with Tailwind CSS v4
  config = {
    plugins: ["@tailwindcss/postcss"]
  };
} else {
  // Default fallback (empty for safety)
  config = {
    plugins: []
  };
}

export default config;