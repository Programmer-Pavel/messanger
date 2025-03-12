import { ManifestOptions } from 'vite-plugin-pwa';

export const manifest: Partial<ManifestOptions> = {
  name: 'Мия',
  short_name: 'Мия',
  description: 'Мессенджер приложение',
  theme_color: '#4285f4',
  icons: [
    {
      src: 'pwa-icons/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: 'pwa-icons/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
};
