# Astro Component Style Guide

## Component Structure

### File Naming
- Use PascalCase for component files
- Include `.astro` extension for Astro components
- Keep component names descriptive and specific

```
components/
├── Layout.astro
├── BlogCard.astro
├── NavigationMenu.astro
├── SocialLinks.astro
└── ContactForm.astro
```

### Component Definition
- Always use TypeScript in the frontmatter
- Define Props interface when component accepts props
- Organize frontmatter logically

```astro
---
// BlogCard.astro
import type { CollectionEntry } from 'astro:content'
import { Image } from 'astro:assets'

export interface Props {
  post: CollectionEntry<'blog'>
  showExcerpt?: boolean
  featured?: boolean
}

const { post, showExcerpt = true, featured = false } = Astro.props
const { title, description, publishedAt, author, image } = post.data
---

<article class:list={['blog-card', { featured }]}>
  {image && (
    <div class="blog-card__image">
      <Image src={image} alt={title} width={400} height={200} />
    </div>
  )}
  
  <div class="blog-card__content">
    <h3 class="blog-card__title">
      <a href={`/blog/${post.slug}`}>{title}</a>
    </h3>
    
    {showExcerpt && description && (
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

<style>
  .blog-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }

  .blog-card:hover {
    transform: translateY(-2px);
  }

  .blog-card.featured {
    border: 2px solid var(--accent-color);
  }

  .blog-card__image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .blog-card__content {
    padding: 1rem;
  }

  .blog-card__title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .blog-card__title a {
    color: inherit;
    text-decoration: none;
  }

  .blog-card__title a:hover {
    color: var(--accent-color);
  }

  .blog-card__excerpt {
    margin: 0 0 1rem 0;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .blog-card__meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-muted);
  }
</style>
```

## Frontmatter Organization

### Script Section Structure
- Type imports first
- Astro core imports
- Third-party library imports
- Local component imports
- Props interface definition
- Component logic
- Data fetching

```astro
---
// 1. Type imports
import type { CollectionEntry } from 'astro:content'
import type { ImageMetadata } from 'astro'

// 2. Astro core imports
import { getCollection } from 'astro:content'
import { Image } from 'astro:assets'

// 3. Third-party imports
import { format } from 'date-fns'

// 4. Local component imports
import Layout from '../layouts/Layout.astro'
import BlogCard from '../components/BlogCard.astro'

// 5. Props interface
export interface Props {
  title: string
  posts?: CollectionEntry<'blog'>[]
}

// 6. Component props
const { title, posts } = Astro.props

// 7. Component logic
const currentYear = new Date().getFullYear()
const formattedTitle = title.toUpperCase()

// 8. Data fetching
const allPosts = posts || await getCollection('blog')
const featuredPosts = allPosts.filter(post => post.data.featured)
---
```

### Props and Data Handling
- Use destructuring for props
- Provide default values for optional props
- Validate required props

```astro
---
export interface Props {
  title: string
  description?: string
  showHeader?: boolean
  posts: CollectionEntry<'blog'>[]
  maxPosts?: number
}

const { 
  title, 
  description = 'Welcome to our blog',
  showHeader = true,
  posts,
  maxPosts = 6
} = Astro.props

// Validate required props
if (!title) {
  throw new Error('Title prop is required')
}

if (!posts || posts.length === 0) {
  throw new Error('Posts array is required and cannot be empty')
}

// Process data
const displayedPosts = posts.slice(0, maxPosts)
---
```

## Template Syntax

### Conditional Rendering
- Use logical AND (&&) for simple conditionals
- Use ternary operator for if/else rendering
- Extract complex conditions to variables

