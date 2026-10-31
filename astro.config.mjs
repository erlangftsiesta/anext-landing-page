// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

function unwrapImageImports() {
  return {
    name: 'unwrap-image-imports',
    enforce: 'post',
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      if (/\.(png|jpe?g|webp|tiff|heic|gif|svg)$/.test(id)) {
        if (code.includes('export default')) {
          const expr = code.replace(/^[\s\S]*?export\s+default\s+/, '').replace(/;?\s*$/, '');
          return `const __asset = ${expr};\nexport default (typeof __asset === 'object' && __asset && 'src' in __asset ? __asset.src : __asset);`;
        }
        return { code };
      }
    }
  }
}
// https://astro.build/config
export default defineConfig({
  site: 'https://anext.dev',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), unwrapImageImports()],
    optimizeDeps: {
      include:[ 
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'gsap',
        'ogl',
      ],
      exclude: [
        'embla-carousel',
        'embla-carousel-react',
        'embla-carousel-autoplay'
      ],
    },
    ssr: {
      noExternal: [
        'ogl',
        'gsap', 
        'motion',
        'lucide-react',
        'embla-carousel-react',
        'embla-carousel-autoplay'
      ],
    }
  }
});