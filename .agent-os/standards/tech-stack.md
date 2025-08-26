# Astro Tech Stack

## Overview

This document defines the complete technology stack for Astro projects with conditional sections based on project requirements and context.

{% if context.project_type == 'astro' %}
## Core Framework

### Astro & Islands Architecture
- **Astro**: 4.0.0+ (latest with View Transitions)
- **Node.js**: 20.0.0+ LTS
- **TypeScript**: 5.0.0+ (strict mode enabled)
- **Package Manager**: pnpm (preferred) or npm

### Development Environment
- **IDE**: VS Code with Astro extension
- **Dev Tools**: Astro Dev Toolbar, Browser DevTools
- **Hot Reload**: Astro's built-in HMR
{% endif %}

{% if context.contains('supabase') %}
## Backend & Database

### Supabase (Primary Backend)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.0.10",
    "@astrojs/node": "^8.0.0"
  }
}
```

### Supabase Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)
```

### Supabase Auth Integration
```typescript
// src/lib/auth.ts
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthState {
  user: User | null
  loading: boolean
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
```
{% endif %}

{% if context.contains('tailwind') or context.contains('styling') %}
## UI Framework & Styling

### Tailwind CSS + Astro Components
```json
{
  "devDependencies": {
    "@astrojs/tailwind": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

### UI Components (Astro + Alpine.js)
```json
{
  "dependencies": {
    "@astrojs/alpinejs": "^0.4.0",
    "alpinejs": "^3.13.0",
    "@astrojs/react": "^3.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## Islands Architecture

### Framework Integrations
```json
{
  "dependencies": {
    "@astrojs/react": "^3.0.0",
    "@astrojs/vue": "^4.0.0",
    "@astrojs/svelte": "^5.0.0",
    "@astrojs/solid-js": "^4.0.0"
  }
}
```

### Example Island Component
```astro
---
// src/components/UserProfile.astro
export interface Props {
  userId: string
  client?: 'react' | 'vue' | 'svelte'
}

const { userId, client = 'react' } = Astro.props
---

<div id="user-profile" data-user-id={userId}>
  {client === 'react' && (
    <UserProfileReact userId={userId} client:load />
  )}
  {client === 'vue' && (
    <UserProfileVue userId={userId} client:visible />
  )}
  {client === 'svelte' && (
    <UserProfileSvelte userId={userId} client:idle />
  )}
</div>
```

## Content Management

### Content Collections
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
})

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sidebar: z.object({
      order: z.number(),
      label: z.string().optional(),
    }).optional(),
  }),
})

export const collections = { blog, docs }
```

### MDX Integration
```json
{
  "dependencies": {
    "@astrojs/mdx": "^2.0.0",
    "@astrojs/remark-reading-time": "^2.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.0.0"
  }
}
```

## State Management

### Astro Stores (Nano Stores)
```json
{
  "dependencies": {
    "nanostores": "^0.9.5",
    "@nanostores/persistent": "^0.10.0"
  }
}
```

### Store Examples
```typescript
// src/stores/auth.ts
import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type { User } from '@supabase/supabase-js'

export const $user = persistentAtom<User | null>('user', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const $isAuthenticated = computed($user, (user) => !!user)

export const $userRole = computed($user, (user) => user?.role || 'guest')
```

```typescript
// src/stores/cart.ts
import { map } from 'nanostores'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const $cart = map<Record<string, CartItem>>({})

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const currentCart = $cart.get()
  const existingItem = currentCart[item.id]
  
  $cart.setKey(item.id, {
    ...item,
    quantity: existingItem ? existingItem.quantity + 1 : 1,
  })
}

export function removeFromCart(itemId: string) {
  $cart.setKey(itemId, undefined)
}
```

## Testing Framework

### Testing Dependencies
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "happy-dom": "^12.10.0",
    "@testing-library/dom": "^9.3.0",
    "@testing-library/user-event": "^14.5.0",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { getViteConfig } from 'astro/config'

export default defineConfig(
  getViteConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  })
)
```

### Test Setup
```typescript
// src/test/setup.ts
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/dom'

// Mock environment variables
beforeAll(() => {
  Object.defineProperty(import.meta, 'env', {
    value: {
      PUBLIC_SUPABASE_URL: 'http://localhost:54321',
      PUBLIC_SUPABASE_ANON_KEY: 'test-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    },
    writable: true,
  })
})

// Cleanup after each test
afterEach(cleanup)
```

