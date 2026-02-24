"use client";
import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase  from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { usePerjalanan } from "@/hooks/useData";
import { formatDate } from "@/utils/date";

export default function DaftarPerjalananDinas() {
  const router = useRouter();
  const pathname = usePathname();
  const [ search, setSearch ] = useState("");
  const { data, isLoading } = usePerjalanan({ params: { search: search }});

  const headCells = [
    { id: 'tglBerangkat', label: 'Tanggal Berangkat', numeric: false },
    { id: 'tglKembali', label: 'Tanggal Kembali', numeric: false },
    { id: 'kabkota', label: 'Tujuan', numeric: false },
    { id: 'kegiatan', label: 'Kegiatan', numeric: false },
    { id: 'noSurat', label: 'Nomor Surat Tugas', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const formattedData = (data ?? [])?.map(item => ({
    ...item,
    tglBerangkat: item.tglBerangkat ? formatDate(item.tglBerangkat) : "",
    tglKembali: item.tglKembali ? formatDate(item.tglKembali) : "",
    aksi: (
      <div className="flex gap-2">
        <button
          className="py-2 px-4 rounded bg-primary cursor-pointer text-white"
          onClick={() => router.push(`/perjalanan-dinas/${item.idPerjalanan}`)}
        >
        Lihat
        </button>
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas"},
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Daftar Perjalanan Dinas
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <input
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition"
          id="search"
          name="search"
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari perjalanan..."
        />

        <button
          className="cursor-pointer  px-5 py-2 bg-linear-to-r bg-black text-white font-medium rounded-lg shadow"
          onClick={() => router.push(`${pathname}/add`)}
        >
          + Tambah Perjalanan Dinas
        </button>
      </div>

      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>

    </PageBase>
  );
}