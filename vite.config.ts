import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './pwa-manifest';
import { workboxConfig } from './pwa-workbox';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  // Формируем список плагинов
  const plugins = [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
      workbox: workboxConfig,
      devOptions: {
        // Отключаем в режиме разработки, чтобы избежать проблем с WebSocket
        enabled: false,
      },
    }),
  ];

  // Добавляем basicSsl только для режима разработки
  if (isDevelopment) {
    plugins.push(basicSsl());
  }

  // Базовая конфигурация
  const config = {
    plugins,
  };

  if (isDevelopment) {
    const env = loadEnv(mode, process.cwd(), '');

    const serverHost = env.VITE_SERVER_HOST;
    const serverPort = parseInt(env.VITE_SERVER_PORT, 10);
    const apiServer = env.VITE_API_SERVER;

    return {
      ...config,
      server: {
        host: serverHost,
        port: serverPort,
        proxy: {
          '/api': {
            target: apiServer,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
          // прокси для сокетов
          '/socket.io': {
            target: apiServer,
            changeOrigin: true,
            ws: true,
          },
        },
      },
    };
  }

  return config;
});
