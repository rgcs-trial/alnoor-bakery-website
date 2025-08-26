# Astro Best Practices

## Overview

This document outlines best practices for Astro development with TypeScript, islands architecture, content collections, and static site generation following Agent OS standards.

{% if context.project_type == 'astro' %}
## Astro Architecture Patterns

### Islands Architecture
- Use islands sparingly for interactive components
- Keep most components static for optimal performance
- Choose appropriate hydration strategy

```astro
---
// Counter.astro - Interactive island
export interface Props {
  initialCount?: number
}

const { initialCount = 0 } = Astro.props
---

<div class="counter" data-initial-count={initialCount}>
  <button class="counter__button counter__button--decrement">-</button>
  <span class="counter__value">{initialCount}</span>
  <button class="counter__button counter__button--increment">+</button>
</div>

<script>
  // Client-side hydration
  class Counter extends HTMLElement {
    constructor() {
      super()
      this.count = parseInt(this.dataset.initialCount || '0')
      this.render()
      this.attachEventListeners()
    }

    attachEventListeners() {
      this.querySelector('.counter__button--increment')?.addEventListener('click', () => {
        this.count++
        this.render()
      })

      this.querySelector('.counter__button--decrement')?.addEventListener('click', () => {
        this.count--
        this.render()
      })
    }

    render() {
      const valueElement = this.querySelector('.counter__value')
      if (valueElement) {
        valueElement.textContent = this.count.toString()
      }
    }
  }

  customElements.define('astro-counter', Counter)
</script>

<style>
  .counter {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
  }

  .counter__button {
    width: 2rem;
    height: 2rem;
    border: none;
    background: var(--color-primary);
    color: white;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: bold;
  }

  .counter__button:hover {
    background: var(--color-primary-dark);
  }

  .counter__value {
    font-size: 1.25rem;
    font-weight: bold;
    min-width: 2rem;
    text-align: center;
  }
</style>
```

### Static-First Components
- Build components as static by default
- Add interactivity only when necessary
- Use server-side rendering for better performance

```astro
---
// BlogCard.astro - Static component
import type { CollectionEntry } from 'astro:content'
import { Image } from 'astro:assets'

export interface Props {
  post: CollectionEntry<'blog'>
  featured?: boolean
}

const { post, featured = false } = Astro.props
const { title, description, publishedAt, author, image } = post.data
---

<article class:list={['blog-card', { 'blog-card--featured': featured }]}>
  {image && (
    <div class="blog-card__image">
      <Image src={image} alt={title} width={400} height={200} />
    </div>
  )}
  
  <div class="blog-card__content">
    <h3 class="blog-card__title">
      <a href={`/blog/${post.slug}`}>{title}</a>
    </h3>
    
    {description && (
      <p class="blog-card__excerpt">{description}</p>
    )}
    
    <div class="blog-card__meta">
      <time datetime={publishedAt.toISOString()}>
        {publishedAt.toLocaleDateString()}
      </time>
      {author && <span class="blog-card__author">by {author.name}</span>}
    </div>
  </div>
</article>
```
{% endif %}

{% if context.contains('content-collections') %}
## Content Collections Patterns

### Schema Definition
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    author: z.object({
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url().optional()
    }),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonical: z.string().url().optional()
    }).optional()
  })
})

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    status: z.enum(['in-progress', 'completed', 'archived']),
    startDate: z.date(),
    endDate: z.date().optional(),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false)
  })
})

export const collections = {
  blog: blogCollection,
  projects: projectCollection
}
```

### Dynamic Route Generation
```astro
---
// src/pages/blog/[...slug].astro
import type { GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import BlogLayout from '../../layouts/BlogLayout.astro'

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPosts = await getCollection('blog', (entry) => {
    return !entry.data.draft || import.meta.env.DEV
  })

  return blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }))
}

export interface Props {
  post: CollectionEntry<'blog'>
}

const { post } = Astro.props
const { Content, headings } = await post.render()

// Generate related posts
const relatedPosts = await getCollection('blog', (entry) => {
  return entry.slug !== post.slug &&
         !entry.data.draft &&
         entry.data.tags.some(tag => post.data.tags.includes(tag))
})
---

<BlogLayout 
  title={post.data.seo?.title || post.data.title}
  description={post.data.seo?.description || post.data.description}
  canonical={post.data.seo?.canonical}
  publishedAt={post.data.publishedAt}
  author={post.data.author}
  headings={headings}
