# Technical Stack

## Core Framework
- **Application Framework:** Astro 4.0.0+ with TypeScript 5.0.0+
- **JavaScript Framework:** Minimal client-side JavaScript with Astro islands architecture
- **Import Strategy:** node (Node.js module resolution)
- **Node.js:** 20.0.0+ LTS
- **Package Manager:** pnpm (preferred)

## Frontend Stack
- **CSS Framework:** Tailwind CSS 3.4.0+ with PostCSS
- **UI Component Library:** Custom Astro components with Tailwind
- **Fonts Provider:** Google Fonts (for Arabic/English typography support)
- **Icon Library:** Lucide React or Astro Icon
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints

## Backend & Database
- **Database System:** Supabase (PostgreSQL-based)
- **Database Hosting:** Supabase Cloud
- **Authentication:** Supabase Auth (if needed for admin features)
- **File Storage:** Supabase Storage (for menu item images)

## Content Management
- **Content Strategy:** Astro Content Collections for structured data
- **Menu Data:** TypeScript schemas with Zod validation
- **Image Optimization:** Astro's built-in Image component with Sharp
- **Static Generation:** Build-time generation for optimal performance

## Deployment & Hosting
- **Application Hosting:** Vercel (primary) with automatic deployments
- **Asset Hosting:** Vercel Edge Network (CDN)
- **Deployment Solution:** Vercel CLI with GitHub integration
- **SSL/Security:** Automatic HTTPS with Vercel

## Development Tools
- **Code Repository:** GitHub
- **Code Quality:** ESLint, Prettier, TypeScript strict mode
- **Testing Framework:** Vitest for unit tests
- **E2E Testing:** Playwright for user journey testing
- **Dev Environment:** VS Code with Astro extension

## External Integrations
- **Ordering System:** External ordering application (redirect-based)
- **Contact Forms:** Supabase for form submission storage
- **Phone Integration:** Click-to-call functionality (tel: links)
- **Maps Integration:** Google Maps or similar for location display

## Performance Optimization
- **Static Site Generation:** Pre-rendered pages for optimal loading
- **Image Optimization:** WebP format with responsive sizing
- **Code Splitting:** Automatic with Astro's build system
- **Caching Strategy:** Static assets cached at CDN level

## SEO & Analytics
- **Meta Tags:** Comprehensive OpenGraph and Twitter Card support
- **Structured Data:** JSON-LD for restaurant/bakery schema
- **Sitemap:** Auto-generated XML sitemap
- **Analytics:** Google Analytics or similar (if required)