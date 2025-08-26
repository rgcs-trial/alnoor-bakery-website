# TDD Patterns for Astro Development

## Overview

Test-Driven Development (TDD) in Astro follows the Red-Green-Refactor cycle with emphasis on component testing with Vitest, content collection validation, and islands architecture testing with framework-specific patterns.

## Astro TDD Cycle

### RED Phase: Write Failing Tests
```typescript
// src/test/components/UserCard.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/dom'
import { getByText, getByRole } from '@testing-library/dom'

// Helper to render Astro component as HTML
async function renderComponent(componentPath: string, props: any = {}) {
  const { default: Component } = await import(componentPath)
  const html = await Component.render(props)
  const container = document.createElement('div')
  container.innerHTML = html
  return container
}

describe('UserCard Component', () => {
  // RED: Write failing test first
  it('should display user information', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg'
    }

    const container = await renderComponent('../components/UserCard.astro', {
      user: mockUser
    })

    expect(getByText(container, 'John Doe')).toBeTruthy()
    expect(getByText(container, 'john@example.com')).toBeTruthy()
  })

  it('should show placeholder when no avatar provided', async () => {
    const mockUser = {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@example.com'
    }

    const container = await renderComponent('../components/UserCard.astro', {
      user: mockUser
    })

    expect(getByText(container, 'JS')).toBeTruthy() // Initials placeholder
  })
})
```

### GREEN Phase: Minimal Implementation
```astro
---
// src/components/UserCard.astro - Minimal implementation to pass tests
export interface Props {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

const { user } = Astro.props

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
---

<div class="user-card">
  <div class="avatar">
    {user.avatar ? (
      <img src={user.avatar} alt={user.name} />
    ) : (
      <span>{getInitials(user.name)}</span>
    )}
  </div>
  <div class="info">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </div>
</div>

<style>
  .user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: #f3f4f6;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .info h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>
```

### REFACTOR Phase: Improve Code Quality
```astro
---
// src/components/UserCard.astro - Enhanced implementation
import { Image } from 'astro:assets'

export interface Props {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
    status?: 'online' | 'offline' | 'away'
  }
  variant?: 'default' | 'compact' | 'detailed'
  interactive?: boolean
  class?: string
}

const { 
  user, 
  variant = 'default',
  interactive = false,
  class: className = '' 
} = Astro.props

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500'
}

const variantClasses = {
  default: 'p-4',
  compact: 'p-2',
  detailed: 'p-6'
}
---

<div 
  class={`user-card ${variantClasses[variant]} ${interactive ? 'interactive' : ''} ${className}`}
  data-user-id={user.id}
>
  <div class="avatar-container">
    <div class="avatar">
      {user.avatar ? (
        <Image 
          src={user.avatar} 
          alt={user.name}
          width={variant === 'compact' ? 32 : variant === 'detailed' ? 64 : 48}
          height={variant === 'compact' ? 32 : variant === 'detailed' ? 64 : 48}
          format="webp"
          loading="lazy"
        />
      ) : (
        <span class="initials">{getInitials(user.name)}</span>
      )}
    </div>
    {user.status && (
      <div class={`status-indicator ${statusColors[user.status]}`} />
    )}
  </div>
  
  <div class="info">
    <h3 class="name">{user.name}</h3>
    {user.role && variant !== 'compact' && (
      <span class="role">{user.role}</span>
    )}
    <p class="email">{user.email}</p>
  </div>

  {interactive && (
    <button class="action-button" type="button">
      <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  )}
</div>

<style>
  .user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }

  .user-card.interactive {
    cursor: pointer;
  }

  .user-card.interactive:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .avatar-container {
    position: relative;
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.5;
  }

  .role {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #3b82f6;
    background: #eff6ff;
    border-radius: 9999px;
    margin-top: 0.25rem;
  }

  .email {
    margin: 0.25rem 0 0 0;
    color: #6b7280;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-button:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .user-card {
      padding: 0.75rem;
    }
    
    .name {
      font-size: 1rem;
    }
  }
</style>
```

## Astro Testing Pyramid

### Unit Tests (70% of test suite)
```typescript
// src/test/utils/formatters.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, slugify, truncate } from '@/lib/utils'

describe('formatDate', () => {
  it('should format dates correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date)).toBe('January 15, 2024')
  })

  it('should handle relative dates', () => {
    const today = new Date()
    expect(formatDate(today, { relative: true })).toBe('Today')
  })

  it('should format with custom format', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date, { format: 'short' })).toBe('Jan 15, 2024')
  })
})

describe('slugify', () => {
  it('should create URL-friendly slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
    expect(slugify('Special@Characters!')).toBe('special-characters')
  })

  it('should handle empty strings', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
  })
})

describe('truncate', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text that should be truncated'
    expect(truncate(text, 20)).toBe('This is a very long...')
  })

  it('should not truncate short text', () => {
    const text = 'Short text'
    expect(truncate(text, 20)).toBe('Short text')
  })
})
```

