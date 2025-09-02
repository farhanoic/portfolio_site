# Farhan Azhar - Portfolio

A modern, minimalistic portfolio website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Sanity CMS for content management.

> Live at: [farhanoic.me](https://farhanoic.me)

## 🚀 Features

- **Modern Design**: Clean, minimalistic design with dark theme
- **Smooth Animations**: Powered by Framer Motion for delightful user experiences
- **Responsive**: Mobile-first approach ensuring great experience across all devices
- **Performance Optimized**: Built with Next.js 15 and App Router for optimal performance
- **Type Safe**: Full TypeScript implementation
- **Content Management**: Sanity CMS integration for dynamic content
- **Blog System**: Full-featured blog with categories, tags, and reading progress
- **Portfolio Projects**: Dynamic project showcase with filtering
- **Services & Resources**: Professional services and resource listings
- **Accessible**: Designed with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui mono theme
- **CMS**: Sanity v3 for content management
- **Animations**: Framer Motion
- **Font**: Geist Mono
- **Icons**: Lucide Icons, Heroicons and custom SVGs
- **Forms**: React Hook Form with server actions
- **Email**: Resend for contact form submissions

## 📋 Sections

1. **Hero**: Animated introduction with name and title
2. **About**: Personal bio with statistics and call-to-action
3. **Skills**: Interactive skills showcase with categories
4. **Portfolio**: Dynamic project showcase from Sanity CMS
5. **Services**: Professional services offerings
6. **Blog**: Full-featured blog system with categories and tags
7. **Resources**: Curated development resources and tools
8. **Contact**: Contact form with social links and email integration

## 🎨 Design System

- **Background**: Dark (#0a0a0a) / Light (#fafafa)
- **Foreground**: White (#fafafa) / Dark (#737373)
- **Primary**: Gray (#737373)
- **Accent**: Subtle accent colors for highlights
- **Typography**: Geist Mono for clean, modern aesthetic

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/farhanoic/farhanoic.portfolio.git
   cd farhanoic.portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token

   # Resend (for contact form)
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=your_from_email
   RESEND_TO_EMAIL=your_to_email
   ```

4. **Set up Sanity Studio**
   ```bash
   cd sanity
   npm install
   npm run dev
   ```
   Access Sanity Studio at [http://localhost:3333](http://localhost:3333)

5. **Start development server**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Scripts

### Main Project
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Sanity Studio
- `cd sanity && npm run dev` - Start Sanity Studio locally
- `cd sanity && npm run deploy` - Deploy Sanity Studio
- `cd sanity && npm run build` - Build Sanity Studio

## 🎯 Customization

### Colors
Update the CSS variables in `app/globals.css` to customize the color scheme.

### Content Management
Most content is managed through Sanity CMS:
1. Access Sanity Studio at `/sanity` or `localhost:3333`
2. Create and manage:
   - Portfolio Projects
   - Blog Posts and Categories
   - Services
   - Resources
   - FAQ items

### Static Content
Some content remains in component files:
- `components/sections/hero.tsx` - Hero section content
- `components/sections/about.tsx` - About section content
- `components/sections/skills.tsx` - Skills and technologies
- `lib/author-constants.ts` - Author information for blog

### Animations
Framer Motion configurations can be adjusted in each component to customize animations.

## 📱 Responsive Design

The portfolio is built with a mobile-first approach:
- Mobile: Optimized for touch interactions
- Tablet: Adapted layouts for medium screens
- Desktop: Full-featured experience with hover effects

## ⚡ Performance Features

- **Image Optimization**: Next.js Image component with Sanity image pipeline
- **Code Splitting**: Automatic code splitting with App Router
- **ISR**: Incremental Static Regeneration for dynamic content
- **Font Optimization**: Optimized Google Fonts loading
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size
- **Turbopack**: Fast development builds with Turbopack
- **Server Components**: Optimal client/server component balance
- **Edge Runtime**: Contact form API uses Edge Runtime for faster responses

## 🔧 Configuration

### Sanity Configuration
1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Configure CORS origins in Sanity dashboard
3. Create an API token with read permissions
4. Update environment variables with your project details

### Deployment

#### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

#### Other Platforms
The portfolio works with any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

### Post-Deployment
1. Update CORS origins in Sanity for your production URL
2. Configure domain in your hosting provider
3. Set up analytics (optional)

## 📚 Content Schemas

### Portfolio Project
- title, slug, longDescription
- category, workType, client
- thumbnail, videoUrl
- demoUrl, githubUrl
- technologies, featured, order

### Blog Post
- title, slug, excerpt, content
- category, tags
- featuredImage, publishedAt
- readingTime, featured

### Service
- title, slug, description
- icon, features, order

### Resource
- title, description, url
- category, tags, featured

## 🐛 Known Issues

- Draft content from Sanity won't appear on the website (only published content)
- Hydration warnings may appear in development (fixed in production)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Contact

- **Email**: hello@farhanoic.me
- **Website**: [farhanoic.me](https://farhanoic.me)
- **LinkedIn**: [linkedin.com/in/farhanoic](https://linkedin.com/in/farhanoic)
- **GitHub**: [github.com/farhanoic](https://github.com/farhanoic)

---

Built with ❤️ by Farhan Azhar
