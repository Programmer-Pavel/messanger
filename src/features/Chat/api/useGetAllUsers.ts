import { useCustomQuery } from '@shared/hooks/useCustomQuery';
import { axiosInstance } from '@shared/lib/axiosConfig';
import { User } from '../model/User';

export const useGetUsers = () => {
  return useCustomQuery<User[], User[]>(['users'], async () => {
    const res = await axiosInstance.get<User[]>('/users');
    return res.data;
  });
};
