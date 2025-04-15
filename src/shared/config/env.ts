export const isDevelopment = (): boolean => import.meta.env.MODE === 'development';
export const isProduction = (): boolean => import.meta.env.MODE === 'production';

type EnvType = {
  readonly API_URL: string;
  readonly SERVER_HOST?: string;
  readonly SERVER_PORT?: number;
  readonly API_SERVER?: string;
  readonly SOCKET_PATH?: string;
  readonly USE_HTTPS?: boolean;
};

export const ENV: EnvType = {
  API_URL: import.meta.env.VITE_API_BASE_URL,
} as const;

// Если мы в режиме разработки, добавляем дополнительные переменные
if (isDevelopment()) {
  Object.assign(ENV, {
    SERVER_HOST: import.meta.env.VITE_SERVER_HOST,
    SERVER_PORT: parseInt(import.meta.env.VITE_SERVER_PORT, 10),
    API_SERVER: import.meta.env.VITE_API_SERVER,
    SOCKET_PATH: import.meta.env.VITE_SOCKET_PATH,
  });
}
