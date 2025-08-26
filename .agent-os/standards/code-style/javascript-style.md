# JavaScript Style Guide

## Function Definitions
- Use arrow functions for inline callbacks and simple functions
- Use function declarations for main functions and components
- Prefer const/let over var

## Import/Export Rules
- Group imports by type (libraries first, then local files)
- Use named exports when exporting multiple items
- Use default exports for main component/function

## Error Handling
- Use try-catch blocks for async operations
- Handle promise rejections explicitly
- Log errors with meaningful context

## Astro-Specific JavaScript

### Component Scripts
```astro
---
// Component script (runs at build time)
import { CollectionEntry, getCollection } from 'astro:content'
import Layout from '../layouts/Layout.astro'

export interface Props {
  title: string
}

const { title } = Astro.props
const posts = await getCollection('blog')
---

<Layout title={title}>
  <main>
    {posts.map((post) => (
      <article>
        <h2>{post.data.title}</h2>
        <p>{post.data.description}</p>
      </article>
    ))}
  </main>
</Layout>

<script>
  // Client-side script (runs in browser)
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.interactive-button')
    
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        console.log('Button clicked:', event.target)
      })
    })
  })
</script>
```

## Example JavaScript Structure

```javascript
// External library imports
import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/utils/remark-reading-time.js'

// Local imports
import { validateContent } from '../utils/validation'

// Configuration function
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  integrations: []
})

// Utility functions
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  }).format(new Date(date))
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
```