"use client";

import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase from "@/components/pagebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePerjalanan } from "@/hooks/useData";
import { formatDate } from "@/utils/date";
import { FiEye, FiSearch, FiX } from "react-icons/fi";

export default function DaftarLaporanPerjalananDinas() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePerjalanan({
    params: { search, noSurat: true },
  });

  const headCells = [
    { id: "tglBerangkat", label: "Tanggal Berangkat", numeric: false },
    { id: "tglKembali", label: "Tanggal Kembali", numeric: false },
    { id: "kabkota", label: "Tujuan", numeric: false },
    { id: "kegiatan", label: "Kegiatan", numeric: false },
    { id: "noSurat", label: "Nomor Surat Tugas", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    tglBerangkat: item.tglBerangkat ? formatDate(item.tglBerangkat) : "",
    tglKembali: item.tglKembali ? formatDate(item.tglKembali) : "",
    aksi: (
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
        onClick={() => router.push(`/laporan-perjalanan/${item.idPerjalanan}`)}
      >
        <FiEye className="h-4 w-4" />
        Lihat
      </button>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Laporan Perjalanan Dinas" },
  ];

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            Laporan
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Daftar Laporan Perjalanan Dinas
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau dan buka laporan perjalanan dinas berdasarkan surat tugas,
            tujuan, kegiatan, dan tanggal pelaksanaan.
          </p>
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
              placeholder="Cari laporan perjalanan..."
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