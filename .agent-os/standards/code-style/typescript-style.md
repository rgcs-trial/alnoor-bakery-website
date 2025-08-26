# TypeScript Style Guide - Astro

## Code Formatting

### Indentation
- Use 2 spaces for indentation (never tabs)
- Consistent indentation throughout the file

### Semicolons
- Always use semicolons to terminate statements
- TypeScript will insert them automatically, but explicit is better

### Quotes  
- Use single quotes for strings by default
- Use double quotes when string contains single quotes
- Use template literals for string interpolation

```typescript
// Good
const message = 'Hello world'
const quote = "He said 'Hello'"
const interpolated = `Hello ${name}`

// Bad
const message = "Hello world"
const mixed = 'He said "Hello"'
```

## Naming Conventions

### Variables and Functions
- Use camelCase for variables, functions, and methods
- Use descriptive names that clearly indicate purpose

```typescript
// Good
const blogPostTitle = 'My First Post'
const calculateReadingTime = (content: string) => { }

// Bad
const bpt = 'My First Post'  
const calc = (content: string) => { }
```

### Types and Interfaces
- Use PascalCase for types, interfaces, and classes
- Use descriptive names that indicate the shape of data

```typescript
// Good
interface BlogPost {
  id: string
  title: string
  content: string
  publishedAt: Date
}

type CollectionEntry<T> = {
  id: string
  slug: string
  data: T
}

// Bad  
interface blogPost {
  id: string
  title: string
}
```

### Constants
- Use UPPER_SNAKE_CASE for module-level constants
- Use camelCase for local constants

```typescript
// Module level
const SITE_CONFIG = {
  title: 'My Astro Site',
  description: 'Built with Astro and TypeScript'
}

const MAX_POSTS_PER_PAGE = 10

// Local scope
const defaultOptions = { format: 'json' }
```

### Enums
- Use PascalCase for enum names
- Use PascalCase for enum values

```typescript
enum PostStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived'
}
```

## Astro-Specific Conventions

### Component Script Tags
- Use TypeScript in all Astro components
- Organize imports and logic clearly

```astro
---
// Type imports first
import type { CollectionEntry } from 'astro:content'

// Astro imports
import { getCollection } from 'astro:content'
import Layout from '../layouts/Layout.astro'

// Component imports
import BlogCard from '../components/BlogCard.astro'

// Types for component props
export interface Props {
  posts: CollectionEntry<'blog'>[]
  currentPage: number
}

// Get component props
const { posts, currentPage } = Astro.props

// Logic and data fetching
const featuredPosts = posts.filter(post => post.data.featured)
---
```

### Component Props Typing
- Always define Props interface for components with props
- Use optional properties with default values when appropriate

```astro
---
export interface Props {
  title: string
  description?: string
  image?: string
  showDate?: boolean
}

const { 
  title, 
  description, 
  image,
  showDate = true 
} = Astro.props
---

<article>
  <h1>{title}</h1>
  {description && <p class="description">{description}</p>}
  {image && <img src={image} alt={title} />}
  {showDate && <time>{new Date().toLocaleDateString()}</time>}
</article>
```

### Content Collections
- Use strong typing for content collections
- Define schemas for content validation

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    author: z.object({
      name: z.string(),
      email: z.string().email()
    }),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false)
  })
})

export const collections = {
  blog: blogCollection
}

// Usage in pages
---
import type { GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPosts = await getCollection('blog')
  
  return blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }))
}

export interface Props {
  post: CollectionEntry<'blog'>
}

