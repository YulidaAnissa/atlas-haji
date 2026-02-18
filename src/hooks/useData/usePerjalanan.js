import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, deleteFetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage } from '@/utils/storage';
import useSWRMutation from "swr/mutation";
import { useState } from 'react';

export function usePerjalanan({ dedupingInterval, urlParams = {}, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const { data: { data } = [], error, mutate } = useSWR(
    createSwrKey(SERVICES.PERJALANAN(urlParams), { params }), 
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

export function useDeletePerjalananPegawai() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deletePerjalananPegawai = async ({ idPerjalanan, nip }) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        `${SERVICES.PERJALANAN_PEGAWAI}?idPerjalanan=${idPerjalanan}&nip=${nip}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gagal menghapus pegawai dari perjalanan");
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

  return { deletePerjalananPegawai, loading, error };
}

export function useAddPegawaiPerjalanan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postPegawai = async (values) => {
    const { pegawai, idPerjalanan } = values;
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(
        `${SERVICES.PERJALANAN_PEGAWAI}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ pegawai, idPerjalanan }),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal menambah pegawai");
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

  return { postPegawai, loading, error };
}

export function useUpdatePerjalanan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updatePerjalanan = async (idPerjalanan, values) => {
    setLoading(true);
    setError("");

    try {
      const tokenObj = accessTokenStorage.get();
      const token = tokenObj?.value;

      if (!token) {
        throw new Error("Token tidak tersedia, user belum login");
      }

      const res = await fetch(SERVICES.PERJALANAN({ id: idPerjalanan }), {
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
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updatePerjalanan, loading, error };
}