>
  <article class="blog-post">
    <header class="blog-post__header">
      <h1 class="blog-post__title">{post.data.title}</h1>
      
      <div class="blog-post__meta">
        <time class="blog-post__date" datetime={post.data.publishedAt.toISOString()}>
          {post.data.publishedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        
        <address class="blog-post__author">
          By {post.data.author.name}
        </address>
        
        {post.data.tags.length > 0 && (
          <div class="blog-post__tags">
            {post.data.tags.map(tag => (
              <a href={`/tags/${tag}`} class="tag">{tag}</a>
            ))}
          </div>
        )}
      </div>
    </header>
    
    <div class="blog-post__content">
      <Content />
    </div>
  </article>
  
  {relatedPosts.length > 0 && (
    <aside class="related-posts">
      <h2>Related Posts</h2>
      <div class="related-posts__grid">
        {relatedPosts.slice(0, 3).map(relatedPost => (
          <BlogCard post={relatedPost} />
        ))}
      </div>
    </aside>
  )}
</BlogLayout>
```
{% endif %}

## Performance Best Practices

### Image Optimization
```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'

export interface Props {
  src: ImageMetadata | string
  alt: string
  priority?: boolean
  sizes?: string
}

const { src, alt, priority = false, sizes } = Astro.props
---

<div class="optimized-image">
  <Image
    src={src}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    decoding={priority ? 'sync' : 'async'}
    quality={85}
    format="webp"
    sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    class="optimized-image__img"
  />
</div>

<style>
  .optimized-image {
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
  }

  .optimized-image__img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }

  .optimized-image:hover .optimized-image__img {
    transform: scale(1.05);
  }
</style>
```

### Bundle Optimization
```astro
---
// Dynamic imports for non-critical components
const HeavyComponent = import.meta.env.SSR 
  ? await import('../components/HeavyComponent.astro')
  : null

// Conditional loading based on user preferences
const userPreferences = Astro.cookies.get('preferences')?.json() || {}
const enableAnimations = userPreferences.animations !== false
---

<div class="page">
  <main class="page__content">
    <slot />
  </main>
  
  {HeavyComponent && (
    <aside class="page__sidebar">
      <HeavyComponent.default />
    </aside>
  )}
</div>

