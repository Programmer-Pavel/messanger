import { SignupDTO } from '../model/schema';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { useCustomMutation } from '@shared/hooks/useCustomMutation';

interface SignupResponse {
  message: string;
}

export function useSignupMutation() {
  return useCustomMutation<SignupResponse, SignupDTO>(async (variables) => {
    const response = await axiosInstance.post<SignupResponse>(
      '/auth/signup',
      variables,
    );
    return response.data;
  });
}
