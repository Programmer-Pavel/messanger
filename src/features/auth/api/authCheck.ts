import { API_ENDPOINTS } from '@shared/config/api';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { useUserStore } from '../model/userStore';

/**
 * Проверяет аутентификацию пользователя
 * Используется как loader для защищенных маршрутов
 */
export const authCheck = async () => {
  try {
    await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK_AUTH);
    return true;
  } catch (error) {
    // Если запрос не прошел, очищаем данные пользователя
    useUserStore.getState().clearUser();
    throw error;
  }
};
