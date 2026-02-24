import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

export function useSuratTugas({ dedupingInterval, params = {}, urlParams = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.SURAT_TUGAS(urlParams), { params }), 
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

// export function useLaporan({ dedupingInterval, urlParams = {} } = defaultOptions) {
//   const token = accessTokenStorage.get().value;
//   const { data: { data } = [], error, mutate } = useSWR(
//     createSwrKey(SERVICES.LAPORAN(urlParams)), 
//     fetcher({ headers: { Authorization: `Bearer ${token}` } }),
//     { dedupingInterval: getDedupingInterval(dedupingInterval) }
//   );

//   return {
//     data: data,
//     isLoading: !error && !data,
//     error,
//     fetch: mutate
//   };
// }