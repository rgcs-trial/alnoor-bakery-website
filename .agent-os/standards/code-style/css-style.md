# CSS Style Guide - Astro

## CSS Architecture

### File Organization
- Component-scoped styles within `.astro` files
- Global styles in dedicated CSS files
- Utility classes for common patterns
- CSS custom properties for theming

```
src/
├── styles/
│   ├── global.css           # Global styles and resets
│   ├── variables.css        # CSS custom properties
│   ├── utilities.css        # Utility classes
│   └── components/          # Shared component styles
│       ├── buttons.css
│       └── cards.css
├── components/
│   ├── BlogCard.astro       # Component with scoped styles
│   └── Navigation.astro
└── layouts/
    └── Layout.astro         # Layout with global style imports
```

### Scoped Component Styles
```astro
---
// BlogPost.astro
export interface Props {
  title: string
  featured?: boolean
}

const { title, featured = false } = Astro.props
---

<article class:list={['blog-post', { 'blog-post--featured': featured }]}>
  <header class="blog-post__header">
    <h1 class="blog-post__title">{title}</h1>
  </header>
  
  <div class="blog-post__content">
    <slot />
  </div>
</article>

<style>
  /* Component variables */
  .blog-post {
    --post-padding: 2rem;
    --post-max-width: 65ch;
    --post-border-radius: 0.5rem;
  }

  /* Base styles */
  .blog-post {
    max-width: var(--post-max-width);
    margin: 0 auto;
    padding: var(--post-padding);
    background: var(--color-surface);
    border-radius: var(--post-border-radius);
    box-shadow: var(--shadow-md);
  }

  /* Modifiers */
  .blog-post--featured {
    --post-border-radius: 1rem;
    border: 2px solid var(--color-accent);
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
  }

  /* Elements */
  .blog-post__header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .blog-post__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    color: var(--color-heading);
  }

  .blog-post__content {
    line-height: 1.7;
    color: var(--color-text);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .blog-post {
      --post-padding: 1.5rem;
    }
  }
</style>
```

## Naming Conventions

### BEM for Component Classes
```astro
<!-- Navigation component -->
<nav class="navigation">
  <div class="navigation__brand">
    <a href="/" class="navigation__logo">
      <img src="/logo.svg" alt="Site Logo" class="navigation__logo-image" />
    </a>
  </div>
  
  <ul class="navigation__menu">
    <li class="navigation__item">
      <a href="/blog" class="navigation__link navigation__link--active">
        Blog
      </a>
    </li>
    <li class="navigation__item">
      <a href="/about" class="navigation__link">About</a>
    </li>
  </ul>
  
  <button class="navigation__toggle navigation__toggle--open">
    <span class="navigation__hamburger"></span>
  </button>
</nav>

<style>
  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .navigation__brand {
    flex-shrink: 0;
  }

  .navigation__logo {
    display: block;
    text-decoration: none;
  }

  .navigation__logo-image {
    height: 2rem;
    width: auto;
  }

  .navigation__menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }

  .navigation__item {
    /* Item styles */
  }

  .navigation__link {
    text-decoration: none;
    font-weight: 500;
    color: var(--color-text);
    transition: color 0.2s ease;
  }

  .navigation__link:hover,
  .navigation__link--active {
    color: var(--color-accent);
  }

  .navigation__toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .navigation__menu {
      display: none;
    }
    
    .navigation__toggle {
      display: block;
    }
  }
</style>
```

### CSS Custom Properties System
```css
/* src/styles/variables.css */
:root {
  /* Color Palette */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #93c5fd;
  
  --color-secondary: #8b5cf6;
  --color-secondary-dark: #7c3aed;
  --color-secondary-light: #c4b5fd;
  
  --color-accent: #f59e0b;
  --color-accent-dark: #d97706;
  --color-accent-light: #fbbf24;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Surface Colors */
  --color-surface: var(--color-white);
  --color-surface-alt: var(--color-gray-50);
  --color-surface-muted: var(--color-gray-100);
  
  /* Text Colors */
  --color-text: var(--color-gray-800);
  --color-text-muted: var(--color-gray-600);
  --color-text-light: var(--color-gray-500);
  --color-heading: var(--color-gray-900);
  
  /* Border Colors */
  --color-border: var(--color-gray-200);
  --color-border-light: var(--color-gray-100);
  --color-border-muted: var(--color-gray-300);
  
  /* Typography */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
  --font-family-serif: 'Crimson Text', Georgia, serif;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  --font-size-6xl: 3.75rem;   /* 60px */
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  /* Spacing Scale */
  --space-px: 1px;
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  
  /* Z-Index Scale */
  --z-hide: -1;
  --z-base: 0;
  --z-docked: 10;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-banner: 1200;
  --z-overlay: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-skiplink: 1600;
  --z-toast: 1700;
  --z-tooltip: 1800;
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: var(--color-gray-900);
    --color-surface-alt: var(--color-gray-800);
    --color-surface-muted: var(--color-gray-700);
    
    --color-text: var(--color-gray-100);
    --color-text-muted: var(--color-gray-300);
    --color-text-light: var(--color-gray-400);
    --color-heading: var(--color-white);
    
    --color-border: var(--color-gray-700);
    --color-border-light: var(--color-gray-600);
    --color-border-muted: var(--color-gray-500);
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  :root {
    --color-border: var(--color-gray-900);
    --shadow-base: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 8px -1px rgba(0, 0, 0, 0.3);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}
```

