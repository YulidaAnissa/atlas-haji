import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

export function useSuratTugas({ dedupingInterval } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = {}, error } = useSWR(
    createSwrKey(SERVICES.SURAT_TUGAS), 
    fetcher({ headers: { Authorization: `Bearer ${token}` } }),
    { dedupingInterval: getDedupingInterval(dedupingInterval) }
  );

  return {
    data: data,
    isLoading: !error && !data,
    error,
  };
}