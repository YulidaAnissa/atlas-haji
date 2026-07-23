import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

export function useNominatifAjuan({ dedupingInterval, urlParams = {}, params = {}} = {}) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = [], error, mutate } = useSWR(
    createSwrKey(SERVICES.NOMINATIF_AJUAN(urlParams), { params }), 
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