```astro
---
const { user, posts, showSidebar } = Astro.props
const shouldShowWelcome = user && user.isFirstVisit
const postCount = posts?.length || 0
---

<div class="container">
  <!-- Simple conditional -->
  {showSidebar && (
    <aside class="sidebar">
      <h3>Recent Posts</h3>
    </aside>
  )}
  
  <!-- If/else conditional -->
  {postCount > 0 ? (
    <div class="posts-grid">
      {posts.map(post => (
        <BlogCard post={post} />
      ))}
    </div>
  ) : (
    <div class="no-posts">
      <p>No posts available yet.</p>
    </div>
  )}
  
  <!-- Complex condition extracted -->
  {shouldShowWelcome && (
    <div class="welcome-banner">
      <h2>Welcome to our blog, {user.name}!</h2>
    </div>
  )}
</div>
```

### List Rendering
- Always provide stable keys for list items
- Handle empty states explicitly
- Use semantic HTML elements

```astro
---
const { posts, categories } = Astro.props
---

<section class="blog-posts">
  <h2>Latest Blog Posts</h2>
  
  {posts.length > 0 ? (
    <div class="posts-grid">
      {posts.map((post) => (
        <BlogCard 
          key={post.id} 
          post={post}
          showExcerpt={true}
        />
      ))}
    </div>
  ) : (
    <div class="empty-state">
      <p>No blog posts found.</p>
      <a href="/admin/new-post">Create your first post</a>
    </div>
  )}
</section>

<aside class="categories">
  <h3>Categories</h3>
  
  {categories && categories.length > 0 && (
    <ul class="category-list">
      {categories.map((category) => (
        <li key={category.slug}>
          <a href={`/category/${category.slug}`}>
            {category.name} ({category.count})
          </a>
        </li>
      ))}
    </ul>
  )}
</aside>
```

### Dynamic Attributes
- Use `class:list` for conditional classes
- Use template literals for dynamic values
- Handle undefined/null values gracefully

```astro
---
const { 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  href,
  children 
} = Astro.props

const baseClasses = 'btn'
const variantClass = `btn--${variant}`
const sizeClass = `btn--${size}`
---

<!-- Dynamic classes with class:list -->
<button 
  class:list={[
    baseClasses,
    variantClass,
    sizeClass,
    { 'btn--disabled': disabled }
  ]}
  disabled={disabled}
  type={href ? undefined : 'button'}
>
  {href ? (
    <a href={href} class="btn__link">
      <slot />
    </a>
  ) : (
    <slot />
  )}
</button>

<!-- Dynamic attributes -->
<img 
  src={`/images/${imageName}.jpg`}
  alt={altText || 'Default alt text'}
  loading={priority ? 'eager' : 'lazy'}
  class:list={['image', { 'image--hero': isHero }]}
/>
```

## Component Communication

### Slots Usage
- Use default slots for main content
- Use named slots for specific sections
- Provide fallback content when appropriate

```astro
---
// Card.astro
export interface Props {
  title?: string
  variant?: 'default' | 'featured' | 'compact'
}

const { title, variant = 'default' } = Astro.props
---

<div class:list={['card', `card--${variant}`]}>
  {title && (
    <div class="card__header">
      <h3 class="card__title">{title}</h3>
      <slot name="header-actions" />
    </div>
  )}
  
  <div class="card__body">
    <slot>
      <!-- Fallback content -->
      <p>No content provided</p>
    </slot>
  </div>
  
  <div class="card__footer">
    <slot name="footer">
      <!-- Optional footer with fallback -->
      <p class="card__meta">
        <slot name="meta" />
      </p>
    </slot>
  </div>
</div>

<!-- Usage -->
<Card title="Blog Post" variant="featured">
  <p>This is the main content of the card.</p>
  
  <div slot="header-actions">
    <button>Edit</button>
    <button>Delete</button>
  </div>
  
  <time slot="meta">March 15, 2024</time>
</Card>
```

### Component Composition
- Create small, focused components
- Compose complex UIs from simple components
- Avoid deep component hierarchies

