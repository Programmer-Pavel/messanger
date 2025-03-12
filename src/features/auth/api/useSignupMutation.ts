import { axiosInstance } from '@shared/lib/axiosConfig';
import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { SignupDTO } from '../model/signupSchema';
import { API_ENDPOINTS } from '@shared/config/api';

interface SignupResponse {
  message: string;
}

export function useSignupMutation() {
  return useCustomMutation<SignupResponse, SignupDTO>(async (variables) => {
    const response = await axiosInstance.post<SignupResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      variables,
    );
    return response.data;
  });
}
