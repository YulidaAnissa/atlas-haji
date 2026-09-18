"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiEye } from "react-icons/fi";

import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase from "@/components/pagebase";
import { usePerjalananPegawai } from "@/hooks/useData";
import { formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";

function DaftarPerjalananDinasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [profil, setProfil] = useState(null);
  const [selectedKantor, setSelectedKantor] = useState("");
  
  useEffect(() => {
    const userProfile = profileStorage.get();
    setProfil(userProfile);

    setSelectedKantor(userProfile?.idKantor || "");
  }, []);

  const targetKantor = profil?.idKantor === "1" 
    ? selectedKantor 
    : (selectedKantor || profil?.idKantor);

  const status = searchParams.get("status") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";

  const { data, isLoading } = usePerjalananPegawai({
    params: { 
      search, 
      status,
      month,
      year,
      ...(targetKantor && { idKantor: targetKantor }), 
      ...(profil?.role !== "admin" && profil?.nip && { nip: profil.nip }) },
  });

  

  const headCells = [
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "tujuan", label: "Tujuan", numeric: false },
    { id: "tanggal", label: "Tanggal Pelaksanaan", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  const formattedData = (data ?? []).map((item) => {
    const isPerjalananKhusus =
      String(item?.typePerjalanan ?? "").trim().toLowerCase() === "khusus";

    return {
      ...item,
      nama: (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{item.nama}</span>

          {item.nip && <span className="text-xs text-gray-500">{item.nip}</span>}

          {isPerjalananKhusus && (
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Perjalanan Khusus
            </span>
          )}
        </div>
      ),
      tanggal: formatRangeDate(
        item.tglBerangkat,
        item.tglKembali,
        "DD MMM YYYY",
      ),
      aksi:
        item?.status === "tolak" ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            onClick={() =>
              router.push(`/laporan-perjalanan/${item.idSurat}`)
            }
          >
            <FiEye className="h-4 w-4" />
          </button>
        ) : " ",
    };
  });

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
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 md:max-w-sm">
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
        </div>

        <DataTables
          headCells={headCells}
          data={formattedData}
          loading={isLoading}
        />
      </section>
    </PageBase>
  );
}

export default function DaftarPerjalananDinas() {
  return (
    <Suspense fallback={null}>
      <DaftarPerjalananDinasContent />
    </Suspense>
  );
}