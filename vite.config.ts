import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'og-image.png',
      ],
      manifest: {
        name: 'My IP Info',
        short_name: 'My IP Info',
        description: 'Multi-source IP intelligence and network connectivity diagnostic suite',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        orientation: 'any',
        start_url: basePath,
        scope: basePath,
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Strict anti-stale rule: never intercept API or dynamic IP endpoints or crawler specifications
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/ip/,
          /^\/geo/,
          /^\/yaml/,
          /^\/json/,
          /^\/health/,
          /^\/robots\.txt/,
          /^\/sitemap\.xml/,
          /^\/llms(-full)?\.txt/,
        ],
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,txt,xml}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:8787',
      '/ip': 'http://localhost:8787',
      '/geo': 'http://localhost:8787',
      '/json': 'http://localhost:8787',
      '/yaml': 'http://localhost:8787',
      '/health': 'http://localhost:8787',
    },
  },
});
