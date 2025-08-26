# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-08-26-package-dependencies/spec.md

> Created: 2025-08-26
> Version: 1.0.0

## Technical Requirements

### Package Version Requirements

**Core Framework:**
- Astro: ^4.0.0 (minimum 4.0.0 for latest features and performance improvements)
- Node.js: >=18.0.0 (required for Astro 4.x compatibility)
- TypeScript: ^5.0.0 (for enhanced type checking and modern features)

**Styling and UI:**
- Tailwind CSS: ^3.4.0 (latest stable with container queries support)
- @tailwindcss/typography: ^0.5.10 (for rich text content styling)
- @tailwindcss/forms: ^0.5.7 (for form styling consistency)

**Development Tools:**
- @astro/check: ^0.5.0 (TypeScript and Astro diagnostics)
- @astro/ts-plugin: ^1.6.0 (TypeScript language server support)
- prettier: ^3.2.0 (code formatting)
- prettier-plugin-astro: ^0.13.0 (Astro-specific formatting)

**Astro Integrations:**
- @astrojs/tailwind: ^5.1.0 (Tailwind CSS integration)
- @astrojs/typescript: ^1.6.0 (TypeScript support)
- @astrojs/node: ^8.2.0 (Node.js adapter for SSR)
- @astrojs/sitemap: ^3.0.0 (automatic sitemap generation)

### Configuration File Specifications

**astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false, // Use custom base styles
    }),
    sitemap()
  ],
  output: 'hybrid', // Enable both static and server rendering
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://alnoor-bakery.com', // Production URL
  vite: {
    optimizeDeps: {
      include: ['@astrojs/typescript']
    }
  }
});
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          500: '#d97706',
          900: '#92400e'
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          900: '#14532d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
}
```

**tsconfig.json:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/styles/*": ["./src/styles/*"]
    },
    "types": ["astro/client"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Development Scripts and Commands

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "astro dev --host",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "type-check": "astro check --watch",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Environment Variable Templates

**.env.example:**
```bash
# Development Configuration
NODE_ENV=development
ASTRO_TELEMETRY_DISABLED=1

# Site Configuration
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME="Al-Noor Bakery"

# Analytics (Optional)
PUBLIC_ANALYTICS_ID=""

# Contact Form (Future)
CONTACT_EMAIL=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

### Integration Setup Requirements

**Directory Structure:**
```
src/
├── components/          # Reusable UI components
├── layouts/            # Page layouts
├── pages/              # Route pages
├── styles/             # Global styles
└── types/              # TypeScript definitions
```

**Import Path Aliases:**
- `@/` maps to `./src/`
- `@/components/` maps to `./src/components/`
- `@/layouts/` maps to `./src/layouts/`
- `@/styles/` maps to `./src/styles/`

### Performance Criteria

**Build Performance:**
- Build time: <30 seconds for initial build
- Incremental builds: <5 seconds for single file changes
- Bundle size: <500KB total JavaScript (excluding images)

**Runtime Performance:**
- First Contentful Paint (FCP): <1.5 seconds
- Largest Contentful Paint (LCP): <2.5 seconds
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**Development Experience:**
- Hot Module Replacement (HMR): <200ms update time
- TypeScript checking: Real-time error reporting
- Code formatting: Automatic on save

## Approach

### Implementation Strategy

1. **Package Installation Phase:**
   - Install core Astro framework and TypeScript
   - Add Tailwind CSS with required plugins
   - Install development tools and linting setup

2. **Configuration Phase:**
   - Configure Astro with hybrid rendering
   - Set up Tailwind with custom theme
   - Configure TypeScript with path aliases

3. **Validation Phase:**
   - Verify all integrations work correctly
   - Test build and development commands
   - Validate TypeScript compilation

### Migration Considerations

- Existing HTML/CSS will need conversion to Astro components
- Static assets will be moved to `public/` directory
- Styling will be migrated from custom CSS to Tailwind classes

## External Dependencies

### New Package Dependencies

**@astrojs/tailwind (^5.1.0):**
- **Purpose:** Official Astro integration for Tailwind CSS
- **Justification:** Provides seamless Tailwind integration with Astro's build system
- **Features:** Automatic PostCSS configuration, dev server integration

**@astrojs/sitemap (^3.0.0):**
- **Purpose:** Automatic sitemap.xml generation
- **Justification:** Essential for SEO and search engine indexing
- **Benefits:** Automatic discovery of all routes, configurable priority settings

**@astrojs/node (^8.2.0):**
- **Purpose:** Node.js adapter for server-side rendering
- **Justification:** Enables hybrid rendering for dynamic features
- **Capabilities:** Contact forms, dynamic content, server API routes

**@tailwindcss/typography (^0.5.10):**
- **Purpose:** Beautiful typography styles for content
- **Justification:** Professional styling for blog posts and content pages
- **Features:** Responsive typography, customizable prose styles

**@tailwindcss/forms (^0.5.7):**
- **Purpose:** Consistent form styling
- **Justification:** Professional appearance for contact and order forms
- **Benefits:** Cross-browser consistency, accessible form controls

**prettier-plugin-astro (^0.13.0):**
- **Purpose:** Code formatting for .astro files
- **Justification:** Maintains code quality and consistency
- **Integration:** Works with existing Prettier configuration

### Development Dependencies

**@astro/check (^0.5.0):**
- **Purpose:** TypeScript and Astro file validation
- **Justification:** Catches errors before deployment
- **Usage:** Pre-build validation, CI/CD integration

**@astro/ts-plugin (^1.6.0):**
- **Purpose:** Enhanced TypeScript support in IDEs
- **Justification:** Better developer experience with autocomplete and errors
- **Compatibility:** Works with VS Code, WebStorm, and other IDEs

### Version Requirements Rationale

- **Astro ^4.0.0:** Latest stable version with performance improvements and new features
- **TypeScript ^5.0.0:** Modern language features and better performance
- **Tailwind ^3.4.0:** Container queries and latest utility classes
- **Node.js >=18.0.0:** Required for Astro 4.x, provides modern JavaScript features

### Dependency Security

All specified versions are:
- Latest stable releases with security patches
- Actively maintained with regular updates
- Compatible with each other (no version conflicts)
- Suitable for production deployment