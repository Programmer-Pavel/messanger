import { API_ENDPOINTS } from '@shared/config/api';
import { axiosInstance } from '@shared/lib/axiosConfig';

/**
 * Проверяет аутентификацию пользователя
 * Используется как loader для защищенных маршрутов
 */
export const authCheck = async () => {
  await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK_AUTH);
};
