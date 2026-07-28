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
// Tambahkan useKabKota untuk mengambil data options dropdown
import { useDeleteKantor, useEditKantor, useKantor, useKabKota } from "@/hooks/useData";
import AddKantorForm from "@/components/forms/Kantor";
import { FaEdit } from "react-icons/fa";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import { extractKodeSurat } from "@/utils/string";

export default function DaftarKantor() {
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

  // Ambil data daftar kantor
  const { data, isLoading, fetch } = useKantor({
    params: { search },
  });
  
  // Ambil data referensi Kabupaten/Kota untuk dropdown di form edit
  const { data: kabKotaData } = useKabKota(); 

  const { deleteKantor, loading } = useDeleteKantor();
  const { editKantor, loading: loadingEdit } = useEditKantor();

  // 1. Penyesuaian header tabel untuk entitas Kantor
  const headCells = [
    { id: "nama", label: "Nama Kantor", numeric: false, width: 250 },
    { id: "alamat", label: "Alamat", numeric: false, width: 350 },
    { id: "email", label: "Email", numeric: false, width: 150 },
    { id: "aksi", label: "", numeric: false, width: 150 },
  ];

  const handleDelete = async () => {
    try {
      await deleteKantor({ idKantor: deleted });
      setDeleted(null);
      setShowSnackbar({
        show: true,
        message: "Data kantor berhasil dihapus",
        type: "success",
      });
      await fetch();
    } catch (err) {
      // Mengambil pesan error dari backend (err.message)
      const errorMessage = err.message || "Gagal menghapus data kantor";
      
      setShowSnackbar({
        show: true,
        message: errorMessage,
        type: "error",
      });
      console.error("Error:", err);
    }
  };

  const handleUpdateKantor = async (values) => {
    try {
      // 2. Menyesuaikan payload edit untuk field Kantor sesuai struktur database
      const payload = {
        nama: values?.nama?.trim() || null,
        alamat: values?.alamat?.trim() || null,
        email: values?.email?.trim() || null,
        website: values?.website?.trim() || null,
        callCenter: values?.callCenter?.trim() || null,
        idKabKota: values?.idKabKota?.value ? Number(values.idKabKota?.value) : null,
        unitKantor: values?.unitKantor?.trim() || null,
        kodeSurat: extractKodeSurat(values?.kodeSurat?.value) || 0
      };

      await editKantor(payload, showEdit?.data?.idKantor);
      await fetch();

      setShowEdit({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Data kantor berhasil diubah",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal mengubah data kantor",
        type: "error",
      });
      throw err;
    }
  };

  // 3. Mapping data untuk render tabel dan tombol aksi
  const formattedData = (data ?? []).map((item) => ({
    ...item,
    aksi: (
      <div className="flex gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          onClick={() => setDeleted(item.idKantor)} 
        >
          <TiDeleteOutline className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          onClick={() => setShowEdit({ show: true, data: item })}
        >
          <TiEdit className="h-6 w-6" />
        </button>
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Kantor" },
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
              Daftar Kantor
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola informasi cabang, lokasi fisik, alamat, dan rincian kontak operasional perusahaan.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25"
            onClick={() => router.push(`${pathname}/add`)}
          >
            <FiPlus className="h-4 w-4" />
            Tambah Kantor
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
              placeholder="Cari kantor..."
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
        <p>Apakah kamu yakin ingin menghapus data kantor ini?</p>
      </InfoModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showEdit?.show}
      >
        <AddKantorForm
          data={showEdit?.data}
          onSubmit={handleUpdateKantor}
          onClose={() => setShowEdit({ show: false, data: null })}
          type="edit"
          kabKotaOptions={kabKotaData} // Oper data Kabupaten/Kota ke form untuk render select options
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