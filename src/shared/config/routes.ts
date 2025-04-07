export const ROUTES = {
  // Основные маршруты
  ROOT: '/',
  CHAT: '/chat',
  FITNESS: '/fitness',
  TEST_PAGE: '/test-page',

  // Маршруты аутентификации
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Служебные маршруты
  NOT_FOUND: '*',
} as const;
