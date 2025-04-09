import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { ExerciseFormData, ExerciseModel } from '../model/types';
import { queryClient } from '@shared/lib/queryClient';
import { QUERY_KEYS } from '@shared/config/queryKeys';

export function useAddExerciseMutation() {
  return useCustomMutation<ExerciseModel, ExerciseFormData>(
    async (variables) => {
      const response = await axiosInstance.post<ExerciseModel>(API_ENDPOINTS.FITNESS.CREATE, variables);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.FITNESS.EXERCISES_BY_USER_ID(data.userId),
        });
      },
    },
  );
}
