import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './pwa-manifest';
import { workboxConfig } from './pwa-workbox';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      // includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest,
      workbox: workboxConfig,
      devOptions: {
        // Отключаем в режиме разработки, чтобы избежать проблем с WebSocket
        enabled: false,
      },
    }),
  ],
});
