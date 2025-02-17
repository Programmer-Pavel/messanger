import { ApiError } from '@shared/types/ApiError';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import toast from 'react-hot-toast';

export function useCustomMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, AxiosError, TVariables>,
): UseMutationResult<TData, AxiosError, TVariables> {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    onError: (error) => {
      const { message } = error.response?.data as ApiError;
      if (message) {
        toast.error(message || 'Произошла ошибка');
      }
    },
    ...options,
  });
}