const { post } = Astro.props
const { Content } = await post.render()
---
```

## API Routes and Server-Side Code

### API Route Structure
- Use proper TypeScript types for request and response
- Handle all HTTP methods explicitly
- Include proper error responses

```typescript
// src/pages/api/blog/[slug].ts
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params

  if (!slug) {
    return new Response(
      JSON.stringify({ error: 'Slug parameter is required' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const posts = await getCollection('blog')
    const post = posts.find(p => p.slug === slug)

    if (!post) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        title: post.data.title,
        description: post.data.description,
        publishedAt: post.data.publishedAt
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.title || !body.content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Process the request
    // ... implementation

    return new Response(
      JSON.stringify({ success: true, id: 'new-post-id' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create post' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
```

### Server-Side Functions
- Create reusable server-side utilities
- Use proper error handling and type safety

```typescript
// src/lib/blog.ts
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export interface PaginatedPosts {
  posts: CollectionEntry<'blog'>[]
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export async function getPaginatedPosts(
  page: number = 1,
  postsPerPage: number = 10
): Promise<PaginatedPosts> {
  const allPosts = await getCollection('blog')
  
  // Sort by published date (newest first)
  const sortedPosts = allPosts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  
  const posts = sortedPosts.slice(startIndex, endIndex)

  return {
    posts,
    currentPage: page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

export async function getPostBySlug(
  slug: string
): Promise<CollectionEntry<'blog'> | null> {
  const posts = await getCollection('blog')
  return posts.find(post => post.slug === slug) || null
}

export async function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  limit: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const allPosts = await getCollection('blog')
  
  // Filter out current post and drafts
  const otherPosts = allPosts.filter(
    post => post.slug !== currentPost.slug && !post.data.draft
  )

  // Simple related posts based on shared tags
  if (currentPost.data.tags && currentPost.data.tags.length > 0) {
    const relatedPosts = otherPosts.filter(post => 
      post.data.tags?.some(tag => 
        currentPost.data.tags!.includes(tag)
      )
    )
    
    if (relatedPosts.length >= limit) {
      return relatedPosts.slice(0, limit)
    }
  }

  // Fallback to latest posts
  return otherPosts
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
    .slice(0, limit)
}
```

## Import/Export Organization

### Import Order (Astro-specific)
1. Type-only imports
2. Astro imports (astro:* modules)
3. Framework imports (React, Vue, etc. if used)
4. Third-party library imports
5. Internal components and utilities
6. Relative imports

```typescript
// 1. Type-only imports
import type { CollectionEntry } from 'astro:content'
import type { MarkdownHeading } from 'astro'

// 2. Astro imports
import { getCollection } from 'astro:content'
import { Image } from 'astro:assets'

// 3. Framework imports (if using UI frameworks)
import { useState } from 'react'

// 4. Third-party libraries
import { format } from 'date-fns'

// 5. Internal imports
import Layout from '../../layouts/Layout.astro'
import BlogCard from '../../components/BlogCard.astro'

// 6. Relative imports
import './styles.css'
```

### Export Patterns
- Use named exports for utilities and types
- Use default exports for Astro components and pages

```typescript
// Good - named exports for utilities
export const formatDate = (date: Date): string => { }
export const slugify = (text: string): string => { }

// Good - types
export interface SiteConfig {
  title: string
  description: string
}

// Good - default export for main component
export default function BlogPost() {
  return <article>...</article>
}
```

## Error Handling

### Content Collection Errors
- Handle missing content gracefully
- Provide fallbacks for optional data

```typescript
// src/pages/blog/[slug].astro
---
import type { GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const blogPosts = await getCollection('blog')
    
    return blogPosts.map((post) => ({
      params: { slug: post.slug },
      props: { post }
    }))
  } catch (error) {
    console.error('Failed to load blog posts:', error)
    return []
  }
}

export interface Props {
  post: CollectionEntry<'blog'>
}

const { post } = Astro.props

// Handle missing post data
if (!post) {
  return Astro.redirect('/404')
}

let content = ''
try {
  const { Content } = await post.render()
  // Use Content component in template
} catch (error) {
  console.error(`Failed to render post ${post.slug}:`, error)
  // Provide fallback content
}
---
```

### Client-Side Error Handling
```typescript
// For client-side scripts
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Client-side logic
    initializeApp()
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // Show user-friendly error message
    showErrorMessage('Something went wrong. Please refresh the page.')
  }
})

function showErrorMessage(message: string): void {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error-message'
  errorDiv.textContent = message
  document.body.appendChild(errorDiv)
}
```

## Common Anti-Patterns

### Type Assertions
```typescript
// Bad - unnecessary type assertion
const post = data as BlogPost

// Good - type guard or proper typing
function isValidBlogPost(data: unknown): data is BlogPost {
  return typeof data === 'object' && 
         data !== null &&
         typeof (data as BlogPost).title === 'string'
}

if (isValidBlogPost(data)) {
  const post = data // TypeScript knows this is BlogPost
}
```

### Any Types
```typescript
// Bad - using any
function processContent(data: any) {
  return data.content
}

// Good - proper typing with generics
function processContent<T extends { content: string }>(data: T): string {
  return data.content
}
```

### Missing Error Handling in Async Operations
```typescript
// Bad - no error handling
const posts = await getCollection('blog')

// Good - proper error handling
try {
  const posts = await getCollection('blog')
  // Process posts
} catch (error) {
  console.error('Failed to load posts:', error)
  // Handle error appropriately
}
```

## Static Site Generation Best Practices

### Dynamic Route Generation
```typescript
// src/pages/blog/page/[page].astro
---
import type { GetStaticPaths } from 'astro'
import type { PaginateFunction } from 'astro'

export const getStaticPaths: GetStaticPaths = async ({ paginate }) => {
  const posts = await getCollection('blog')
  const sortedPosts = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())

  return paginate(sortedPosts, {
    pageSize: 10,
    params: { page: 'page' },
    props: { posts: sortedPosts }
  })
}

const { page } = Astro.props
---
```

### SEO and Meta Tags
```astro
---
export interface Props {
  title: string
  description?: string
  image?: string
  canonicalURL?: string
}

const { 
  title, 
  description = 'Default site description',
  image = '/default-og-image.jpg',
  canonicalURL = new URL(Astro.url.pathname, Astro.site)
} = Astro.props
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image, Astro.site)} />
  <meta property="og:url" content={canonicalURL} />
  <link rel="canonical" href={canonicalURL} />
</head>
```

This TypeScript style guide ensures clean, type-safe, and maintainable Astro applications following modern TypeScript and Astro best practices.