## Payments Integration

### Stripe
```json
{
  "dependencies": {
    "stripe": "^14.7.0",
    "@stripe/stripe-js": "^2.2.0"
  }
}
```

### Stripe Integration
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side
export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Client-side
export const stripePromise = loadStripe(
  import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY
)
```

## Build & Deployment

### Astro Configuration
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import alpinejs from '@astrojs/alpinejs'
import node from '@astrojs/node'

export default defineConfig({
  output: 'hybrid', // or 'server' for full SSR
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind(),
    react(),
    mdx(),
    alpinejs(),
  ],
  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/react']
    },
  },
})
```

## Deployment & Hosting

### Vercel Deployment
```json
{
  "scripts": {
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

### Vercel Configuration
```json
// vercel.json
{
  "framework": "astro",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": "dist",
  "env": {
    "PUBLIC_SUPABASE_URL": "@supabase-url",
    "PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
  }
}
```

### Netlify Alternative
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[dev]
  command = "pnpm dev"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

## Performance Optimization

### Image Optimization
```json
{
  "dependencies": {
    "@astrojs/image": "^0.18.0",
    "sharp": "^0.32.6"
  }
}
```

```astro
---
// Using Astro's Image component
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'
---

<Image 
  src={heroImage}
  alt="Hero image"
  width={800}
  height={600}
  format="webp"
  loading="lazy"
/>
```

### View Transitions
```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'
---

<html>
<head>
  <ViewTransitions />
  <title>My Astro Site</title>
</head>
<body>
  <slot />
</body>
</html>
```

## Additional Utilities

### Form Handling
```json
{
  "dependencies": {
    "simple-body-validator": "^1.2.0",
    "@astrojs/check": "^0.3.0"
  }
}
```

### Date/Time
```json
{
  "dependencies": {
    "date-fns": "^2.30.0",
    "@formkit/tempo": "^0.1.0"
  }
}
```

### Icons
```json
{
  "dependencies": {
    "@astrojs/react": "^3.0.0",
    "lucide-react": "^0.294.0",
    "astro-icon": "^1.0.0"
  }
}
```

### SEO & Analytics
```json
{
  "dependencies": {
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/partytown": "^2.0.0"
  }
}
```

## Environment Configuration

### Environment Variables
```bash
# .env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

PUBLIC_SITE_URL=http://localhost:4321
```

### Type Safety for Env
```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_ROLE_KEY: string
  readonly STRIPE_SECRET_KEY: string
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  readonly PUBLIC_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Project Structure Template

### Recommended Astro Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   ├── islands/      # Interactive components
│   └── layouts/      # Layout components
├── content/
│   ├── blog/         # Blog posts (Markdown/MDX)
│   └── docs/         # Documentation
├── layouts/
│   ├── Layout.astro  # Base layout
│   └── BlogPost.astro
├── pages/
│   ├── api/          # API endpoints
│   ├── auth/         # Auth pages
│   └── blog/         # Dynamic routes
├── stores/           # Nano stores
├── lib/              # Utilities
├── assets/           # Static assets
└── styles/           # Global styles
```

## CI/CD Integration

### GitHub Actions for Astro
```yaml
# .github/workflows/astro.yml
name: Astro CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm astro check
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Development Tools

### Code Quality
```json
{
  "devDependencies": {
    "@astrojs/check": "^0.3.0",
    "typescript": "^5.0.0",
    "eslint": "^8.54.0",
    "eslint-plugin-astro": "^0.29.0",
    "prettier": "^3.1.0",
    "prettier-plugin-astro": "^0.12.0"
  }
}
```

### ESLint Configuration
```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Astro-specific rules
      },
    },
  ],
}
```

### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

## Conditional Context Loading

```astro
---
{% if context.project_type == 'astro' %}
// Astro specific configuration
import type { APIRoute } from 'astro'
{% endif %}

{% if context.contains('supabase') %}
import { supabase } from '@/lib/supabase'
{% endif %}

{% if context.contains('stripe') %}
import { stripe } from '@/lib/stripe'
{% endif %}

{% if context.contains('tailwind') %}
import '@/styles/globals.css'
{% endif %}
---
```

This comprehensive tech stack provides a modern, performant foundation for Astro applications with islands architecture, Supabase backend integration, Stripe payments, and optimal deployment strategies for static site generation with selective server-side rendering.