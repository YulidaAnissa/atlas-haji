import { useState, useEffect } from "react";
import useSWR from 'swr';
import { SERVICES } from '@/configs';
import { fetcher, auth, createSwrKey, defaultOptions, getDedupingInterval } from './../utils';
import { accessTokenStorage, profileStorage } from '@/utils/storage';

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
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      // 💡 PERBAIKAN: Jika status HTTP bukan 2xx (misal 400, 500)
      if (!res.ok) {
        // Buat objek error baru dan lampirkan data error dari backend
        const errorObj = new Error(data.err || "Gagal menyimpan data");
        errorObj.response = { data }; // Meniru struktur Axios agar handleSubmit Anda tidak patah
        throw errorObj;
      }

      return data;
    } catch (err) {
      // Mengambil pesan error teks untuk state internal hook jika diperlukan
      const msg = err.response?.data?.err || err.message;
      setError(msg);
      throw err; // PENTING: Tetap throw agar ditangkap catch di handleSubmit
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
      const data = await res.json();

      // 💡 Ubah bagian pengecekan !res.ok di sini
      if (!res.ok) {
        const errorObj = new Error(data.err || "Gagal menyimpan data");
        errorObj.response = { data }; // Meniru struktur Axios agar handleSubmit Anda tidak patah
        throw errorObj;
      }

      return data;
    } catch (err) {
      const msg = err.response?.data?.err || err.message;
      setError(msg);
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
        `${SERVICES.PEGAWAI}/${values.nipAwal}`,
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

export function useNotifPegawai({ dedupingInterval, params = {} } = defaultOptions) {
  const token = accessTokenStorage.get().value;
  const [ profil, setProfil ] = useState(null);
  useEffect(() => {
    const storedProfile = profileStorage.get();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfil(storedProfile);
  }, []);
  const { data: { data } = {}, error, mutate } = useSWR(
    createSwrKey(SERVICES.NOTIFICATIONS({ id: profil?.nip }), { params }), 
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

