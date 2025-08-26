# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based bakery website project that follows Agent OS standards and uses modern web development practices. The project emphasizes static site generation with islands architecture, TypeScript, and Tailwind CSS.

## Development Environment

### Tech Stack

- **Framework**: Astro 4.0.0+ with TypeScript 5.0.0+
- **Package Manager**: pnpm (preferred) or npm
- **Node.js**: 20.0.0+ LTS
- **Styling**: Tailwind CSS with PostCSS
- **Backend**: Supabase for database and authentication
- **Payments**: Stripe integration
- **Testing**: Vitest with jsdom/happy-dom
- **E2E Testing**: Playwright
- **Deployment**: Vercel (primary) or Netlify

### Common Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:4321)
pnpm build                  # Build for production
pnpm preview               # Preview production build

# Code Quality
pnpm lint                  # Run ESLint
pnpm astro check          # TypeScript type checking
pnpm format               # Format code with Prettier

# Testing
pnpm test                 # Run unit tests with Vitest
pnpm test:watch           # Run tests in watch mode
pnpm test:e2e             # Run Playwright end-to-end tests
pnpm test:coverage        # Run tests with coverage report
```

## Architecture

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Modal)
│   ├── forms/        # Form components (ContactForm, NewsletterSignup)
│   ├── islands/      # Interactive components (Cart, UserProfile)
│   └── layouts/      # Layout components (Header, Footer, Navigation)
├── content/
│   ├── blog/         # Blog posts (Markdown/MDX)
│   ├── products/     # Product information
│   └── pages/        # Static page content
├── layouts/
│   ├── Layout.astro  # Base layout with SEO, meta tags
│   └── BlogPost.astro # Blog-specific layout
├── pages/
│   ├── api/          # API endpoints for forms, webhooks
│   ├── blog/         # Dynamic blog routes
│   └── products/     # Product catalog pages
├── stores/           # Nanostores for state management
├── lib/              # Utilities, API clients, constants
├── assets/           # Images, fonts, static assets
└── styles/           # Global CSS, Tailwind customizations
```

### Islands Architecture

- Use islands sparingly - most components should be static
- Interactive components: shopping cart, user authentication, forms
- Choose appropriate hydration strategies:
  - `client:load` - Critical for UX (modals, auth)
  - `client:visible` - Load when in viewport (carousels)
  - `client:idle` - Load when browser is idle (analytics)
  - `client:hover` - Load on user interaction (tooltips)

### Content Collections

The project uses Astro's content collections for type-safe content management:

- Blog posts with frontmatter validation
- Product catalog with schema validation
- SEO metadata and structured data

## Development Guidelines

### Code Style

- **Indentation**: 2 spaces (never tabs)
- **Variables/Methods**: snake_case
- **Classes/Modules**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Strings**: Single quotes, template literals for interpolation
- **Comments**: Explain "why" not "what", keep concise

### Component Patterns

- Static-first: Build components as static by default
- Props interface: Always define TypeScript interfaces for component props
- CSS Scoping: Use Astro's scoped styles or Tailwind classes
- Performance: Optimize images with Astro's Image component

### State Management

- Use Nanostores for client-side state
- Persistent stores for cart, user preferences
- Computed stores for derived values
- Keep state minimal and focused

### Testing Strategy

- Unit tests for utilities and non-UI logic
- Component tests using Astro Container API
- Integration tests for API routes
- E2E tests for critical user flows
- Content collection validation tests

## Backend Integration

### Supabase

- Database client configuration in `src/lib/supabase.ts`
- Row Level Security (RLS) for data protection
- Authentication with email/password and social providers
- Real-time subscriptions for dynamic content

### Stripe

- Payment processing for online orders
- Webhook handling for payment events
- Product catalog synchronization
- Subscription management (if applicable)

## Performance Considerations

### Static Site Generation

- Pre-render all pages at build time when possible
- Use dynamic imports for heavy components
- Implement image optimization with Astro's Image component
- Generate sitemaps and RSS feeds automatically

### Bundle Optimization

- Code splitting with dynamic imports
- Conditional script loading based on features
- Minimize client-side JavaScript
- Use View Transitions API for smooth navigation

## SEO & Accessibility

### SEO Implementation

- Structured data (JSON-LD) for rich snippets
- Open Graph and Twitter Card meta tags
- Canonical URLs and proper redirects
- XML sitemap generation
- RSS feeds for content

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Deployment & Environment

### Environment Variables

```bash
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# General
PUBLIC_SITE_URL=https://your-domain.com
```

### Build Configuration

- `astro.config.mjs` for framework configuration
- Hybrid output mode for static + SSR when needed
- Image optimization and domain allowlisting
- Integration setup for React, Tailwind, MDX

## Agent OS Integration

This project uses Agent OS standards with specialized agents and commands available:

### Available Agents

- `astro-expert` - Astro framework expertise
- `tailwind-expert` - Tailwind CSS styling
- `supabase-expert` - Database and authentication
- `stripe-expert` - Payment integration
- `design-expert` - UI/UX design patterns
- `test-runner` - Testing execution and analysis

### Custom Commands

- `/analyze-product` - Product requirements analysis
- `/plan-product` - Development planning
- `/create-tasks` - Task breakdown
- `/execute-tasks` - Task execution
- `/create-spec` - Technical specifications

When working on this project, leverage these specialized agents for complex tasks requiring domain expertise.