## Layout Patterns

### Grid System
```astro
<!-- Grid layout component -->
<section class="grid-container">
  <div class="grid grid--responsive">
    <div class="grid__item">
      <slot name="item-1" />
    </div>
    <div class="grid__item">
      <slot name="item-2" />
    </div>
    <div class="grid__item">
      <slot name="item-3" />
    </div>
  </div>
</section>

<style>
  .grid-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .grid {
    display: grid;
    gap: var(--space-6);
  }

  .grid--responsive {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .grid--2-col {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid--3-col {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid--4-col {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid__item {
    display: flex;
    flex-direction: column;
  }

  /* Responsive breakdowns */
  @media (max-width: 768px) {
    .grid--2-col,
    .grid--3-col,
    .grid--4-col {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .grid--3-col,
    .grid--4-col {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

### Article Layout
```astro
<!-- Article layout with content width restrictions -->
<article class="article">
  <header class="article__header">
    <h1 class="article__title">{title}</h1>
    <div class="article__meta">
      <time class="article__date">{publishedAt}</time>
      <span class="article__author">{author}</span>
    </div>
  </header>
  
  <div class="article__content">
    <slot />
  </div>
</article>

<style>
  .article {
    --article-max-width: 65ch;
    --article-wide-width: 80ch;
    
    display: grid;
    grid-template-columns: 
      1fr 
      min(var(--article-max-width), 100%) 
      1fr;
    gap: var(--space-4);
    padding: var(--space-8) var(--space-4);
  }

  .article > * {
    grid-column: 2;
  }

  /* Wide content that breaks out of normal width */
  .article :global(.wide) {
    grid-column: 1 / -1;
    max-width: var(--article-wide-width);
    margin: 0 auto;
  }

  /* Full-width content */
  .article :global(.full-width) {
    grid-column: 1 / -1;
  }

  .article__header {
    margin-bottom: var(--space-8);
    text-align: center;
  }

  .article__title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    color: var(--color-heading);
    margin: 0 0 var(--space-4) 0;
  }

  .article__meta {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .article__content {
    line-height: var(--line-height-relaxed);
    color: var(--color-text);
  }

  /* Typography styles within article content */
  .article__content :global(h2) {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-heading);
    margin: var(--space-8) 0 var(--space-4) 0;
  }

  .article__content :global(h3) {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-heading);
    margin: var(--space-6) 0 var(--space-3) 0;
  }

  .article__content :global(p) {
    margin: 0 0 var(--space-4) 0;
  }

  .article__content :global(blockquote) {
    margin: var(--space-6) 0;
    padding: var(--space-4) var(--space-6);
    border-left: 4px solid var(--color-accent);
    background: var(--color-surface-alt);
    border-radius: var(--radius-base);
    font-style: italic;
  }

  .article__content :global(code) {
    background: var(--color-surface-muted);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-mono);
    font-size: 0.9em;
  }

  .article__content :global(pre) {
    background: var(--color-gray-900);
    color: var(--color-gray-100);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    margin: var(--space-6) 0;
  }

  .article__content :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }
</style>
```

## Responsive Design

### Mobile-First Approach
```astro
<!-- Hero section with responsive design -->
<section class="hero">
  <div class="hero__container">
    <div class="hero__content">
      <h1 class="hero__title">{title}</h1>
      <p class="hero__subtitle">{subtitle}</p>
      <div class="hero__actions">
        <a href="/get-started" class="hero__cta">Get Started</a>
        <a href="/learn-more" class="hero__link">Learn More</a>
      </div>
    </div>
    <div class="hero__visual">
      <slot name="visual" />
    </div>
  </div>
</section>

