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
import { useState } from "react";
import { usePegawai, useDeletePegawai, useEditPegawai } from "@/hooks/useData";
import AddPegawaiForm from "@/components/forms/Pegawai";
import { FaEdit } from "react-icons/fa";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";

export default function DaftarPegawai() {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const { data, isLoading, fetch } = usePegawai({
    params: { search },
  });

  console.log('ini pegawai ', data);
  const { deletePegawai, loading } = useDeletePegawai();
  const { editPegawai, loading: loadingEdit } = useEditPegawai();

  const headCells = [
    { id: "nama", label: "Nama Pegawai", numeric: false, width: 250 },
    { id: "nip", label: "NIP", numeric: false },
    { id: "pangkatGol", label: "Pangkat / Gol", numeric: false, width: 150 },
    { id: "jabatan", label: "Jabatan", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  const handleDelete = async () => {
    try {
      await deletePegawai({ nip: deleted });
      setDeleted(null);
      setShowSnackbar({
        show: true,
        message: "Pegawai berhasil dihapus",
        type: "success",
      });
      await fetch();
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menghapus pegawai",
        type: "error",
      });
      console.error("Error:", err);
    }
  };

  const handleUpdatePegawai = async (values) => {
    try {
      const payload = {
        ...(values.nama && { nama: values.nama }),
        ...(values.nip && { nip: values.nip }),
        ...(values.pangkat && { pangkat: values.pangkat }),
        ...(values.gol && { gol: values.gol }),
        ...(values.jabatan && { jabatan: values.jabatan }),
      };

      await editPegawai(payload);
      await fetch();

      setShowEdit({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Pegawai berhasil diubah",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal mengubah pegawai",
        type: "error",
      });
      throw err;
    }
  };

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    pangkatGol: item.pangkat?.trim()
      ? `${item.pangkat.trim()} / ${item.gol || "-"}`
      : item.gol || "-",
    aksi: (
      <div className="flex gap-2">
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
          onClick={() => setDeleted(item.nip)}
        >
          <FiTrash2 className="h-4 w-4" />
          Hapus
        </button>
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Pegawai" },
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
              Daftar Pegawai
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola data pegawai, NIP, pangkat, golongan, dan jabatan untuk
              kebutuhan perjalanan dinas.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25"
            onClick={() => router.push(`${pathname}/add`)}
          >
            <FiPlus className="h-4 w-4" />
            Tambah Pegawai
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 md:max-w-sm">
            <FiSearch className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

            <input
              type="text"
              id="search"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari pegawai..."
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
          loading={isLoading}
        />
      </section>

      <InfoModal
        show={deleted}
        onConfirm={handleDelete}
        onCancel={() => setDeleted(null)}
      >
        <p>Apakah kamu yakin ingin menghapus pegawai ini?</p>
      </InfoModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showEdit?.show}
      >
        <AddPegawaiForm
          data={showEdit?.data}
          onSubmit={handleUpdatePegawai}
          onClose={() => setShowEdit({ show: false, data: null })}
          type="edit"
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

      <LoadingOverlay show={loadingEdit || loading} />
    </PageBase>
  );
}