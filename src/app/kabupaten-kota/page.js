"use client";
import { DataTables, Breadcrumb, FormModal, Snackbar } from "@/components/elements";
import PageBase  from "@/components/pagebase";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteKabKota, useEditKabKota, useKabKota } from "@/hooks/useData";
import { LoadingOverlay, InfoModal } from "@/components/elements";
import AddKabKotaForm from "@/components/forms/AddKabKota";
import { FaEdit  } from "react-icons/fa";
import { TbExclamationMark } from "react-icons/tb";
import TooltipInfo from "@/components/elements/TooltipInfo";
import { formatRupiah } from "@/utils/currency";

export default function DaftarKabupatenKota() {
  const router = useRouter();
  const pathname = usePathname();
  const [ search, setSearch ] = useState("");
  const [ showEdit, setShowEdit ] = useState(null);
  const [ deleted, setDeleted ] = useState(null);
  const [ showSnackbar, setShowSnackbar ] = useState({ show: false, message: "", type: "" });
  const { data, isLoading, fetch } = useKabKota({ params: { search: search }});
  const { deleteKabKota, loading } = useDeleteKabKota();
  const { editKabKota, loading: loadingEdit } = useEditKabKota();
  const headCells = [
    { id: 'kabkota', label: 'Kabupaten / Kota', numeric: false, width: 250 },
    { id: 'uh', label: 'Uang Harian', numeric: false, width: 150 },
    { id: 'alamat', label: 'Alamat', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const handleDelete = async () => {
    try {
      await deleteKabKota({
        id: deleted,
      });
      setDeleted(null);
      setShowSnackbar({ show: true, message: "Kabupaten / Kota berhasil dihapus", type: "success" });
      await fetch();
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal menghapus kabupaten / kota", type: "error" });
      console.error("Error:", err);
    }
  };

  const handleUpdateKabKota = async (values) => {
    try {
      const payload = {
        ...(values.kabkota && { kabkota: values.kabkota }),
        ...(values.uh && { uh: values.uh }),
        ...(values.alamat && { alamat: values.alamat }),
      };
      
      await editKabKota(payload, showEdit?.data?.idKabKota);
      await fetch();
      setShowEdit({ show: false, data: null });
      setShowSnackbar({ show: true, message: "Kabupaten / Kota berhasil diubah", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal mengubah kabupaten / kota", type: "error" });
      throw err;
    }
  };

  const formattedData = (data ?? [])?.map(item => ({
    ...item,
    uh: formatRupiah(item.uh),
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
          onClick={() => setDeleted(item.idKabKota)}
        >
          Hapus
        </button>
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Kabupaten / Kota" },
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Daftar Kabupaten / Kota
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
          + Tambah Kabupaten / Kota
        </button>
      </div>
      <InfoModal show={deleted} onConfirm={handleDelete} onCancel={() => setDeleted(false)}>
        <p>Apakah kamu yakin ingin menghapus kabupaten / kota ini?</p>
      </InfoModal>
      <FormModal icon={<FaEdit className="text-white w-6 h-6" />} show={showEdit?.show}>
        <AddKabKotaForm 
          data={showEdit?.data}
          onSubmit={handleUpdateKabKota} onClose={() => setShowEdit({ show: false, data: null })}
          type="edit"
        />
      </FormModal>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <Snackbar show={showSnackbar?.show} type={showSnackbar?.type} message={showSnackbar?.message} onClose={() => setShowSnackbar({ show: false, message: "" })}/>
      <LoadingOverlay show={loadingEdit || loading}/>
    </PageBase>
  );
}