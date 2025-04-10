import { API_ENDPOINTS } from '@shared/config/api';
import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { useUserStore } from '../model/userStore';

interface LogoutResponse {
  message: string;
}

export function useLogoutMutation() {
  const clearUser = useUserStore((state) => state.clearUser);

  return useCustomMutation<LogoutResponse, unknown>(async () => {
    const response = await axiosInstance.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);

    clearUser();

    return response.data;
  });
}
