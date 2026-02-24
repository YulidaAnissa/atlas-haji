"use client";
import PageBase  from "@/components/pagebase";
import { DataTables, Breadcrumb, DaftarNominatif, PrintButton } from "@/components/elements";
import { useParams } from "next/navigation";
import { useSuratTugas, useUpdateLaporan } from "@/hooks/useData";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { useState } from "react";
import { useLoading } from "@/hooks";
import FormModal from "@/components/elements/FormModal";
import AddBiayaPerjalanan from "@/components/forms/AddBiayaPerjalanan";
import { FaEdit } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function Component() {
  const params = useParams();
  const [ showBiayaPerjalanan, setShowBiayaPerjalanan ] = useState({ show: false, data: null });
  const [ laporan, setLaporan ] = useState({});
  const { id } = params;
  const [loading, startLoading, endLoading] = useLoading();
  const { data, isLoading, fetch } = useSuratTugas({
    urlParams: { id }
  });

  const { updateLaporan } = useUpdateLaporan();

  const headCells = [
    { id: 'nip', label: 'NIP', numeric: false },
    { id: 'nama', label: 'Nama Pegawai', numeric: false },
    { id: 'gol', label: 'Gol', numeric: false },
    { id: 'jabatan', label: 'Jabatan', numeric: false },
    { id: 'kabkota', label: 'Tujuan', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const uhCount = (uh, berangkat, kembali) => {
    console.log(berangkat);
    const duration = calculateTripDuration(berangkat, kembali, false, false);
    return duration * uh;
  };

  const totalCount = (uh, biayaTrans, biayaPeng) => {
    // pastikan semuanya angka
    const u = Number(uh) || 0;
    const t = Number(biayaTrans) || 0;
    const p = Number(biayaPeng) || 0;

    return u + t + p;
  };

  const dataFile = data?.pegawai?.map((item, index) => ({
    idx: index + 1,
    nama: item.nama,
    nip: item.nip,
    kegiatan: item.kegiatan,
    tujuan: item.kabkota,
    lama: calculateTripDuration(item.tglBerangkat, item.tglKembali, true, true),
    uh: item.uh,
    uhTotal: uhCount(item.uh, item.tglBerangkat, item.tglKembali),
    biayaTrans: item.biayaTrans,
    biayaPeng: item.biayaPeng,
    jumlahTotal: totalCount(uhCount(item.uh, item.tglBerangkat, item.tglKembali), item.biayaTrans, item.biayaPeng)
  }));

  const formattedData = (data?.pegawai ?? [])?.map(item => ({
    ...item,
    aksi: (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowBiayaPerjalanan({ show: true, data: item.idPerjalananPegawai });
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Biaya
        </button>
        <PrintButton
          data={dataFile.find(p => p.nama === item.nama) || {}}
          format="/spd-rampung-kwitansi-format.docx"
          file={`spd-rampung-kwitansi-format-${item.nip}`}
        />
      </div>
    )
  }));

  console.log(showBiayaPerjalanan);
  const handleBiayaPerjalanan = async (values) => {
    const idPerjalananPegawai = showBiayaPerjalanan?.data;
    console.log(idPerjalananPegawai);
    try {
      startLoading();
      const payload = {
        biayaPeng: values?.biayaPeng,
        biayaTrans: values?.biayaTrans,
        buktiPeng: values?.buktiPeng,
        buktiTrans: values?.buktiTrans
      };
      await updateLaporan(idPerjalananPegawai, payload);
      await fetch();
      setShowBiayaPerjalanan({ show: false, data: null });
    } catch (err) {
      return err;
    } finally {
      endLoading();
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Nominatif", href: "/laporan-perjalanan" },
    { label: data?.surat?.noSurat}
  ];

  return (
    <PageBase className="p-16 mx-auto">
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Detail Daftar Nominatif
        </h1>
      </div>
      <div className="flex mb-6 gap-6 justify-between">
        <div className="tracking-widest leading-loose grid grid-cols-2 gap-16 min-w-3/4 bg-gray-50 rounded-xl shadow-lg p-6 space-y-6">
          <ol className="relative border-l border-indigo-300 space-y-6">
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Nomor Surat</h3>
              <p className="text-sm text-gray-600">{data?.surat?.noSurat}</p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Tanggal Surat</h3>
              <p className="text-sm text-gray-600">
                {formatDate(data?.surat?.tglSurat)}
              </p>
            </li>
            <li className="ml-6">
              <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
              <h3 className="font-semibold text-gray-900">Kegiatan</h3>
              <p className="text-sm text-gray-600">{data?.surat?.kegiatan}</p>
            </li>
          </ol>
        </div>
        <div className="mb-6 flex flex-row md:flex-col md:items-center m-auto gap-4">
          <DaftarNominatif data={data}/>
        </div>
      </div>
      <DataTables headCells={headCells} data={formattedData} loading={isLoading}/>
      <FormModal className="w-xl" icon={<FaEdit className="text-white w-6 h-6" />} show={showBiayaPerjalanan?.show}>
        <AddBiayaPerjalanan
          data={showBiayaPerjalanan?.data ? data?.pegawai?.find(p => p.idPerjalananPegawai === showBiayaPerjalanan.data) : {}} 
          onSubmit={handleBiayaPerjalanan}
          onClose={() => setShowBiayaPerjalanan({ show: false, data: null })}
        />
      </FormModal>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
