import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';
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

    console.log("Updating laporan with values:", values);

    const isFormData = values instanceof FormData;

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.LAPORAN({ id: idPerjalananPegawai }), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        body: isFormData ? values : JSON.stringify(values),
      });

      // 💡 Coba parse JSON dari respon backend
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // 💡 Ambil pesan error dari backend jika ada, kalau tidak ada gunakan status text / default
        const errorMessage =
          data?.message ||
          res.statusText ||
          "Gagal mengupdate laporan perjalanan";
          
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err; // Lempar error dengan pesan yang sudah diekstrak
    } finally {
      setLoading(false);
    }
  };

  return { updateLaporan, loading, error };
}