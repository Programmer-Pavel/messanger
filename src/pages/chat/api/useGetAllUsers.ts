import { useCustomQuery } from '@shared/hooks/useCustomQuery';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { API_ENDPOINTS } from '@shared/config/api';
import { User } from '@features/auth';

export const useGetUsers = () => {
  return useCustomQuery<User[], User[]>(['users'], async () => {
    const res = await axiosInstance.get<User[]>(API_ENDPOINTS.USERS.GET_ALL);
    return res.data;
  });
};