### Component Tests (20% of test suite)
```typescript
// src/test/components/BlogCard.test.ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/dom'

async function renderAstroComponent(componentPath: string, props: any = {}) {
  // Dynamic import to load Astro component
  const module = await import(componentPath)
  const Component = module.default
  
  // Render the component with props
  const result = await Component.render(props)
  
  // Create DOM container
  const container = document.createElement('div')
  container.innerHTML = result.html || result
  
  return container
}

describe('BlogCard Component', () => {
  const mockPost = {
    slug: 'test-post',
    data: {
      title: 'Test Blog Post',
      description: 'This is a test description',
      pubDate: new Date('2024-01-15'),
      heroImage: '/images/test.jpg',
      tags: ['astro', 'testing'],
      featured: false
    }
  }

  it('should render blog post information', async () => {
    const container = await renderAstroComponent('../components/BlogCard.astro', {
      post: mockPost
    })

    const title = container.querySelector('h3')
    expect(title?.textContent).toBe('Test Blog Post')
    
    const description = container.querySelector('p')
    expect(description?.textContent).toBe('This is a test description')
  })

  it('should display publication date', async () => {
    const container = await renderAstroComponent('../components/BlogCard.astro', {
      post: mockPost
    })

    const dateElement = container.querySelector('time')
    expect(dateElement?.getAttribute('datetime')).toBe('2024-01-15T00:00:00.000Z')
  })

  it('should render tags', async () => {
    const container = await renderAstroComponent('../components/BlogCard.astro', {
      post: mockPost
    })

    const tags = container.querySelectorAll('.tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].textContent).toBe('astro')
    expect(tags[1].textContent).toBe('testing')
  })

  it('should show featured badge for featured posts', async () => {
    const featuredPost = {
      ...mockPost,
      data: { ...mockPost.data, featured: true }
    }

    const container = await renderAstroComponent('../components/BlogCard.astro', {
      post: featuredPost
    })

    const badge = container.querySelector('.featured-badge')
    expect(badge).toBeTruthy()
    expect(badge?.textContent).toBe('Featured')
  })
})
```

### Integration Tests (10% of test suite)
```typescript
// src/test/integration/blog.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { getCollection } from 'astro:content'

describe('Blog Integration', () => {
  let blogPosts: any[]

  beforeAll(async () => {
    // Mock the content collection
    blogPosts = [
      {
        slug: 'first-post',
        data: {
          title: 'First Post',
          description: 'First post description',
          pubDate: new Date('2024-01-01'),
          tags: ['astro']
        }
      },
      {
        slug: 'second-post',
        data: {
          title: 'Second Post',
          description: 'Second post description',
          pubDate: new Date('2024-01-15'),
          tags: ['astro', 'testing']
        }
      }
    ]
  })

  it('should load all blog posts', async () => {
    expect(blogPosts).toHaveLength(2)
    expect(blogPosts[0].slug).toBe('first-post')
    expect(blogPosts[1].slug).toBe('second-post')
  })

  it('should sort posts by publication date', () => {
    const sortedPosts = blogPosts.sort((a, b) => 
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    )

    expect(sortedPosts[0].slug).toBe('second-post')
    expect(sortedPosts[1].slug).toBe('first-post')
  })

  it('should filter posts by tag', () => {
    const astroPosts = blogPosts.filter(post => 
      post.data.tags.includes('astro')
    )

    expect(astroPosts).toHaveLength(2)

    const testingPosts = blogPosts.filter(post => 
      post.data.tags.includes('testing')
    )

    expect(testingPosts).toHaveLength(1)
    expect(testingPosts[0].slug).toBe('second-post')
  })
})
```

## API Route Testing

### Astro API Endpoint Tests
```typescript
// src/test/api/users.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the API route handler
async function createMockRequest(
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  const request = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  return request
}

describe('/api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return users list', async () => {
    const { GET } = await import('../../pages/api/users.ts')
    
    const request = await createMockRequest('GET', 'http://localhost:4321/api/users')
    const response = await GET({ request } as any)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data.users)).toBe(true)
  })

  it('should create new user', async () => {
    const { POST } = await import('../../pages/api/users.ts')
    
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const request = await createMockRequest(
      'POST', 
      'http://localhost:4321/api/users',
      newUser
    )
    
    const response = await POST({ request } as any)
    
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.user.name).toBe('John Doe')
    expect(data.user.email).toBe('john@example.com')
  })

  it('should validate required fields', async () => {
    const { POST } = await import('../../pages/api/users.ts')
    
    const invalidUser = {
      name: '',
      email: 'invalid-email'
    }
    
    const request = await createMockRequest(
      'POST', 
      'http://localhost:4321/api/users',
      invalidUser
    )
    
    const response = await POST({ request } as any)
    
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data.error).toBeTruthy()
  })
})
```

