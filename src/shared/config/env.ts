export const isDevelopment = (): boolean => import.meta.env.MODE === 'development';
export const isProduction = (): boolean => import.meta.env.MODE === 'production';

type EnvType = {
  readonly API_URL: string;
};

export const ENV: EnvType = {
  API_URL: import.meta.env.VITE_API_BASE_URL,
} as const;
