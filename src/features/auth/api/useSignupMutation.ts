import { axiosInstance } from '@shared/lib/axiosConfig';
import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { API_ENDPOINTS } from '@shared/config/api';
import { SignupDTO } from '../model/types';

interface SignupResponse {
  message: string;
}

export function useSignupMutation() {
  return useCustomMutation<SignupResponse, SignupDTO>(async (variables) => {
    const response = await axiosInstance.post<SignupResponse>(API_ENDPOINTS.AUTH.SIGNUP, variables);
    return response.data;
  });
}