```astro
---
// BlogPostLayout.astro
import type { CollectionEntry } from 'astro:content'

import Layout from './Layout.astro'
import BlogHeader from '../components/BlogHeader.astro'
import BlogMeta from '../components/BlogMeta.astro'
import BlogContent from '../components/BlogContent.astro'
import BlogNavigation from '../components/BlogNavigation.astro'
import RelatedPosts from '../components/RelatedPosts.astro'

export interface Props {
  post: CollectionEntry<'blog'>
  relatedPosts?: CollectionEntry<'blog'>[]
}

const { post, relatedPosts } = Astro.props
const { Content } = await post.render()
---

<Layout title={post.data.title} description={post.data.description}>
  <article class="blog-post">
    <BlogHeader 
      title={post.data.title}
      image={post.data.image}
    />
    
    <BlogMeta 
      publishedAt={post.data.publishedAt}
      author={post.data.author}
      tags={post.data.tags}
      readingTime={post.data.readingTime}
    />
    
    <BlogContent>
      <Content />
    </BlogContent>
    
    {relatedPosts && relatedPosts.length > 0 && (
      <RelatedPosts posts={relatedPosts} />
    )}
  </article>
  
  <BlogNavigation currentSlug={post.slug} />
</Layout>
```

## CSS and Styling

### Component-Scoped Styles
- Use scoped styles for component-specific CSS
- Organize CSS logically within components
- Use CSS custom properties for theming

```astro
---
export interface Props {
  title: string
  featured?: boolean
}

const { title, featured = false } = Astro.props
---

<div class:list={['hero', { 'hero--featured': featured }]}>
  <h1 class="hero__title">{title}</h1>
  <div class="hero__content">
    <slot />
  </div>
</div>

<style>
  /* Component variables */
  .hero {
    --hero-padding: 4rem 2rem;
    --hero-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --hero-text-color: white;
  }

  /* Base styles */
  .hero {
    padding: var(--hero-padding);
    background: var(--hero-bg);
    color: var(--hero-text-color);
    text-align: center;
    position: relative;
  }

  /* Modifiers */
  .hero--featured {
    --hero-padding: 6rem 2rem;
    --hero-bg: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  }

  /* Elements */
  .hero__title {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    margin: 0 0 2rem 0;
    line-height: 1.1;
  }

  .hero__content {
    max-width: 60ch;
    margin: 0 auto;
    font-size: 1.125rem;
    line-height: 1.6;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .hero {
      --hero-padding: 3rem 1rem;
    }

    .hero__title {
      font-size: 2rem;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .hero {
      --hero-bg: linear-gradient(135deg, #2d3561 0%, #c850c0 100%);
    }
  }
</style>
```

### Global Styles Integration
- Import global styles when needed
- Use CSS custom properties for consistency
- Implement proper cascade and specificity

```astro
---
// Layout.astro
export interface Props {
  title: string
  description?: string
}

const { title, description } = Astro.props
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  
  <body>
    <header class="site-header">
      <slot name="header" />
    </header>
    
    <main class="site-main">
      <slot />
    </main>
    
    <footer class="site-footer">
      <slot name="footer" />
    </footer>
  </body>
</html>

<style is:global>
  /* Global CSS custom properties */
  :root {
    --color-primary: #3366cc;
    --color-secondary: #dc3545;
    --color-success: #28a745;
    --color-warning: #ffc107;
    --color-danger: #dc3545;
    
    --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-family-mono: 'Fira Code', 'JetBrains Mono', monospace;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 3rem;
    
    --border-radius: 0.375rem;
    --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  /* Reset and base styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-family-sans);
    line-height: 1.6;
  }

  /* Layout components */
  .site-header,
  .site-main,
  .site-footer {
    width: 100%;
  }

  .site-main {
    min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
  }

  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }
</style>
```

## Performance Best Practices

### Image Optimization
- Use Astro's Image component for optimization
- Provide appropriate alt text
- Use lazy loading for non-critical images

