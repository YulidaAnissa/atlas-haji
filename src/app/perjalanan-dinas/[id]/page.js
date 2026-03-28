"use client";
import PageBase  from "@/components/pagebase";
import { DataTables, Breadcrumb, InfoModal, FormModal, Snackbar } from "@/components/elements";
import { useParams } from "next/navigation";
import { usePegawai, useUpdatePerjalanan, useKabKota, usePerjalanan, useDeletePerjalananPegawai, useAddPegawaiPerjalanan, useSuratTugas } from "@/hooks/useData";
import { calculateTripDuration, formatDate } from "@/utils/date";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddPegawaiPerjalanan from "@/components/forms/AddPegawaiPerjalanan";
import UpdatePerjalanan from "@/components/forms/UpdatePerjalanan";
import AddSuratTugas from "@/components/forms/AddSuratTugas";
import PrintButton from "@/components/elements/PrintButton";
import { FaEdit, FaPlusCircle  } from "react-icons/fa";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const [ deleted, setDeleted ] = useState();
  const [ showAddPegawai, setShowAddPegawai ] = useState(false);
  const [ showAddST, setShowAddST ] = useState(false);
  const [ showUpdatePerjalanan, setShowUpdatePerjalanan ] = useState(false);
  const [ showSnackbar, setShowSnackbar ] = useState({ show: false, message: "", type: "" });
  const { id } = params;
  const { data, isLoading, fetch } = usePerjalanan({
    urlParams: { id }
  });
  const { data: pejabat } = usePegawai({ params: { status: "pejabat" }});
  const { data: pegawai } = usePegawai();
  const { data: kabkota } = useKabKota();
  const { data: suratTugas } = useSuratTugas();
  const { postPegawai } = useAddPegawaiPerjalanan();
  const { deletePerjalananPegawai } = useDeletePerjalananPegawai();
  const { updatePerjalanan } = useUpdatePerjalanan();
  const [loading, startLoading, endLoading] = useLoading();
  
  const pegawaiTanpaPerjalanan = pegawai?.filter(
    (p) => !data?.pegawai?.some((pp) => pp.nip === p.nip)
  );

  console.log('data ', data);

  const handleUpdatePerjalanan = async (values) => {
    try {
      startLoading();
      const perjalananPayload = {
        ...(values.nip && { nip: values.nip }),
        ...(values.dateRange?.formattedStart && { tglBerangkat: values.dateRange.formattedStart }),
        ...(values.dateRange?.formattedEnd && { tglKembali: values.dateRange.formattedEnd }),
        ...(values.tujuan && { idKabKota: values.tujuan }),
      };

      // Surat
      const suratPayload = {
        ...(values.idSurat && { idSurat: values.idSurat }),
        ...(values.noSurat && { noSurat: values.noSurat }),
        ...(values.tglSurat && { tglSurat: formatDate(values.tglSurat, "YYYY-MM-DD")}),
        ...(values.kegiatan && { kegiatan: values.kegiatan })
      };

      // Gabungkan sesuai kondisi
      const payload = {
        ...perjalananPayload,
        ...suratPayload
      };

      if (Object.keys(payload).length === 0) {
        throw new Error("Tidak ada data untuk update");
      }

      await updatePerjalanan(id, payload);
      await fetch();
      setShowUpdatePerjalanan(false);
      setShowAddST(false);
      setShowSnackbar({ show: true, message: "Berhasil disimpan", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal disimpan", type: "error" });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleAddPegawai = async (values) => {
    try {
      startLoading();
      const payload = {
        pegawai: [values.pegawai],
        idPerjalanan: id
      };
      await postPegawai(payload);
      await fetch();
      setShowAddPegawai(false);
      setShowSnackbar({ show: true, message: "Pegawai berhasil ditambahkan", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal menambahkan pegawai", type: "error" });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleDelete = async () => {
    try {
      startLoading();
      const result = await deletePerjalananPegawai({
        idPerjalanan: id,
        nip: deleted,
      });
      setDeleted();
      if (result?.message?.includes("perjalanan otomatis terhapus")) {
        router.push("/perjalanan-dinas");
      } else {
        await fetch();
      }
      setShowSnackbar({ show: true, message: "Pegawai berhasil dihapus", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal menghapus pegawai", type: "error" });
      console.error("Error:", err);
    } finally {
      endLoading();
    }
  };

  const headCells = [
    { id: 'nip', label: 'NIP', numeric: false },
    { id: 'nama', label: 'Nama Pegawai', numeric: false },
    { id: 'gol', label: 'Gol', numeric: false },
    { id: 'jabatan', label: 'Jabatan', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const formattedData = (data?.pegawai ?? [])?.map(item => ({
    ...item,
    aksi: (
      <div className="flex gap-2">
        <button
          className="rounded cursor-pointer text-white bg-danger p-2"
          onClick={() => setDeleted(item.nip)}
        >
          Hapus
        </button>
        <PrintButton 
          data={{
            ...item,
            lama: calculateTripDuration(data?.perjalanan?.tglBerangkat, data?.perjalanan?.tglKembali),
            tglBerangkat: formatDate(data?.perjalanan?.tglBerangkat, "DD MMMM YYYY"),
            tglKembali: formatDate(data?.perjalanan?.tglKembali, "DD MMMM YYYY"),
            kabkota: data?.perjalanan?.kabkota,
            kegiatan: data?.perjalanan?.kegiatan,
            unit: data?.perjalanan?.unit,
            jabatanPPK: data?.perjalanan?.jabatan,
            nipPPK: data?.perjalanan?.nip,
            namaPPK: data?.perjalanan?.nama,
          }}
          format="/spd-format.docx"
          file={`spd-${item.nip}`}
        />
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas", href: "/perjalanan-dinas" },
    { label: data?.perjalanan?.kegiatan }
  ];

  return (
    <PageBase className="p-16 mx-auto">
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Detail Perjalanan Dinas
        </h1>
      </div>
      <div className="flex mb-6 gap-6 justify-between">
        <div className="tracking-widest leading-loose grid grid-cols-2 gap-16 min-w-3/4 bg-gray-50 rounded-xl shadow-lg p-6 space-y-6">
          <ol className="relative border-l border-indigo-300 space-y-6">
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Tanggal Berangkat</h3>
              <p className="text-sm text-gray-600">
                {formatDate(data?.perjalanan?.tglBerangkat)}
              </p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Tujuan</h3>
              <p className="text-sm text-gray-600">{data?.perjalanan?.kabkota}</p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">No Surat</h3>
              <p className="text-sm text-gray-600">{data?.perjalanan?.noSurat || "-"}</p>
            </li>
          </ol>
          <ol className="relative border-l border-indigo-300 space-y-6">
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Tanggal Kembali</h3>
              <p className="text-sm text-gray-600">{formatDate(data?.perjalanan?.tglKembali)}</p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Kegiatan</h3>
              <p className="text-sm text-gray-600">{data?.perjalanan?.kegiatan || "-"}</p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Tanggal Surat</h3>
              <p className="text-sm text-gray-600">{data?.perjalanan?.tglSurat ? formatDate(data?.perjalanan?.tglSurat) : "-"}</p>
            </li>
          </ol>
        </div>
        {/* Search */}
        <div className="mb-6 flex flex-row md:flex-col md:items-center m-auto gap-4">
          <button
            className="w-full cursor-pointer flex px-5 py-2 bg-linear-to-r bg-primary text-white font-medium rounded-lg shadow"
            onClick={() => setShowUpdatePerjalanan(true)}
          >
            <FaEdit className="my-auto w-4 h-4 mr-1"/>
            Ubah Perjalanan
          </button>
          <button
            className="flex w-full cursor-pointer px-5 py-2 bg-linear-to-r bg-black text-white font-medium rounded-lg shadow"
            onClick={() => setShowAddPegawai(true)}
          >
            <FaPlusCircle className="my-auto w-4 h-4 mr-1"/>
            Tambah Pegawai
          </button>
        </div>
      </div>
      <InfoModal show={deleted} onConfirm={handleDelete} onCancel={() => setDeleted(false)}>
        {data?.pegawai?.length === 1 ? (
          <p>
            Pegawai ini adalah pegawai terakhir dalam perjalanan. 
            Jika kamu tetap menghapus, perjalanan otomatis akan terhapus. 
            Apakah kamu yakin?
          </p>
        ) : (
          <p>Apakah kamu yakin ingin menghapus pegawai ini dari perjalanan?</p>
        )}
      </InfoModal>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <FormModal className="w-3xl" icon={<FaEdit className="text-white w-6 h-6" />} show={showUpdatePerjalanan}>
        <UpdatePerjalanan 
          data={data?.perjalanan}
          kabkota={kabkota} 
          onSubmit={handleUpdatePerjalanan}
          onClose={() => setShowUpdatePerjalanan(false)}
          st={suratTugas}
          pejabat={pejabat}
        />
      </FormModal>
      <FormModal icon={<FaPlusCircle className="text-white w-6 h-6" />} show={showAddPegawai}>
        <AddPegawaiPerjalanan onSubmit={handleAddPegawai} onClose={() => setShowAddPegawai(false)} pegawai={pegawaiTanpaPerjalanan}/>
      </FormModal>
      <Snackbar show={showSnackbar?.show} type={showSnackbar?.type} message={showSnackbar?.message} onClose={() => setShowSnackbar({ show: false, message: "", type: "" })}/>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
