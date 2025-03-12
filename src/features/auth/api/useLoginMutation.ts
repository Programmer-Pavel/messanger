import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { LoginDTO } from '../model/loginSchema';
import { API_ENDPOINTS } from '@shared/config/api';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function useLoginMutation() {
  return useCustomMutation<LoginResponse, LoginDTO>(async (variables) => {
    const response = await axiosInstance.post<LoginResponse>(
      API_ENDPOINTS.AUTH.SIGNIN,
      variables,
    );
    if (response.data)
      localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  });
}
