"use client";

import {
  DataTables,
  Breadcrumb,
  FormModal,
  Snackbar,
  LoadingOverlay,
  InfoModal,
} from "@/components/elements";
import PageBase from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useUangHarian } from "@/hooks/useData"; // Menggunakan hook baru yang dibuat sebelumnya
import UangHarianForm from "@/components/forms/UangHarian"; // Membuat form input baru
import { FaEdit } from "react-icons/fa";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX, FiDollarSign } from "react-icons/fi";
import { formatRupiah } from "@/utils/currency";

export default function DaftarUangHarian() {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleted, setDeleted] = useState(null);
  const [listData, setListData] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const { fetchAll, deleteData, updateData, loading: hookLoading } = useUangHarian();
  const [loadingFetch, setLoadingFetch] = useState(false);

  // Fungsi mengambil data
  const loadData = useCallback(async () => {
    setLoadingFetch(true);
    try {
      const res = await fetchAll();
      if (res.success) {
        setListData(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFetch(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kolom Table disesuaikan dengan skema gambar
  const headCells = [
    { id: "jenisPegawai", label: "Jenis / Golongan Pegawai", numeric: false, width: 300 },
    { id: "jumlah", label: "Besaran Uang Harian", numeric: false, width: 200 },
    { id: "aksi", label: "", numeric: false },
  ];

  const handleDelete = async () => {
    try {
      await deleteData(deleted);
      setDeleted(null);
      setShowSnackbar({
        show: true,
        message: "Data uang harian berhasil dihapus",
        type: "success",
      });
      await loadData();
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menghapus data uang harian",
        type: "error",
      });
      console.error("Error:", err);
    }
  };

  const handleUpdateUangHarian = async (values) => {
    try {
      const payload = {
        idUH: showEdit?.data?.idUH,
        jumlah: Number(values.jumlah),
        jenisPegawai: values.jenisPegawai,
      };

      await updateData(payload);
      await loadData();

      setShowEdit({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Data uang harian berhasil diubah",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal mengubah data uang harian",
        type: "error",
      });
      throw err;
    }
  };

  // Filter pencarian data lokal (client-side) berdasarkan jenisPegawai atau jumlah
  const filteredData = listData.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.jenisPegawai?.toLowerCase().includes(term) ||
      String(item.jumlah).includes(term)
    );
  });

  const formattedData = filteredData.map((item) => ({
    ...item,
    jumlah: formatRupiah(item.jumlah),
    aksi: (
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          onClick={() => setShowEdit({ show: true, data: item })}
        >
          <FiEdit2 className="h-4 w-4" />
          Ubah
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          onClick={() => setDeleted(item.idUH)}
        >
          <FiTrash2 className="h-4 w-4" />
          Hapus
        </button>
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Uang Harian" },
  ];

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand">
              Data Master
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Daftar Standar Uang Harian
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola acuan besaran plafon uang harian perjalanan dinas berdasarkan jenis jabatan 
              atau golongan kepegawaian.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25"
            onClick={() => setShowAdd(true)}
          >
            <FiPlus className="h-4 w-4" />
            Tambah Uang Harian
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c9a961]/15 md:max-w-sm">
            <FiSearch className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

            <input
              type="text"
              id="search"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari jenis pegawai atau nominal..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                className="ml-2 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                onClick={() => setSearch("")}
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <DataTables
          headCells={headCells}
          data={formattedData}
          loading={loadingFetch}
        />
      </section>

      <InfoModal
        show={deleted}
        onConfirm={handleDelete}
        onCancel={() => setDeleted(null)}
      >
        <p>Apakah kamu yakin ingin menghapus standar ketentuan uang harian ini?</p>
      </InfoModal>

      <FormModal
        className="w-xl"
        icon={<FiDollarSign className="h-6 w-6 text-white" />}
        show={showEdit?.show}
      >
        <UangHarianForm
          data={showEdit?.data}
          onSubmit={handleUpdateUangHarian}
          onClose={() => setShowEdit({ show: false, data: null })}
          type="edit"
        />
      </FormModal>

      <FormModal
        className="w-xl"
        icon={<FiDollarSign className="h-6 w-6 text-white" />}
        show={showAdd}
      >
        <UangHarianForm
          // data={showAdd}
          onSubmit={handleUpdateUangHarian}
          onClose={() => setShowAdd(false)}
        />
      </FormModal>

      <Snackbar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.message}
        onClose={() =>
          setShowSnackbar({ show: false, message: "", type: "" })
        }
      />

      <LoadingOverlay show={hookLoading} />
    </PageBase>
  );
}