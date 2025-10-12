import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/todo-pwa/',
  build: {
    // Ottimizzazioni per compatibilità
    target: 'es2015', // Supporto per browser più vecchi
    cssTarget: 'chrome61', // CSS compatibile con browser moderni
    minify: 'terser', // Minificazione ottimizzata
    terserOptions: {
      compress: {
        drop_console: false, // Mantieni console per debugging
        drop_debugger: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
        // Nomi file per migliore caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    // Performance warnings
    chunkSizeWarningLimit: 1000, // 1MB warning
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'privacy-policy.html', 'icon-*.png'],
      devOptions: {
        enabled: false // Disabilita PWA in dev per evitare problemi
      },
      manifest: {
        name: 'Task Manager - Gestione Professionale',
        short_name: 'TaskManager',
        description: 'Gestione professionale delle attività con supporto offline completo. Organizza task, imposta promemoria e monitora la tua produttività.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/todo-pwa/',
        start_url: '/todo-pwa/',
        orientation: 'portrait-primary',
        categories: ['productivity', 'business'],
        lang: 'it',
        dir: 'ltr',
        // Play Store richiede questi campi
        iarc_rating_id: '0', // Rating E (Everyone)
        prefer_related_applications: false,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          // Icone aggiuntive per Android
          {
            src: 'icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          }
        ]
        // Screenshots rimossi temporaneamente - da aggiungere quando disponibili
        // screenshots: [...]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        globIgnores: ['**/node_modules/**/*', '**/privacy-policy.html'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Aumenta la navigazione fallback per compatibilità
        navigateFallback: '/todo-pwa/index.html',
        navigateFallbackDenylist: [/^\/api/, /\.(png|jpg|jpeg|svg|gif|webp)$/],
        // Ottimizzazioni performance
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB max per file
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            }
          }
        ]
      }
    })
  ]
});
