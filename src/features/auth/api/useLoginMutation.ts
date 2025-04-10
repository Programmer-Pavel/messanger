import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { useUserStore } from '../model/userStore';
import { LoginDTO, User } from '../model/types';

interface LoginResponse {
  message: string;
  user: User;
}

export function useLoginMutation() {
  const setUser = useUserStore((state) => state.setUser);

  return useCustomMutation<LoginResponse, LoginDTO>(async (variables) => {
    const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.AUTH.SIGNIN, variables);

    if (response.data.user) {
      setUser(response.data.user);
    }

    return response.data;
  });
}
