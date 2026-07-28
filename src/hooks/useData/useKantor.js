import useSWR from 'swr';
import { useState } from 'react';
import { SERVICES } from '@/configs';
import { fetcher, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

// ✅ Hook Fetch Data Kantor (List & Filter)
export function useKantor({ dedupingInterval, params = {}, urlParams = {} } = defaultOptions) {
  const token = accessTokenStorage.get()?.value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.KANTOR(urlParams), { params }), 
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

// ✅ Hook Tambah Kantor
export function useAddKantor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addKantor = async (values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.KANTOR, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.err || "Gagal menambahkan data kantor");
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
  
  return { addKantor, loading, error };
}

// ✅ Hook Hapus Kantor
export function useDeleteKantor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const deleteKantor = async ({ idKantor }) => {
    setLoading(true);
    setError("");

    console.log(idKantor, "id Kantor ");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        SERVICES.KANTOR({ id: idKantor }),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.err || "Gagal menghapus data kantor");
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

  return { deleteKantor, loading, error };
}

// ✅ Hook Edit Kantor
export function useEditKantor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editKantor = async (values, idKantor) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        `${SERVICES.KANTOR}/${idKantor}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.err || "Gagal mengubah data kantor");
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

  return { editKantor, loading, error };
}