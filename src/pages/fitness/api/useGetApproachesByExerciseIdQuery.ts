import { useCustomQuery } from '@shared/hooks/useCustomQuery';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { ApproachModel } from '../model/types';
import { QUERY_KEYS } from '@shared/config/queryKeys';

export const useGetApproachesByExerciseIdQuery = (exerciseId?: string) => {
  const queryKey = QUERY_KEYS.FITNESS.APPROACHES_BY_EXERCISE_ID(exerciseId);

  return useCustomQuery<ApproachModel[], ApproachModel[]>(
    queryKey,
    async () => {
      if (!exerciseId) return [];

      const res = await axiosInstance.get<ApproachModel[]>(API_ENDPOINTS.FITNESS.APPROACHES, {
        params: { exerciseId },
      });
      return res.data;
    },
    {
      enabled: !!exerciseId,
      queryKey: queryKey,
    },
  );
};
