import { useCustomMutation } from '@shared/hooks/useCustomMutation';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { queryClient } from '@shared/lib/queryClient';
import { QUERY_KEYS } from '@shared/config/queryKeys';

export function useDeleteApproachMutation() {
  return useCustomMutation<{ id: string }, string>(
    async (id) => {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.FITNESS.APPROACHES}/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FITNESS.APPROACHES],
        });
      },
    },
  );
}
