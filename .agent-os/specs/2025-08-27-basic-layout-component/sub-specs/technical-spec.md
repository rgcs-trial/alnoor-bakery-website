# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-08-27-basic-layout-component/spec.md

> Created: 2025-08-27
> Version: 1.0.0

## Technical Requirements

### Base Layout Architecture

**Component Structure:**
- Create `src/layouts/Layout.astro` as the main layout component
- Implement semantic HTML5 structure with proper ARIA landmarks
- Use TypeScript interface for props validation
- Support conditional slots for page-specific content injection

**Props Interface:**
```typescript
interface LayoutProps {
  title: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  lang?: 'en';
  dir?: 'ltr';
  noindex?: boolean;
  schemaType?: 'WebSite' | 'LocalBusiness' | 'Product';
}
```

**HTML Document Structure:**
```html
<!DOCTYPE html>
<html lang={lang} dir={dir}>
<head>
  <!-- SEO & Meta Tags -->
  <!-- Preload Critical Fonts -->
  <!-- Structured Data -->
</head>
<body class="font-body antialiased">
  <header><!-- Navigation Component --></header>
  <main id="main-content">
    <slot />
  </main>
  <footer><!-- Footer Component --></footer>
</body>
</html>
```

### Responsive Navigation System

**Mobile-First Implementation:**
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Hamburger menu for screens < 768px with slide-in animation
- Horizontal navigation for desktop with dropdown support
- Logo positioning: left-aligned with consistent branding

**Navigation Component Requirements:**
- Create `src/components/ui/Navigation.astro`
- Support nested menu items with proper accessibility
- Implement focus management for keyboard navigation
- Use CSS Grid/Flexbox for layout consistency

**Interactive Behavior:**
- Use minimal JavaScript with `client:load` hydration
- Toggle mobile menu with proper ARIA states
- Smooth transitions using CSS transform properties
- Close menu on escape key or outside click

### Clean Typography System

**Font Configuration (Tailwind CSS):**
```javascript
// tailwind.config.mjs
fontFamily: {
  'heading': ['Inter', 'system-ui', 'sans-serif'],
  'body': ['Inter', 'system-ui', 'sans-serif'],
  'sans': ['Inter', 'system-ui', 'sans-serif'],
}
```

**CSS Custom Properties:**
```css
:root {
  --font-heading: Inter, system-ui, sans-serif;
  --font-body: Inter, system-ui, sans-serif;
}
```

**Typography Specifications:**
- Base font size: 16px (1rem)
- Line height: 1.6 for body text, 1.2 for headings
- Letter spacing: Default for optimal readability
- Scale: 1.25 modular scale for heading hierarchy
- Clean, readable text hierarchy for English content

### SEO Meta Tag Implementation

**Required Meta Tags:**
```html
<!-- Basic SEO -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
```

**Structured Data (JSON-LD):**
```typescript
interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "Bakery";
  name: string;
  description: string;
  url: string;
  address: PostalAddress;
  telephone: string;
  servesCuisine: "Middle Eastern";
  acceptsReservations: boolean;
}
```

### Performance Specifications

**Loading Strategy:**
- Critical CSS inlined in `<head>`
- Font preloading for primary typefaces
- Image optimization with Astro's Image component
- Lazy loading for non-critical assets

**Bundle Optimization:**
- Component-level CSS scoping
- Tree-shaking for unused Tailwind classes
- Minimize client-side JavaScript footprint
- Use View Transitions API for navigation

**Core Web Vitals Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### Accessibility Requirements

**WCAG 2.1 AA Compliance:**
- Semantic HTML with proper heading hierarchy (h1-h6)
- ARIA landmarks: `banner`, `navigation`, `main`, `contentinfo`
- Focus indicators with 2px outline and sufficient contrast
- Keyboard navigation support for all interactive elements

**Screen Reader Support:**
- Skip navigation link for keyboard users
- Descriptive alt text for decorative images
- ARIA labels for icon-only buttons
- Screen reader announcements for dynamic content

**Color and Contrast:**
- Minimum contrast ratio 4.5:1 for normal text
- Minimum contrast ratio 3:1 for large text
- Color not used as sole indicator of information
- High contrast mode compatibility

### Integration Requirements

**Astro Framework Integration:**
- Compatible with Astro 4.0.0+ static site generation
- Support for hybrid rendering when needed
- Integration with Astro's content collections
- Compatible with View Transitions API

**Tailwind CSS Integration:**
- Custom Tailwind configuration for bakery branding
- Clean English typography and spacing
- Dark mode preparation (optional toggle)
- Purge unused CSS in production builds

**TypeScript Integration:**
- Strict type checking enabled
- Interface definitions for all component props
- Type-safe integration with Astro's built-in types
- No `any` types allowed in production code

## External Dependencies

### Required Dependencies (New)

**Google Fonts Integration:**
```typescript
// Add to Layout.astro <head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Justification:** Google Fonts provides reliable typography with Inter font family, which ensures excellent readability and professional appearance across different browsers and devices.


### Existing Dependencies (No Changes Required)

**Already Available in Project:**
- `astro`: Core framework (4.0.0+)
- `typescript`: Type checking (5.0.0+)
- `tailwindcss`: Utility-first CSS framework
- `@astrojs/tailwind`: Astro Tailwind integration
- `@tailwindcss/typography`: Enhanced typography (if needed for content)

**Framework Compatibility:**
All implementation uses standard Astro patterns and TypeScript features without requiring additional build tools or runtime dependencies. The layout component leverages existing project architecture and follows established patterns from the current codebase.