```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'

export interface Props {
  post: {
    title: string
    image?: ImageMetadata
    imageAlt?: string
  }
  priority?: boolean
}

const { post, priority = false } = Astro.props
---

<article class="post">
  <header class="post__header">
    {post.image && (
      <div class="post__image">
        <Image 
          src={post.image}
          alt={post.imageAlt || post.title}
          width={800}
          height={400}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          quality={85}
          format="webp"
        />
      </div>
    )}
    
    <h1 class="post__title">{post.title}</h1>
  </header>
  
  <div class="post__content">
    <slot />
  </div>
</article>
```

### Script Optimization
- Use client directives appropriately
- Minimize client-side JavaScript
- Load scripts only when needed

```astro
---
// Only load JavaScript when necessary
const needsInteractivity = Astro.props.interactive || false
---

<div class="interactive-component">
  <slot />
  
  {needsInteractivity && (
    <button id="toggle-btn" class="toggle-button">
      Toggle Feature
    </button>
  )}
</div>

{needsInteractivity && (
  <script>
    // Client-side script only when component is interactive
    document.addEventListener('DOMContentLoaded', () => {
      const toggleBtn = document.getElementById('toggle-btn')
      
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          // Interactive functionality
          document.body.classList.toggle('feature-active')
        })
      }
    })
  </script>
)}

<style>
  .interactive-component {
    position: relative;
  }

  .toggle-button {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .toggle-button:hover {
    background: var(--color-primary-dark, #2555aa);
  }
</style>
```

## Common Anti-Patterns

### ❌ Don't Overuse Client-Side JavaScript
```astro
<!-- Bad - unnecessary client-side script -->
<div id="simple-content">
  <p>Static content that doesn't need JavaScript</p>
</div>

<script>
  // Unnecessary JavaScript for static content
  document.getElementById('simple-content').style.display = 'block'
</script>

<!-- Good - static content stays static -->
<div class="simple-content">
  <p>Static content rendered on the server</p>
</div>

<style>
  .simple-content {
    display: block;
  }
</style>
```

### ❌ Don't Skip Props Validation
```astro
<!-- Bad - no props validation -->
---
const { title, posts } = Astro.props
// No validation - could cause runtime errors
---

<h1>{title}</h1>
{posts.map(post => <div>{post.title}</div>)}

<!-- Good - proper props validation -->
---
export interface Props {
  title: string
  posts: BlogPost[]
}

const { title, posts } = Astro.props

if (!title) {
  throw new Error('Title is required')
}

if (!Array.isArray(posts)) {
  throw new Error('Posts must be an array')
}
---
```

### ❌ Don't Ignore Accessibility
```astro
<!-- Bad - poor accessibility -->
<div onclick="handleClick()">Click me</div>
<img src="photo.jpg" />
<div class="red-text">Error occurred</div>

<!-- Good - accessible markup -->
<button type="button" onclick="handleClick()">
  Click me
</button>

<img 
  src="photo.jpg" 
  alt="Description of the photo content"
/>

<div class="error-message" role="alert" aria-live="polite">
  <span class="visually-hidden">Error:</span>
  Error occurred
</div>
```

### ❌ Don't Mix Styling Approaches Inconsistently
```astro
<!-- Bad - mixing inline styles with scoped styles -->
<div class="card" style="margin-top: 20px;">
  <p style="color: red;">Content</p>
</div>

<style>
  .card {
    padding: 1rem;
    /* Inconsistent with inline styles above */
  }
</style>

<!-- Good - consistent styling approach -->
<div class="card card--with-margin">
  <p class="card__error-text">Content</p>
</div>

<style>
  .card {
    padding: 1rem;
  }

  .card--with-margin {
    margin-top: 1.25rem;
  }

  .card__error-text {
    color: var(--color-danger);
  }
</style>
```

This Astro component style guide ensures clean, maintainable, and performant Astro applications following modern web development best practices.