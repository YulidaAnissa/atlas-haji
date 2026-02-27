import { useState } from "react";
import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';

export function usePegawai({ dedupingInterval, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.PEGAWAI, { params }), 
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

export function useAddPegawai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addPegawai = async (values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.PEGAWAI, {
        method: "POST", // atau PATCH sesuai API kamu
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Gagal menambahkan pegawai");
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
  
  return { addPegawai, loading, error };
}

export function useDeletePegawai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deletePegawai = async ({ nip }) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        `${SERVICES.PEGAWAI}/${nip}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gagal menghapus pegawai");
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

  return { deletePegawai, loading, error };
}

export function useEditPegawai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editPegawai = async (values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        `${SERVICES.PEGAWAI}/${values.nip}`,
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
        throw new Error("Gagal menghapus pegawai");
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

  return { editPegawai, loading, error };
}