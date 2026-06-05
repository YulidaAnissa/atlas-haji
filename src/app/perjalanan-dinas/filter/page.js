"use client";

import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase from "@/components/pagebase";
import { usePathname, useRouter, useSearchParams  } from "next/navigation";
import { useState, useEffect } from "react";
import { usePerjalananPegawai } from "@/hooks/useData";
import { formatDate } from "@/utils/date";
import { FiPlus, FiSearch, FiX, FiEye } from "react-icons/fi";
import { profileStorage } from "@/utils/storage";

export default function DaftarPerjalananDinas() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  const status = searchParams.get("status");

  const { data, isLoading } = usePerjalananPegawai({
    params: { search, status },
  });

  console.log('data perjalanan pegawai ', data);
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    setProfil(profileStorage.get());
  }, []);

  const isAdmin =
    String(profil?.role || "").trim().toLowerCase() === "admin";

  const headCells = [
    { id: "nama", label: "Nama", numeric: false },
    { id: "tglBerangkat", label: "Tanggal Berangkat", numeric: false },
    { id: "tglKembali", label: "Tanggal Kembali", numeric: false },
    { id: "kabkota", label: "Tujuan", numeric: false },
    // { id: "kegiatan", label: "Kegiatan", numeric: false },
    // { id: "status", label: "Nomor Surat Tugas", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  const formattedData = (data ?? []).map((item) => ({
    ...item,
    tglBerangkat: item.tglBerangkat ? formatDate(item.tglBerangkat) : "",
    tglKembali: item.tglKembali ? formatDate(item.tglKembali) : "",
    aksi: (
      item?.status === "tolak" && (
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          onClick={() => router.push(`/laporan-perjalanan/${item.idPerjalanan}`)}
        >
          <FiEye className="h-4 w-4" />
          Lihat
        </button>
      )
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