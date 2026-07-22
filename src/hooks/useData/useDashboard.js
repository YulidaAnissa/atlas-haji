import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

export function useDashboardFilter({ dedupingInterval, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.DASHBOARD_FILTER, { params }), 
    fetcher({ headers: { Authorization: `Bearer ${token}` } }),
    { dedupingInterval: getDedupingInterval(dedupingInterval) }
  );

  return {
    data: data,
    isLoading: !error && !data,
    error,
    fetch: mutate,
  };
}


export function useDashboardSummary({ dedupingInterval, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.DASHBOARD_SUMMARY, { params }), 
    fetcher({ headers: { Authorization: `Bearer ${token}` } }),
    { dedupingInterval: getDedupingInterval(dedupingInterval) }
  );

  return {
    data: data,
    isLoading: !error && !data,
    error,
    fetch: mutate
  };
}