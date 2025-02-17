import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Типы для ключа запроса и функции получения данных
type QueryKey = readonly unknown[];

export function useCustomQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, AxiosError, TData>,
): UseQueryResult<TData, AxiosError> {
  return useQuery<TQueryFnData, AxiosError, TData>({
    queryKey,
    queryFn,
    // staleTime: 1000 * 60 * 5, // 5 минут
    retry: 1,
    ...options,
  });
}
