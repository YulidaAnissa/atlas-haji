"use client";
import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase  from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSuratTugas } from "@/hooks/useData";
import { formatDate } from "@/utils/date";

export default function DaftarPerjalananDinas() {
  const router = useRouter();
  const [ search, setSearch ] = useState("");
  const { data, isLoading } = useSuratTugas({ params: { search: search}});

  const headCells = [
    { id: 'noSurat', label: 'Nomor Surat', numeric: false },
    { id: 'tglSurat', label: 'Tanggal Surat', numeric: false },
    { id: 'kegiatan', label: 'Kegiatan/Perihal', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const formattedData = (data ?? [])?.map(item => ({
    ...item,
    tglSurat: item.tglSurat ? formatDate(item.tglSurat) : "",
    aksi: (
      <div className="flex gap-2">
        <button
          className="py-2 px-4 rounded bg-primary cursor-pointer text-white"
          onClick={() => {
            router.push(`/daftar-nominatif/${item.idSurat}`);
          }}
        >
        Lihat
        </button>
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Biaya Perjalanan"},
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Biaya Perjalanan
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
          placeholder="🔍 Cari surat tugas..."
        />
      </div>

      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>

    </PageBase>
  );
}