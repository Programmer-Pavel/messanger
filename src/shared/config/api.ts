export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    CHECK_AUTH: '/auth/check-auth',
  },

  //   // Чаты
  //   CHAT: {
  //     GET_ALL: '/chats',
  //     GET_BY_ID: (id: string) => `/chats/${id}`,
  //     MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
  //   },

  //   // Фитнес
  //   FITNESS: {
  //     WORKOUTS: '/fitness/workouts',
  //     EXERCISES: '/fitness/exercises',
  //   },

  // Пользователи
  USERS: {
    GET_ALL: '/users',
  },
} as const;
