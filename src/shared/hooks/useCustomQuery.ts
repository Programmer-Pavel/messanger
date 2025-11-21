import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type QueryKey = readonly unknown[];

export function useCustomQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, AxiosError, TData>,
): UseQueryResult<TData, AxiosError> {
  return useQuery<TQueryFnData, AxiosError, TData>({
    queryKey,
    queryFn,
    ...options,
  });
}