## Islands Testing (Framework-Specific)

### React Island Testing
```typescript
// src/test/islands/SearchBox.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from '@/components/islands/SearchBox'

describe('SearchBox Island', () => {
  it('should render search input', () => {
    render(<SearchBox />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toBeInTheDocument()
  })

  it('should handle search input', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    
    await user.type(input, 'test query')
    await user.keyboard('{Enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query')
  })

  it('should show search suggestions', async () => {
    const user = userEvent.setup()
    const mockSuggestions = ['astro', 'javascript', 'typescript']
    
    render(<SearchBox suggestions={mockSuggestions} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    
    await user.type(input, 'a')
    
    expect(screen.getByText('astro')).toBeInTheDocument()
  })
})
```

### Vue Island Testing
```typescript
// src/test/islands/Counter.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/islands/Counter.vue'

describe('Counter Island', () => {
  it('should display initial count', () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 5 }
    })

    expect(wrapper.text()).toContain('5')
  })

  it('should increment count when button clicked', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 }
    })

    const button = wrapper.find('[data-testid="increment"]')
    await button.trigger('click')

    expect(wrapper.text()).toContain('1')
  })

  it('should emit count change', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 }
    })

    const button = wrapper.find('[data-testid="increment"]')
    await button.trigger('click')

    expect(wrapper.emitted('countChange')).toBeTruthy()
    expect(wrapper.emitted('countChange')?.[0]).toEqual([1])
  })
})
```

## Supabase Auth Testing

### Auth Store Testing
```typescript
// src/test/stores/auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { $user, $isAuthenticated, signIn, signOut } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    }
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    $user.set(null)
  })

  it('should start with no authenticated user', () => {
    expect($user.get()).toBeNull()
    expect($isAuthenticated.get()).toBe(false)
  })

  it('should handle successful login', async () => {
    const mockUser = { id: '1', email: 'user@example.com' }
    const mockSession = { user: mockUser, access_token: 'token' }

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: mockSession },
      error: null
    } as any)

    await signIn('user@example.com', 'password123')

    expect($user.get()).toEqual(mockUser)
    expect($isAuthenticated.get()).toBe(true)
  })

  it('should handle login errors', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid credentials' }
    } as any)

    await expect(signIn('user@example.com', 'wrongpassword'))
      .rejects.toThrow('Invalid credentials')

    expect($user.get()).toBeNull()
    expect($isAuthenticated.get()).toBe(false)
  })

  it('should handle logout', async () => {
    // Set initial user
    $user.set({ id: '1', email: 'user@example.com' } as any)

    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null
    })

    await signOut()

    expect($user.get()).toBeNull()
    expect($isAuthenticated.get()).toBe(false)
  })
})
```

### Auth Component Testing
```typescript
// src/test/islands/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/islands/LoginForm'
import { signIn } from '@/stores/auth'

vi.mock('@/stores/auth', () => ({
  signIn: vi.fn(),
  $user: { get: () => null },
  $isAuthenticated: { get: () => false }
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should submit login form', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(signIn).toHaveBeenCalledWith('user@example.com', 'password123')
  })

  it('should display validation errors', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('should handle authentication errors', async () => {
    vi.mocked(signIn).mockRejectedValue(new Error('Invalid credentials'))
    
    const user = userEvent.setup()
    
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
```

## Content Collection Testing

