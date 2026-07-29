"use client";

import { DataTables, Breadcrumb, DropdownFilter, Snackbar, InfoModal } from "@/components/elements";
import PageBase from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSuratTugas, useKantor, useDeleteSuratTugas } from "@/hooks/useData";
import { formatDate } from "@/utils/date";
import { FiPlus, FiSearch, FiX, FiEye, FiBriefcase } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { profileStorage } from "@/utils/storage";
import { HEAD_CELL } from "@/constants";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function DaftarPerjalananDinas() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [selectedKantor, setSelectedKantor] = useState("");
  const [profil, setProfil] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const userProfile = profileStorage.get();
    setProfil(userProfile);
    setSelectedKantor(userProfile?.idKantor || "");
  }, []);

  const targetKantor = profil?.idKantor === "1" 
    ? selectedKantor 
    : (selectedKantor || profil?.idKantor);

  const { data, isLoading, fetch } = useSuratTugas({
    params: { 
      search,
      ...(targetKantor && { idKantor: targetKantor })
    },
  });

  const { data: dataKantor, isLoading: loadingKantor } = useKantor();
  const { deleteSuratTugas, loading } = useDeleteSuratTugas();
  const handleDelete = async () => {
    if (!deletedId) return;
    try {
      // Sesuaikan fungsi API delete surat tugas Anda di sini
      await deleteSuratTugas({ idSurat: deletedId });
      
      setDeletedId(null);
      setShowSnackbar({
        show: true,
        message: "Perjalanan berhasil dihapus",
        type: "success",
      });
      await fetch();
    } catch (err) {
      const errorMessage = err.response?.data?.err || "Gagal menghapus perjalanan dinas";
      setShowSnackbar({
        show: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  const isAdmin =
    String(profil?.role || "").trim().toLowerCase() === "admin";

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    tglSurat: item.tglSurat ? formatDate(item.tglSurat, "DD MMMM YYYY") : "",
    aksi: (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          onClick={() => router.push(`/perjalanan-dinas/${item.idSurat}`)}
        >
          <FiEye className="h-4 w-4" />
        </button>
        {isAdmin && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            onClick={() => setDeletedId(item.idSurat)}
          >
            <TiDeleteOutline className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas" },
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
              Perjalanan Dinas
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Daftar Perjalanan Dinas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Kelola data perjalanan dinas, surat tugas, tujuan, dan jadwal
              keberangkatan dalam satu halaman.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25"
              onClick={() => router.push(`${pathname}/add`)}
            >
              <FiPlus className="h-4 w-4" />
              Tambah Perjalanan Dinas
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center justify-between w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
            <div className="flex h-11 w-full sm:w-72 md:w-80 shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 md:max-w-sm">
              <FiSearch className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="text"
                placeholder="Cari data perjalanan..."
                id="search"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
            {profil?.idKantor === "1" && (
              <DropdownFilter
                options={dataKantor ?? []}
                value={selectedKantor}
                onChange={setSelectedKantor}
                placeholder="Semua Kantor"
                valueKey="idKantor"
                labelKey="unitKantor"
                icon={FiBriefcase}
                loading={loadingKantor}
                className="w-full sm:flex-1 sm:max-w-md"
              />
            )}
          </div>
        </div>

        <DataTables
          headCells={HEAD_CELL}
          data={formattedData}
          loading={isLoading}
        />
      </section>
      <Snackbar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.message}
        onClose={() =>
          setShowSnackbar({ show: false, message: "", type: "" })
        }
      />
      <InfoModal
        show={deletedId}
        onConfirm={handleDelete}
        onCancel={() => setDeletedId(null)}
      >
        <p>Apakah kamu yakin ingin menghapus perjalanan ini?</p>
      </InfoModal>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}