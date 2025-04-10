import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { queryClient } from '@shared/lib/queryClient';
import { QUERY_KEYS } from '@shared/config/queryKeys';
import { ApproachModel } from '../model/types';

export function useDeleteApproachMutation() {
  return useCustomMutation<ApproachModel, string>(
    async (id) => {
      const response = await axiosInstance.delete<ApproachModel>(`${API_ENDPOINTS.FITNESS.APPROACHES}/${id}`);
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
