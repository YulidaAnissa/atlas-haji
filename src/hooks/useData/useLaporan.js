import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, deleteFetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';
import useSWRMutation from "swr/mutation";
import { useState } from 'react';

export function useLaporan({ dedupingInterval, urlParams = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = [], error, mutate } = useSWR(
    createSwrKey(SERVICES.LAPORAN(urlParams)), 
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

export function useUpdateLaporan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateLaporan = async (idPerjalananPegawai, values) => {
    setLoading(true);
    setError("");

    console.log("update perjalanan", values);

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.LAPORAN({ id: idPerjalananPegawai }), {
        method: "PUT", // atau PATCH sesuai API kamu
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Gagal mengupdate perjalanan");
      }

      const data = await res.json();

      console.log("data ", data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updateLaporan, loading, error };
}