{enableAnimations && (
  <style>
    .page {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
)}

<script>
  // Load analytics only in production
  if (import.meta.env.PROD) {
    import('../scripts/analytics.js').then(({ initAnalytics }) => {
      initAnalytics()
    })
  }
</script>
```

### Static Site Generation
```astro
---
// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('blog')
  const projects = await getCollection('projects')
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${site}blog/${post.slug}</loc>
    <lastmod>${post.data.updatedAt?.toISOString() || post.data.publishedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${projects.map(project => `
  <url>
    <loc>${site}projects/${project.slug}</loc>
    <lastmod>${project.data.endDate?.toISOString() || project.data.startDate.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
```

## Testing Best Practices

### Component Testing
```typescript
// tests/components/BlogCard.test.ts
import { test, expect } from 'vitest'
import { render } from '@testing-library/dom'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BlogCard from '../../src/components/BlogCard.astro'

test('BlogCard renders correctly', async () => {
  const container = await AstroContainer.create()
  
  const mockPost = {
    slug: 'test-post',
    data: {
      title: 'Test Blog Post',
      description: 'This is a test post',
      publishedAt: new Date('2024-01-01'),
      author: { name: 'John Doe', email: 'john@example.com' },
      tags: ['test', 'blog'],
      featured: false,
      draft: false
    }
  }

  const result = await container.renderToString(BlogCard, {
    props: { post: mockPost }
  })

  expect(result).toContain('Test Blog Post')
  expect(result).toContain('This is a test post')
  expect(result).toContain('by John Doe')
})

test('BlogCard handles featured posts', async () => {
  const container = await AstroContainer.create()
  
  const featuredPost = {
    slug: 'featured-post',
    data: {
      title: 'Featured Post',
      description: 'This is featured',
      publishedAt: new Date('2024-01-01'),
      author: { name: 'Jane Doe', email: 'jane@example.com' },
      tags: [],
      featured: true,
      draft: false
    }
  }

  const result = await container.renderToString(BlogCard, {
    props: { post: featuredPost, featured: true }
  })

  expect(result).toContain('blog-card--featured')
})
```

### Content Collection Testing
```typescript
// tests/content/blog.test.ts
import { test, expect } from 'vitest'
import { getCollection } from 'astro:content'

test('blog collection returns valid posts', async () => {
  const posts = await getCollection('blog')
  
  expect(posts.length).toBeGreaterThan(0)
  
  posts.forEach(post => {
    expect(post.data.title).toBeTruthy()
    expect(post.data.description).toBeTruthy()
    expect(post.data.publishedAt).toBeInstanceOf(Date)
    expect(post.data.author.name).toBeTruthy()
    expect(post.data.author.email).toMatch(/\S+@\S+\.\S+/)
  })
})

test('blog collection filters draft posts in production', async () => {
  const publishedPosts = await getCollection('blog', (entry) => {
    return !entry.data.draft
  })
  
  publishedPosts.forEach(post => {
    expect(post.data.draft).toBeFalsy()
  })
})
```

### API Route Testing
```typescript
// tests/api/blog.test.ts
import { test, expect } from 'vitest'
import { GET } from '../../src/pages/api/blog/[slug].ts'

test('API returns blog post data', async () => {
  const mockRequest = new Request('http://localhost:3000/api/blog/test-post')
  const mockParams = { slug: 'test-post' }
  const mockProps = { params: mockParams, request: mockRequest }

  const response = await GET(mockProps)
  const data = await response.json()

  expect(response.status).toBe(200)
  expect(data.title).toBeTruthy()
  expect(data.description).toBeTruthy()
})

test('API returns 404 for non-existent post', async () => {
  const mockRequest = new Request('http://localhost:3000/api/blog/non-existent')
  const mockParams = { slug: 'non-existent' }
  const mockProps = { params: mockParams, request: mockRequest }

  const response = await GET(mockProps)

  expect(response.status).toBe(404)
})
```

## SEO and Metadata

### SEO Component
```astro
---
// src/components/SEO.astro
export interface Props {
  title: string
  description: string
  image?: string
  canonical?: string
  type?: 'website' | 'article'
  publishedAt?: Date
  updatedAt?: Date
  author?: string
  tags?: string[]
}

const {
  title,
  description,
  image = '/default-og-image.jpg',
  canonical,
  type = 'website',
  publishedAt,
  updatedAt,
  author,
  tags = []
} = Astro.props

const site = Astro.site || new URL(Astro.url.origin)
const canonicalURL = canonical ? new URL(canonical, site) : new URL(Astro.url.pathname, site)
const imageURL = new URL(image, site)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': type === 'article' ? 'Article' : 'WebPage',
  headline: title,
  description,
  image: imageURL.toString(),
  url: canonicalURL.toString(),
  ...(type === 'article' && {
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString() || publishedAt?.toISOString(),
    keywords: tags.join(', ')
  })
}
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={imageURL} />

<!-- Article-specific meta -->
{type === 'article' && (
  <>
    {author && <meta name="author" content={author} />}
    {publishedAt && <meta property="article:published_time" content={publishedAt.toISOString()} />}
    {updatedAt && <meta property="article:modified_time" content={updatedAt.toISOString()} />}
    {tags.map(tag => (
      <meta property="article:tag" content={tag} />
    ))}
  </>
)}

<!-- JSON-LD structured data -->
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

## Common Anti-Patterns to Avoid

### ❌ Don't Overuse Islands
```astro
<!-- Bad - Making everything an island -->
<div>
  <Header client:load />
  <Navigation client:load />
  <Sidebar client:load />
  <Footer client:load />
</div>

<!-- Good - Use islands selectively -->
<div>
  <Header />  <!-- Static -->
  <Navigation />  <!-- Static -->
  <InteractiveSearchBox client:idle />  <!-- Island only when needed -->
  <Footer />  <!-- Static -->
</div>
```

### ❌ Don't Ignore Hydration Strategies
```astro
<!-- Bad - Using client:load for everything -->
<Modal client:load />
<Tooltip client:load />
<Carousel client:load />

<!-- Good - Choose appropriate hydration -->
<Modal client:only="react" />  <!-- Critical for UX -->
<Tooltip client:hover />  <!-- Load on interaction -->
<Carousel client:visible />  <!-- Load when in viewport -->
```

### ❌ Don't Skip Content Validation
```typescript
// Bad - No schema validation
const blogCollection = defineCollection({
  type: 'content'
  // No schema - accepts any data
})

// Good - Strict schema validation
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(200),
    publishedAt: z.date(),
    author: z.object({
      name: z.string(),
      email: z.string().email()
    }),
    draft: z.boolean().default(false)
  })
})
```

### ❌ Don't Ignore Performance Implications
```astro
<!-- Bad - Loading heavy scripts on every page -->
<script src="/heavy-animation-library.js"></script>
<script src="/unused-utility-library.js"></script>

<!-- Good - Load scripts conditionally -->
{needsAnimations && (
  <script>
    import('/scripts/animation-library.js').then(({ initAnimations }) => {
      initAnimations()
    })
  </script>
)}
```

### ❌ Don't Forget Static Generation Benefits
```astro
<!-- Bad - Client-side data fetching for static content -->
<div id="blog-posts"></div>
<script>
  fetch('/api/blog-posts')
    .then(res => res.json())
    .then(posts => {
      // Render posts client-side
    })
</script>

<!-- Good - Generate at build time -->
---
const posts = await getCollection('blog')
---

<div class="blog-posts">
  {posts.map(post => (
    <BlogCard post={post} />
  ))}
</div>
```

This comprehensive guide ensures maintainable, performant, and SEO-friendly Astro applications following modern static site generation best practices and Agent OS standards.