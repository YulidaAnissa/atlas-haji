import useSWR from 'swr';
import { useState } from 'react';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

// ==========================================
// 1. Hook GET ALL / READ Uang Harian
// ==========================================
export function useUangHarian({ dedupingInterval, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get()?.value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.UANG_HARIAN, { params }), 
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

// ==========================================
// 2. Hook POST / CREATE Uang Harian
// ==========================================
export function useAddUangHarian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addUangHarian = async (values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.UANG_HARIAN, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // values berisi: { jumlah, jenisPegawai }
      });

      if (!res.ok) {
        throw new Error("Gagal menambahkan data uang harian");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { addUangHarian, loading, error };
}

// ==========================================
// 3. Hook DELETE Uang Harian
// ==========================================
export function useDeleteUangHarian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteUangHarian = async (idUH) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      // Sesuai dengan route backend: router.delete('/:idUH')
      const res = await fetch(
        `${SERVICES.UANG_HARIAN}/${idUH}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gagal menghapus data uang harian");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUangHarian, loading, error };
}

// ==========================================
// 4. Hook PUT / EDIT Uang Harian
// ==========================================
export function useEditUangHarian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editUangHarian = async (values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      // Sesuai dengan route backend: router.put('/', ...) di mana idUH dikirim di body
      const res = await fetch(
        SERVICES.UANG_HARIAN,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // values wajib menyertakan: idUH
        }
      );

      if (!res.ok) {
        throw new Error("Gagal memperbarui data uang harian");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editUangHarian, loading, error };
}