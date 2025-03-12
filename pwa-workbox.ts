import type { GenerateSWOptions } from 'workbox-build';

export const workboxConfig: Partial<GenerateSWOptions> = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/server-for-messenger\.onrender\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 1 день
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      // Кэширование статических ресурсов
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
        },
      },
    },
    {
      // Кэширование шрифтов
      urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
        },
      },
    },
    {
      // Кэширование CSS и JS файлов
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 неделя
        },
      },
    },
    {
      // Кэширование HTML страниц
      urlPattern: /\.(?:html)$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24, // 1 день
        },
      },
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
};
