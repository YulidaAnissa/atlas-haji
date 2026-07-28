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
import {
  useSuratTugas,
  useDeleteSuratTugas,
  useEditSuratTugas,
} from "@/hooks/useData";
import AddSuratTugasForm from "@/components/forms/SuratTugas";
import { FaEdit } from "react-icons/fa";
import { FiEdit2, FiFileText, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { formatDate } from "@/utils/date";

export default function DaftarSuratTugas() {
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

  const { data, isLoading, fetch } = useSuratTugas({
    params: { search },
  });

  const { deleteSuratTugas, loading } = useDeleteSuratTugas();
  const { editSuratTugas, loading: loadingEdit } = useEditSuratTugas();

  const headCells = [
    { id: "noSurat", label: "Nomor Surat", numeric: false, width: 240 },
    { id: "tglSuratFormatted", label: "Tanggal Surat", numeric: false, width: 160 },
    { id: "kegiatan", label: "Kegiatan", numeric: false },
    { id: "filePreview", label: "File", numeric: false, width: 130 },
    { id: "aksi", label: "", numeric: false, width: 190 },
  ];

  const handleDelete = async () => {
    try {
      await deleteSuratTugas({ idSurat: deleted });

      setDeleted(null);
      setShowSnackbar({
        show: true,
        message: "Surat tugas berhasil dihapus",
        type: "success",
      });

      await fetch();
    } catch (err) {
      setDeleted(null);
      setShowSnackbar({
        show: true,
        message: err?.message || "Gagal menghapus surat tugas",
        type: "error",
      });

      console.error("Error:", err);
    }
  };

  const handleUpdateSuratTugas = async (values) => {
    try {
      const formData = new FormData();

      if (values.idSurat) formData.append("idSurat", values.idSurat);
      if (values.noSurat) formData.append("noSurat", values.noSurat);
      if (values.tglSurat) {
        formData.append("tglSurat", formatDate(values.tglSurat, "YYYY-MM-DD"));
      }
      if (values.kegiatan) formData.append("kegiatan", values.kegiatan);
      if (values.file) formData.append("file", values.file);
      await editSuratTugas({
        idSurat: values.idSurat,
        values: formData
      });
      await fetch();

      setShowEdit({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Surat tugas berhasil diubah",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal mengubah surat tugas",
        type: "error",
      });
      throw err;
    }
  };

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    tglSuratFormatted: item.tglSurat ? formatDate(item.tglSurat) : "-",
    filePreview: item.file ? (
      <a
        href={item.file}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        <FiFileText className="h-4 w-4" />
        Lihat
      </a>
    ) : (
      <span className="text-sm text-slate-400">-</span>
    ),
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
          onClick={() => setDeleted(item.idSurat)}
        >
          <FiTrash2 className="h-4 w-4" />
          Hapus
        </button>
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Surat Tugas" },
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
              Daftar Surat Tugas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola nomor surat, tanggal surat, kegiatan, dan dokumen surat
              tugas untuk kebutuhan perjalanan dinas.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25"
            onClick={() => router.push(`${pathname}/add`)}
          >
            <FiPlus className="h-4 w-4" />
            Tambah Surat
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
              placeholder="Cari nomor surat atau kegiatan..."
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
        <p>Apakah kamu yakin ingin menghapus surat tugas ini?</p>
      </InfoModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showEdit?.show}
      >
        <AddSuratTugasForm
          data={showEdit?.data}
          onSubmit={handleUpdateSuratTugas}
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