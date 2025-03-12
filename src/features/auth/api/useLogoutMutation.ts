import { API_ENDPOINTS } from '@shared/config/api';
import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';

interface LogoutResponse {
  message: string;
}

export function useLogoutMutation() {
  return useCustomMutation<LogoutResponse, unknown>(async () => {
    const response = await axiosInstance.post<LogoutResponse>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
    return response.data;
  });
}
