"use client";
import { DataTables, Breadcrumb } from "@/components/elements";
import PageBase  from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { usePegawai, useDeletePegawai } from "@/hooks/useData";
import { LoadingOverlay, InfoModal } from "@/components/elements";

export default function DaftarPegawai() {
  const router = useRouter();
  const pathname = usePathname();
  const [ search, setSearch ] = useState("");
  const [ showEdit, setShowEdit ] = useState(false);
  const [ deleted, setDeleted ] = useState(null);
  const [ showDelete, setShowDelete ] = useState(false);
  const { data, isLoading, fetch } = usePegawai({ params: { search: search }});
  const { deletePegawai, loading } = useDeletePegawai();
  const headCells = [
    { id: 'nama', label: 'Nama Pegawai', numeric: false, width: 250 },
    { id: 'nip', label: 'NIP', numeric: false },
    { id: 'pangkatGol', label: 'Pangkat / Gol', numeric: false, width: 150 },
    { id: 'jabatan', label: 'Jabatan', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const handleDelete = async () => {
    try {
      await deletePegawai({
        nip: deleted,
      });
      setDeleted(null);
      setShowDelete(true);
      await fetch();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formattedData = (data ?? [])?.map(item => ({
    ...item,
    pangkatGol: `${item.pangkat} / ${item.gol}`,
    aksi: (
      <div className="flex gap-2">
        <button
          className="rounded cursor-pointer text-white bg-primary p-2"
          onClick={() => setShowEdit(item.nip)}
        >
          Ubah
        </button>
        <button
          className="rounded cursor-pointer text-white bg-danger p-2"
          onClick={() => setDeleted(item.nip)}
        >
          Hapus
        </button>
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Pegawai"},
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Daftar Pegawai
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
          + Tambah Pegawai
        </button>
      </div>
      <InfoModal show={deleted} onConfirm={handleDelete} onCancel={() => setDeleted(false)}>
        <p>Apakah kamu yakin ingin menghapus pegawai ini?</p>
      </InfoModal>
      <InfoModal show={showDelete} onCancel={() => setShowDelete(false)}>
        <p>Pegawai berhasil dihapus</p>
      </InfoModal>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}