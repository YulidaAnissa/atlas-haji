"use client";

import { DataTables, Breadcrumb, DropdownFilter } from "@/components/elements";
import PageBase from "@/components/pagebase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSuratTugas, useKantor } from "@/hooks/useData";
import { formatDate } from "@/utils/date";
import { FiEye, FiSearch, FiX, FiBriefcase } from "react-icons/fi";
import { HEAD_CELL } from "@/constants";
import { profileStorage } from "@/utils/storage";

export default function DaftarBiayaPerjalanan() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profil, setProfil] = useState(null);
  const [selectedKantor, setSelectedKantor] = useState("");

  useEffect(() => {
      setProfil(profileStorage.get());
    }, []);
  const targetKantor = profil?.idKantor === "1" 
    ? selectedKantor 
    : (selectedKantor || profil?.idKantor);
    
  const { data, isLoading } = useSuratTugas({
    params: { 
      search,
      ...(targetKantor && { idKantor: targetKantor })
    }
  });

  const { data: dataKantor, isLoading: loadingKantor } = useKantor();

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    tglSurat: item.tglSurat ? formatDate(item.tglSurat, "DD MMMM YYYY") : "",
    aksi: (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
        onClick={() => router.push(`/daftar-nominatif/${item.idSurat}`)}
      >
        <FiEye className="h-4 w-4" />
        Lihat
      </button>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Biaya Perjalanan" },
  ];

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            Nominatif
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Biaya Perjalanan
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Kelola daftar biaya perjalanan berdasarkan surat tugas, tanggal
            surat, dan kegiatan perjalanan dinas.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
         <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center justify-between w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
            <div className="flex h-11 w-full sm:w-72 md:w-80 shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 md:max-w-sm">
              <FiSearch className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="text"
                id="search"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari surat tugas..."
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
            {profil?.idKantor === '1' && (
              <DropdownFilter
                options={dataKantor ?? []}
                value={selectedKantor}
                onChange={setSelectedKantor}
                placeholder="Semua Kantor"
                valueKey="idKantor"
                labelKey="nama"
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
    </PageBase>
  );
}