<style>
  /* Mobile-first responsive hero */
  .hero {
    padding: var(--space-8) 0;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    color: var(--color-white);
  }

  .hero__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
    display: grid;
    gap: var(--space-8);
    grid-template-columns: 1fr;
    align-items: center;
  }

  .hero__content {
    text-align: center;
  }

  .hero__title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin: 0 0 var(--space-4) 0;
  }

  .hero__subtitle {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-relaxed);
    opacity: 0.9;
    margin: 0 0 var(--space-6) 0;
  }

  .hero__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: center;
  }

  .hero__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) var(--space-6);
    background: var(--color-white);
    color: var(--color-primary);
    text-decoration: none;
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-lg);
    transition: var(--transition-base);
    min-width: 200px;
  }

  .hero__cta:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .hero__link {
    color: var(--color-white);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    border-bottom: 1px solid transparent;
    transition: var(--transition-base);
  }

  .hero__link:hover {
    border-bottom-color: currentColor;
  }

  .hero__visual {
    display: flex;
    justify-content: center;
  }

  /* Tablet */
  @media (min-width: 768px) {
    .hero {
      padding: var(--space-12) 0;
    }

    .hero__container {
      gap: var(--space-12);
    }

    .hero__title {
      font-size: var(--font-size-4xl);
    }

    .hero__actions {
      flex-direction: row;
      gap: var(--space-4);
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .hero {
      padding: var(--space-16) 0;
    }

    .hero__container {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-16);
    }

    .hero__content {
      text-align: left;
    }

    .hero__title {
      font-size: var(--font-size-5xl);
    }

    .hero__actions {
      justify-content: flex-start;
    }
  }

  /* Large desktop */
  @media (min-width: 1280px) {
    .hero__title {
      font-size: var(--font-size-6xl);
    }
  }
</style>
```

## Performance Optimization

### Critical CSS
```css
/* Critical above-the-fold styles */
.critical-layout {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
}

.critical-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.critical-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.critical-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-heading);
  text-decoration: none;
}

.critical-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16) var(--space-4);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
}

.critical-hero__title {
  font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-5xl));
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin: 0;
}
```

### Efficient Animations
```css
/* Performant animations using transform and opacity */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation utility classes */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.4s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out forwards;
}

/* Staggered animations */
.animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
.animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
.animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
.animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
.animate-stagger > *:nth-child(5) { animation-delay: 0.5s; }

/* Hover animations */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.hover-scale {
  transition: transform var(--transition-base);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-scale-in,
  .animate-slide-in-left {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .hover-lift:hover,
  .hover-scale:hover {
    transform: none;
  }
}
```

## Accessibility

### Focus Management
```css
/* Custom focus styles */
.focus-visible-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible-ring:focus-visible {
  outline-color: var(--color-accent);
  outline-offset: 2px;
}

/* Remove default focus when using custom */
.focus-visible-ring:focus {
  outline: none;
}

/* Focus within for containers */
.card:focus-within {
  box-shadow: 0 0 0 2px var(--color-accent);
  border-radius: var(--radius-lg);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focus-visible-ring:focus-visible {
    outline-width: 3px;
    outline-color: currentColor;
  }
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: var(--space-6);
  background: var(--color-accent);
  color: var(--color-white);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-medium);
  z-index: var(--z-skiplink);
  transition: var(--transition-fast);
}

.skip-link:focus {
  top: var(--space-6);
}

/* Screen reader only content */
.sr-only {
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

/* Not screen reader only variant */
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## Common Anti-Patterns

### ❌ Don't Use !important Excessively
```css
/* Bad - overusing !important */
.button {
  background: blue !important;
  color: white !important;
  padding: 10px !important;
}

/* Good - use proper CSS specificity or component scoping */
.button {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-3) var(--space-4);
}
```

### ❌ Don't Ignore Browser Prefixes for Newer Features
```css
/* Bad - missing support for older browsers */
.grid {
  display: grid;
  gap: var(--space-4);
}

/* Good - include fallbacks and prefixes when needed */
.grid {
  display: grid;
  gap: var(--space-4);
  
  /* Fallback for browsers without gap support */
  grid-gap: var(--space-4);
}
```

### ❌ Don't Create Overly Specific Selectors
```css
/* Bad - overly specific */
.page .main .article .content .paragraph {
  line-height: 1.6;
}

/* Good - use component-scoped styles in Astro */
.article-paragraph {
  line-height: var(--line-height-relaxed);
}
```

### ❌ Don't Mix Global and Scoped Styles Inconsistently
```astro
<!-- Bad - inconsistent styling approach -->
<div class="card" style="margin-top: 20px;">
  <p style="color: red;">Error message</p>
</div>

<style>
  .card {
    padding: 1rem;
  }
</style>

<!-- Good - consistent scoped approach -->
<div class="card card--with-margin">
  <p class="card__error">Error message</p>
</div>

<style>
  .card {
    padding: var(--space-4);
  }

  .card--with-margin {
    margin-top: var(--space-5);
  }

  .card__error {
    color: var(--color-error);
  }
</style>
```

This CSS style guide ensures maintainable, performant, and accessible styles for Astro applications following modern CSS best practices and static site generation principles.