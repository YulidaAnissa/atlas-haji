import { useState } from "react";
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

export function useAddSuratTugas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSuratTugas = async (values) => {
    setLoading(true);
    setError("");

    try {
      const token = accessTokenStorage.get()?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.SURAT_TUGAS(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menambahkan surat tugas");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addSuratTugas, loading, error };
}

export function useDeleteSuratTugas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteSuratTugas = async ({ idSurat }) => {
    setLoading(true);
    setError("");

    try {
      const token = accessTokenStorage.get()?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.SURAT_TUGAS({ id: idSurat }), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Gagal menghapus surat tugas"
        );
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSuratTugas, loading, error };
}

export function useEditSuratTugas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editSuratTugas = async ({ idSurat, values }) => {
    setLoading(true);
    setError("");

    try {
      const token = accessTokenStorage.get()?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.SURAT_TUGAS({ id: idSurat }), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values,
      });

      if (!res.ok) {
        throw new Error("Gagal mengubah surat tugas");
      }

      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editSuratTugas, loading, error };
}