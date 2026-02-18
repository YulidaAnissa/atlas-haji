"use client";
import PageBase  from "@/components/pagebase";
import { DataTables, Breadcrumb, FormModal, PrintButton } from "@/components/elements";
import { useParams } from "next/navigation";
import { useUpdateLaporan, useLaporan, usePerjalanan } from "@/hooks/useData";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { useState } from "react";
import { useLoading } from "@/hooks";
import LaporanPerjalanan from "@/components/forms/LaporanPerjalanan";
import { FaEdit, FaPlusCircle  } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function Component() {
  const params = useParams();
  const [ showLaporan, setShowLaporan ] = useState(false);
  const [ laporan, setLaporan ] = useState({});
  const { id } = params;
  const [loading, startLoading, endLoading] = useLoading();
  const { data, isLoading, fetch } = useLaporan({
    urlParams: { id }
  });

  const { updateLaporan } = useUpdateLaporan();
  
  const { data: pegawai } = usePerjalanan({
    urlParams: { id }
  });

  const handleLaporanPerjalanan = async (values) => {
    const idPerjalananPegawai = values?.pegawai;
    try {
      startLoading();
      const payload = {
        hasil: values?.hasil
      };
      await updateLaporan(idPerjalananPegawai, payload);
      await fetch();
      setShowLaporan(false);
    } catch (err) {
      return err;
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

  const handleFormLaporan = (type) => {
    setShowLaporan(true);
    setLaporan(type);
  };

  console.log("data ", data);
  const formattedData = (data?.pegawai ?? [])?.map(item => ({
    ...item,
    aksi: (
      <div className="flex gap-2">
        <PrintButton
          data={{
            nama: item?.nama,
            nip: item?.nip,
            tglBerangkat: formatDate(data?.perjalanan?.tglBerangkat, "DD MMMM YYYY"),
            tglKembali: formatDate(data?.perjalanan?.tglKembali, "DD MMMM YYYY"),
            kabkota: data?.perjalanan?.kabkota,
            kegiatan: data?.perjalanan?.kegiatan,
            hasil: item?.hasil,
            lama: calculateTripDuration(data?.perjalanan?.tglBerangkat, data?.perjalanan?.tglKembali)
          }}
          format="/laporan-format.docx"
          file={`laporan-${item.nip}`}
        />
      </div>
    )
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Laporan Perjalanan Dinas", href: "/laporan-perjalanan" },
    { label: data?.perjalanan?.kegiatan }
  ];

  return (
    <PageBase className="p-16 mx-auto">
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Detail Laporan Perjalanan Dinas
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
              <p className="text-sm text-gray-600">{data?.perjalanan?.kegiatan}</p>
            </li>
          </ol>
        </div>
        <div className="mb-6 flex flex-row md:flex-col md:items-center m-auto gap-4">
          <button
            className="flex w-full cursor-pointer px-5 py-2 bg-linear-to-r bg-black text-white font-medium rounded-lg shadow"
            onClick={() => handleFormLaporan("add")}
          >
            <FaPlusCircle className="my-auto w-4 h-4 mr-1"/>
            Buat Laporan
          </button>
        </div>
      </div>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <FormModal className="w-xl" icon={<FaEdit className="text-white w-6 h-6" />} show={showLaporan}>
        <LaporanPerjalanan 
          data={data?.perjalanan}
          pegawai={pegawai?.pegawai}
          onSubmit={handleLaporanPerjalanan}
          onClose={() => setShowLaporan(false)}
          type={laporan}
        />
      </FormModal>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
