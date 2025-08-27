import { vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock Astro global for testing
(global as any).Astro = {
  props: {},
  url: new URL('http://localhost:4321/'),
  site: 'https://alnoor-bakery.vercel.app',
  generator: 'Astro v5.13.3'
};

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;

// Mock fetch for external resource testing
global.fetch = vi.fn();

// Helper function to render Astro components in tests
export async function renderAstroComponent(componentPath: string, props: any = {}) {
  try {
    const module = await import(componentPath);
    const Component = module.default;
    
    // Mock Astro.props with provided props
    (global as any).Astro.props = props;
    
    const result = await Component.render(props);
    const htmlContent = result.html || result;
    
    const dom = new JSDOM(htmlContent);
    return dom.window.document;
  } catch (error) {
    console.error('Error rendering component:', error);
    throw error;
  }
}