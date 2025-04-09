import { useCustomQuery } from '@shared/hooks/useCustomQuery';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { ExerciseModel } from '../model/types';
import { QUERY_KEYS } from '@shared/config/queryKeys';

export const useGetExercisesByUserIdQuery = (userId?: number) => {
  return useCustomQuery<ExerciseModel[], ExerciseModel[]>(QUERY_KEYS.FITNESS.EXERCISES_BY_USER_ID(userId), async () => {
    const res = await axiosInstance.get<ExerciseModel[]>(API_ENDPOINTS.FITNESS.GET_ALL, {
      params: { userId },
    });
    return res.data;
  });
};