### Content Validation Tests
```typescript
// src/test/content/blog.test.ts
import { describe, it, expect } from 'vitest'
import { getCollection, getEntry } from 'astro:content'

// Mock content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn()
}))

describe('Blog Content', () => {
  const mockBlogPosts = [
    {
      slug: 'getting-started-with-astro',
      data: {
        title: 'Getting Started with Astro',
        description: 'Learn how to build fast websites with Astro',
        pubDate: new Date('2024-01-01'),
        author: 'John Doe',
        tags: ['astro', 'tutorial'],
        featured: true
      }
    },
    {
      slug: 'astro-vs-other-frameworks',
      data: {
        title: 'Astro vs Other Frameworks',
        description: 'A comparison of Astro with other popular frameworks',
        pubDate: new Date('2024-01-15'),
        author: 'Jane Smith',
        tags: ['astro', 'comparison'],
        featured: false
      }
    }
  ]

  beforeEach(() => {
    vi.mocked(getCollection).mockResolvedValue(mockBlogPosts as any)
  })

  it('should load all blog posts', async () => {
    const posts = await getCollection('blog')
    
    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('getting-started-with-astro')
  })

  it('should validate required frontmatter fields', () => {
    const post = mockBlogPosts[0]
    
    expect(post.data.title).toBeTruthy()
    expect(post.data.description).toBeTruthy()
    expect(post.data.pubDate).toBeInstanceOf(Date)
    expect(post.data.author).toBeTruthy()
    expect(Array.isArray(post.data.tags)).toBe(true)
    expect(typeof post.data.featured).toBe('boolean')
  })

  it('should filter featured posts', async () => {
    const posts = await getCollection('blog')
    const featuredPosts = posts.filter(post => post.data.featured)
    
    expect(featuredPosts).toHaveLength(1)
    expect(featuredPosts[0].slug).toBe('getting-started-with-astro')
  })

  it('should sort posts by date', async () => {
    const posts = await getCollection('blog')
    const sortedPosts = posts.sort((a, b) => 
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    )
    
    expect(sortedPosts[0].slug).toBe('astro-vs-other-frameworks')
    expect(sortedPosts[1].slug).toBe('getting-started-with-astro')
  })
})
```

## E2E Testing with Playwright

### Page Object Model
```typescript
// src/test/e2e/pages/HomePage.ts
import { type Page, type Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heroTitle: Locator
  readonly ctaButton: Locator
  readonly featuredPosts: Locator
  readonly searchBox: Locator

  constructor(page: Page) {
    this.page = page
    this.heroTitle = page.getByRole('heading', { name: /welcome to astro/i })
    this.ctaButton = page.getByRole('button', { name: /get started/i })
    this.featuredPosts = page.getByTestId('featured-posts')
    this.searchBox = page.getByRole('textbox', { name: /search/i })
  }

  async goto() {
    await this.page.goto('/')
  }

  async searchFor(query: string) {
    await this.searchBox.fill(query)
    await this.searchBox.press('Enter')
  }

  async clickCTA() {
    await this.ctaButton.click()
  }
}
```

### E2E Test Examples
```typescript
// src/test/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'

test.describe('Homepage', () => {
  test('should display hero section', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await expect(homePage.heroTitle).toBeVisible()
    await expect(homePage.ctaButton).toBeVisible()
  })

  test('should navigate to blog on CTA click', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await homePage.clickCTA()

    await expect(page).toHaveURL(/\/blog/)
  })

  test('should perform search', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await homePage.searchFor('astro')

    await expect(page.getByText('Search results for: astro')).toBeVisible()
  })

  test('should display featured posts', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await expect(homePage.featuredPosts).toBeVisible()
    
    const postCards = page.getByTestId('post-card')
    await expect(postCards).toHaveCount(3) // Assuming 3 featured posts
  })
})
```

### Auth E2E Testing
```typescript
// src/test/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back!')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')

    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Sign out')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })
})
```

## Testing Anti-Patterns

### ❌ Don't Test Framework Implementation Details
```typescript
// Bad: Testing Astro's internal rendering
expect(component.$$.ctx).toEqual(expectedContext)

// Good: Test the rendered output
expect(container.textContent).toContain('Expected text')
```

### ❌ Don't Over-Mock Astro Features
```typescript
// Bad: Mocking Astro's content system extensively
vi.mock('astro:content')

// Good: Use real content with test fixtures
const testPosts = await getCollection('blog')
```

### ❌ Don't Test Multiple Islands Together
```typescript
// Bad: Testing island interactions across components
test('search and results islands should work together')

// Good: Test each island independently
test('search island should emit search event')
test('results island should handle search results')
```

### ❌ Don't Use DOM Testing for Static Content
```typescript
// Bad: Using DOM testing for static Astro components
render(<StaticComponent />)

// Good: Test the generated HTML
const html = await component.render()
expect(html).toContain('expected content')
```

## Conditional Context Loading

```astro
---
{% if context.files_contain('astro.config.mjs') %}
// Astro project detected
import type { APIRoute } from 'astro'
{% endif %}

{% if context.contains('supabase') %}
import { supabase } from '@/lib/supabase'
{% endif %}

{% if context.contains('nanostores') %}
import { $user } from '@/stores/auth'
{% endif %}

{% if context.contains('tailwind') %}
import '@/styles/globals.css'
{% endif %}
---
```

This comprehensive TDD pattern guide ensures Astro applications maintain high quality through systematic testing practices while following the Red-Green-Refactor cycle with islands architecture, content collections, and Supabase auth integration.