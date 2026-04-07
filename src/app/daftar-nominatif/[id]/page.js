"use client";
import PageBase  from "@/components/pagebase";
import { DataTables, Breadcrumb, DaftarNominatif, PrintButton, Snackbar, VerifBiayaPerjalanan } from "@/components/elements";
import { useParams } from "next/navigation";
import { useSuratTugas, useUpdateLaporan } from "@/hooks/useData";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { useState, useEffect } from "react";
import { useLoading } from "@/hooks";
import FormModal from "@/components/elements/FormModal";
import AddBiayaPerjalanan from "@/components/forms/AddBiayaPerjalanan";
import { FaEdit } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { form } from "@heroui/react";

async function toBase64(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return "data:image/jpeg;base64," + base64;
}

export default function Component() {
  const params = useParams();
  const [ showBiayaPerjalanan, setShowBiayaPerjalanan ] = useState({ show: false, data: null });
  const [ showVerifBiayaPerjalanan, setShowVerifBiayaPerjalanan ] = useState({ show: false, data: null });
  const [ showSnackbar, setShowSnackbar ] = useState({ show: false, message: "", type: "" });
  const [dataFile, setDataFile] = useState([]);
  const { id } = params;
  const [loading, startLoading, endLoading] = useLoading();
  const { data, isLoading, fetch } = useSuratTugas({
    urlParams: { id }
  });

  const { updateLaporan } = useUpdateLaporan();

  const headCells = [
    { id: 'nip', label: 'NIP', numeric: false },
    { id: 'nama', label: 'Nama Pegawai', numeric: false },
    { id: 'kabkota', label: 'Tujuan', numeric: false },
    { id: 'status', label: 'Status', numeric: false },
    { id: 'aksi', label: '', numeric: false },
  ];

  const uhCount = (uh, berangkat, kembali) => {
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

  useEffect(() => {
    const processData = async () => {
      if (!data?.pegawai) return;

      const result = await Promise.all(
        data.pegawai.map(async (item, index) => {
          const buktiTransBase64 = item.buktiTrans
            ? await toBase64(item.buktiTrans)
            : null;
          const buktiPengBase64 = item.buktiPeng
            ? await toBase64(item.buktiPeng)
            : null;

          return {
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
            jumlahTotal: totalCount(
              uhCount(item.uh, item.tglBerangkat, item.tglKembali),
              item.biayaTrans,
              item.biayaPeng
            ),
            image: buktiTransBase64,
            buktiPeng: buktiPengBase64,
          };
        })
      );

      setDataFile(result);
    };

    processData();
  }, [data]);

  const dataFilePegawai = data?.pegawai?.map((item, index) => ({
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
    jumlahTotal: totalCount(uhCount(item.uh, item.tglBerangkat, item.tglKembali), item.biayaTrans, item.biayaPeng),
    image: item.buktiTrans,
    buktiPeng: item.buktiPeng,
  }));

  const formattedData = (data?.pegawai ?? [])?.map(item => ({
    ...item,
    aksi: (
      <div className="flex gap-3">
        <PrintButton
          data={dataFilePegawai.find(p => p.nama === item.nama) || {}}
          format="/spd-rampung-kwitansi-format.docx"
          file={`spd-rampung-kwitansi-format-${item.nip}`}
        />
        {item?.status !== "verified" && (<button
          onClick={() => {
            setShowBiayaPerjalanan({ show: true, data: item.idPerjalananPegawai });
          }}
          className="rounded bg-blue-600 cursor-pointer text-white p-2"
        >
          Biaya
        </button>)}
      </div>
    ),
    status: (
      <span
        className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
          item.status === "verifikasi"
            ? "bg-green-100 text-green-800 border border-green-300"
            : item.status === "tolak"
            ? "bg-red-100 text-red-800 border border-red-300"
            : "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
        onClick={() => {
          if (item.status === "pengajuan") {
            setShowVerifBiayaPerjalanan({ show: true, data: item.idPerjalananPegawai });
          }
        }}
      >
        {item?.status === "verifikasi"
          ? "Verified"
          : item?.status === "tolak"
          ? "Rejected"
          : "Pending"}
      </span>
  ),

  }));

  const handleBiayaPerjalanan = async (values) => {
    const idPerjalananPegawai = showBiayaPerjalanan?.data;
    try {
      startLoading();
      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng);
      formData.append("biayaTrans", values?.biayaTrans);
      formData.append("buktiPeng", values?.buktiPeng); // file object
      formData.append("buktiTrans", values?.buktiTrans); // file object
      formData.append("status", "pengajuan");
      await updateLaporan(idPerjalananPegawai, formData);
      await fetch();
      setShowBiayaPerjalanan({ show: false, data: null });
      setShowSnackbar({ show: true, message: "Biaya perjalanan berhasil disimpan", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal menyimpan biaya perjalanan", type: "error" });
      return err;
    } finally {
      endLoading();
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Biaya Perjalanan", href: "/daftar-nominatif" },
    { label: data?.surat?.noSurat}
  ];

  const handleConfirmBiaya = async (aksi, catatan = null) => {
    const idPerjalananPegawai = showVerifBiayaPerjalanan?.data;
    try {
      startLoading();
      await updateLaporan(idPerjalananPegawai, { status: aksi, catatan });
      await fetch();
      setShowVerifBiayaPerjalanan({ show: false, data: null });
      setShowSnackbar({ show: true, message: "Biaya perjalanan berhasil diverifikasi", type: "success" });
    } catch (err) {
      setShowSnackbar({ show: true, message: "Gagal memverifikasi biaya perjalanan", type: "error" });
      return err;
    } finally {
      endLoading();
    }
  };

  return (
    <PageBase className="p-16 mx-auto">
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Detail Biaya Perjalanan
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
      <FormModal className="w-xl" icon={<FaEdit className="text-white w-6 h-6" />} show={showVerifBiayaPerjalanan?.show}>
        <VerifBiayaPerjalanan
          data={showVerifBiayaPerjalanan?.data ? data?.pegawai?.find(p => p.idPerjalananPegawai === showVerifBiayaPerjalanan.data) : {}} 
          onSubmit={handleConfirmBiaya}
          onClose={() => setShowVerifBiayaPerjalanan({ show: false, data: null })}
        />
      </FormModal>
      <Snackbar show={showSnackbar?.show} type={showSnackbar?.type} message={showSnackbar?.message} onClose={() => setShowSnackbar({ show: false, message: "", type: "" })}/>
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
