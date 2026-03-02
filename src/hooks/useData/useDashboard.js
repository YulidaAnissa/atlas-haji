import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, deleteFetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';
import useSWRMutation from "swr/mutation";
import { useState } from 'react';

export function useDashboardFilter({ dedupingInterval, urlParams = {}} = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = [], error, mutate } = useSWR(
    createSwrKey(SERVICES.DASHBOARD_FILTER(urlParams)), 
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


export function useDashboardSummary({ dedupingInterval } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = [], error, mutate } = useSWR(
    createSwrKey(SERVICES.DASHBOARD_SUMMARY), 
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