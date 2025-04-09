import { QueryClient } from '@tanstack/react-query';

// Создаем экземпляр QueryClient с настройками по умолчанию
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Стандартное время кеширования данных (5 минут)
      // staleTime: 5 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: 1,
      // Не обновлять данные автоматически при возвращении на вкладку
      refetchOnWindowFocus: false,
    },
  },
});
