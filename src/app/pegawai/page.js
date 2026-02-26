"use client";
import { DataTables, Breadcrumb, FormModal } from "@/components/elements";
import PageBase  from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { usePegawai, useDeletePegawai, useEditPegawai } from "@/hooks/useData";
import { LoadingOverlay, InfoModal } from "@/components/elements";
import AddPegawaiForm from "@/components/forms/AddPegawai";
import { FaEdit  } from "react-icons/fa";
import { TbExclamationMark } from "react-icons/tb";

export default function DaftarPegawai() {
  const router = useRouter();
  const pathname = usePathname();
  const [ search, setSearch ] = useState("");
  const [ showEdit, setShowEdit ] = useState(null);
  const [ deleted, setDeleted ] = useState(null);
  const [ showInfo, setShowInfo ] = useState(null);
  const { data, isLoading, fetch } = usePegawai({ params: { search: search }});
  const { deletePegawai, loading } = useDeletePegawai();
  const { editPegawai, loading: loadingEdit } = useEditPegawai();
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
      setShowInfo({ show: true, message: "Pegawai berhasil dihapus" });
      await fetch();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleUpdatePegawai = async (values) => {
    try {
      const payload = {
        ...(values.nama && { nama: values.nama }),
        ...(values.nip && { nip: values.nip }),
        ...(values.pangkat && { pangkat: values.pangkat }),
        ...(values.gol && { gol: values.gol }),
        ...(values.jabatan && { jabatan: values.jabatan }),
      };
      
      await editPegawai(payload);
      await fetch();
      setShowEdit({ show: false, data: null });
      setShowInfo({ show: true, message: "Pegawai berhasil diubah" });
    } catch (err) {
      return err;
    }
  };

  const formattedData = (data ?? [])?.map(item => ({
    ...item,
    pangkatGol: `${item.pangkat} / ${item.gol}`,
    aksi: (
      <div className="flex gap-2">
        <button
          className="rounded cursor-pointer text-white bg-primary p-2"
          onClick={() => setShowEdit({ show: true, data: item })}
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
      <InfoModal show={showInfo?.show} onCancel={() => setShowInfo(null)} icon={<TbExclamationMark className="text-white w-6 h-6"/>}>
        <p>{showInfo?.message}</p>
      </InfoModal>
      <FormModal icon={<FaEdit className="text-white w-6 h-6" />} show={showEdit?.show}>
        <AddPegawaiForm 
          data={showEdit?.data}
          onSubmit={handleUpdatePegawai} onClose={() => setShowEdit({ show: false, data: null })}
          type="edit"
        />
      </FormModal>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <LoadingOverlay show={loadingEdit || loading}/>
    </PageBase>
  );
}