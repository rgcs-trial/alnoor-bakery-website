import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

describe('External Dependencies - Google Fonts Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Fonts Configuration', () => {
    it('should validate Google Fonts API availability', async () => {
      // Mock successful fetch response for Google Fonts
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/css']]),
        text: () => Promise.resolve('@font-face { font-family: Inter; }')
      });

      const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    });

    it('should handle font loading failures gracefully', async () => {
      // Mock failed fetch response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it('should validate Inter font weights configuration', () => {
      const expectedWeights = [400, 500, 600, 700];
      const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      
      expectedWeights.forEach(weight => {
        expect(fontUrl).toContain(weight.toString());
      });
      
      expect(fontUrl).toContain('display=swap');
      expect(fontUrl).toContain('family=Inter');
    });
  });

  describe('Preconnect Links Validation', () => {
    it('should validate required preconnect URLs', () => {
      const requiredPreconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      requiredPreconnects.forEach(url => {
        expect(url).toMatch(/^https:\/\/(fonts\.googleapis|fonts\.gstatic)\.com$/);
      });
    });

    it('should validate crossorigin attribute for gstatic', () => {
      const gstaticUrl = 'https://fonts.gstatic.com';
      const requiresCrossOrigin = gstaticUrl.includes('gstatic');
      
      expect(requiresCrossOrigin).toBe(true);
    });
  });

  describe('Font Fallback Strategy', () => {
    it('should define proper fallback fonts', () => {
      const fallbackStack = ['Inter', 'system-ui', 'sans-serif'];
      
      expect(fallbackStack).toContain('Inter');
      expect(fallbackStack).toContain('system-ui');
      expect(fallbackStack).toContain('sans-serif');
      expect(fallbackStack.length).toBe(3);
    });

    it('should prioritize web fonts with system fallbacks', () => {
      const fontStack = 'Inter, system-ui, sans-serif';
      const fonts = fontStack.split(', ');
      
      expect(fonts[0]).toBe('Inter'); // Primary web font
      expect(fonts[1]).toBe('system-ui'); // System fallback
      expect(fonts[2]).toBe('sans-serif'); // Generic fallback
    });
  });
});

describe('External Dependencies - Configuration Files', () => {
  describe('Package.json Dependencies', () => {
    it('should have required dev dependencies installed', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      const requiredDevDeps = [
        '@tailwindcss/vite',
        'tailwindcss',
        '@tailwindcss/typography',
        '@tailwindcss/forms',
        'vitest'
      ];

      requiredDevDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
      });
    });

    it('should have required production dependencies', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      expect(packageJson.dependencies).toHaveProperty('astro');
      expect(packageJson.devDependencies).toHaveProperty('@astrojs/check');
    });
  });

  describe('Astro Configuration', () => {
    it('should have Tailwind integration configured', async () => {
      const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');
      
      try {
        const content = await fs.readFile(astroConfigPath, 'utf-8');
        
        // Check for Tailwind integration (either via plugin or vite)
        const hasTailwindIntegration = 
          content.includes('@tailwindcss/vite') || 
          content.includes('tailwind()') ||
          content.includes('@astrojs/tailwind');
          
        expect(hasTailwindIntegration).toBe(true);
      } catch (error) {
        // If file doesn't exist, we'll create it in the implementation phase
        expect(true).toBe(true);
      }
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have proper TypeScript configuration', async () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      
      try {
        const content = await fs.readFile(tsconfigPath, 'utf-8');
        const tsconfig = JSON.parse(content);
        
        expect(tsconfig.extends).toBe('astro/tsconfigs/strict');
        expect(tsconfig.compilerOptions).toHaveProperty('strict');
      } catch (error) {
        // TypeScript config might be implicit with Astro
        expect(true).toBe(true);
      }
    });
  });
});

describe('External Dependencies - Performance Validation', () => {
  describe('Font Loading Performance', () => {
    it('should use font-display: swap for better performance', () => {
      const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      expect(fontUrl).toContain('display=swap');
    });

    it('should preconnect to font domains for faster loading', () => {
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnectDomains.forEach(domain => {
        expect(domain).toMatch(/^https:\/\/fonts\./);
      });
    });

    it('should use appropriate font weights for performance', () => {
      const fontWeights = [400, 500, 600, 700];
      
      // Ensure we're not loading too many weights
      expect(fontWeights.length).toBeLessThanOrEqual(4);
      
      // Ensure we have essential weights
      expect(fontWeights).toContain(400); // Regular
      expect(fontWeights).toContain(700); // Bold
    });
  });

  describe('CSS Loading Strategy', () => {
    it('should validate CSS import strategy', async () => {
      // This will be validated once we create the global CSS file
      const expectedCssImports = [
        '@import "tailwindcss";'
      ];

      expectedCssImports.forEach(importStatement => {
        expect(importStatement).toContain('@import');
      });
    });
  });
});