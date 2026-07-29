"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiEye, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  DaftarNominatif,
  PrintButton,
  Snackbar,
  VerifBiayaPerjalanan,
  StatusBadge,
  DaftarNominatifAjuan,
} from "@/components/elements";
import FormModal from "@/components/elements/FormModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import ConfirmPembayaran from "@/components/forms/KonfirmPembayaran";
import { useSuratTugas, useUpdateLaporan, useEditSuratTugas, useKabKota, useNominatifAjuan } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { calculateTripDuration, formatDate, formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";
import { terbilang } from "@/utils/currency";
import { capitalize, toUpperCase } from "@/utils/string";
import { calculateUangHarianPerHari } from "@/utils/calculatorsUh";

export default function Component() {
  const { id } = useParams();

  const [showVerifBiayaPerjalanan, setShowVerifBiayaPerjalanan] = useState({
    show: false,
    data: null,
  });
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [profil, setProfil] = useState(null);

  const [loading, startLoading, endLoading] = useLoading();

  const { data, isLoading, fetch } = useSuratTugas({
    urlParams: { id },
  });

  const { data: nominatifData, isLoading: loadingNominatif } = useNominatifAjuan({
    urlParams: { id }
  });

  const { updateLaporan } = useUpdateLaporan();
  const { editSuratTugas } = useEditSuratTugas();
  const { data: dataKabKota } = useKabKota();

  useEffect(() => {
    setProfil(profileStorage.get());
  }, []);

  const formatRupiah = (angka) => {
    if (!angka) return 0;
    return Number(angka).toLocaleString("id-ID");
  };

  const uhCount = (uh, berangkat, kembali) => {
    const duration = calculateTripDuration(berangkat, kembali, false, false);
    return duration * uh;
  };

  const totalCount = (uh, biayaTrans, biayaPeng, biayaRep = 0) => {
    return (Number(uh) || 0) + (Number(biayaTrans) || 0) + (Number(biayaPeng) || 0) + (Number(biayaRep) || 0);
  };

  const dataFilePegawai = data?.pegawai?.map((item, index) => {
    const uhPerHari = calculateUangHarianPerHari(item, data?.surat, dataKabKota);

    const isKhusus = item.typePerjalanan === "khusus";
    const uhValue = isKhusus ? 0 : uhPerHari;
    const totalUangHarian = uhCount(uhValue, item.tglBerangkat, item.tglKembali);
    
    let biayaRepVal = 0;
    const isKepalaKantor = item.jabatan?.toLowerCase().includes("kepala kantor");
    if (isKepalaKantor) {
      const durasiHari = calculateTripDuration(item.tglBerangkat, item.tglKembali, false, false);
      biayaRepVal = durasiHari * 150000;
    }

    const jumlahTotal = totalCount(
      totalUangHarian,
      item.biayaTrans,
      item.biayaPeng,
      biayaRepVal
    );

    return {
      idx: index + 1,
      nama: item.nama,
      nip: item.jenisPegawai === "PNS" || item.jenisPegawai === "PPPK" ? item.nip : "-",
      kegiatan: data?.surat?.kegiatan,
      tujuan: Array.isArray(item.tujuan) ? item.tujuan.join(', ') : item.tujuan,
      tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
      tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
      lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
      uh: formatRupiah(uhValue),
      uhTotal: formatRupiah(totalUangHarian),
      biayaTrans: formatRupiah(item.biayaTrans),
      biayaPeng: formatRupiah(item.biayaPeng),
      jumlahTotal: formatRupiah(jumlahTotal),
      image: item.buktiTrans,
      buktiPeng: item.buktiPeng,
      nipPpk: data?.surat?.nipPpk || "",
      namaPpk: data?.surat?.namaPpk || "",
      trans: Number(item.biayaTrans || 0) === 0 ? "" : "- Transport",
      peng: Number(item.biayaPeng || 0) === 0 ? "" : "- Penginapan",
      repre: Number(biayaRepVal) === 0 ? "" : "- Representatif",
      isRepre: isKepalaKantor ? "Rp" : "",
      biayaRepre: isKepalaKantor ? formatRupiah(biayaRepVal) + ",-" : "",
      terbilang: `${capitalize(terbilang(jumlahTotal))} Rupiah`,
      namaKantor: data?.surat?.namaKantor || " ",
      alamat: data?.surat?.alamat || " ",
      asal: item.kabkota,
      unitKantor: data?.surat?.unitKantor || " ",
      unitKantorCapital: toUpperCase(data?.surat?.unitKantor),
      nipBendahara: String(data?.surat?.anggaran || "").toLowerCase() === "dipa" 
        ? data?.surat?.nipDipa 
        : data?.surat?.nipPkoh,

      namaBendahara: String(data?.surat?.anggaran || "").toLowerCase() === "dipa" 
        ? data?.surat?.namaDipa 
        : data?.surat?.namaPkoh
    };
  });

  const handleConfirmBiaya = async (aksi, catatan = null) => {
    const idPerjalananPegawai = showVerifBiayaPerjalanan?.data;

    try {
      startLoading();
      await updateLaporan(idPerjalananPegawai, { status: aksi, catatan });
      await fetch();

      setShowVerifBiayaPerjalanan({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: `Biaya perjalanan berhasil ${aksi === "verifikasi" ? "diverifikasi" : "ditolak"}`,
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal memverifikasi biaya perjalanan",
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const headCells = [
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "tujuan", label: "Tujuan", numeric: false },
    { id: "tanggal", label: "Tanggal", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "aksi", label: "", numeric: false, align: "right" },
  ];

  const formattedData = (data?.pegawai ?? []).map((item) => {
    const canVerify = item.status === "pengajuan" && profil?.role === "finance";
    const isPerjalananKhusus = String(item?.typePerjalanan ?? "").trim().toLowerCase() === "khusus";
    return {
      ...item,
      nama: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900">{item.nama}</span>
          {item.nip && <span className="text-xs text-gray-500 font-mono">{item.nip}</span>}
          {isPerjalananKhusus && (
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Perjalanan Khusus
            </span>
          )}
        </div>
      ),
      tanggal: formatRangeDate(item.tglBerangkat, item.tglKembali, "DD MMM YYYY"),
      status: <StatusBadge status={item.status} canVerify={canVerify} />,
      aksi: (
        <div className="flex justify-end gap-2">
          {item?.status !== "verifikasi" ? (
            canVerify && (
              <button
                type="button"
                onClick={() =>
                  setShowVerifBiayaPerjalanan({
                    show: true,
                    data: item.idPerjalananPegawai,
                  })
                }
                className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#eadfbe] bg-white px-4 text-sm font-bold text-brand shadow-sm transition hover:border-brand hover:bg-brand hover:text-white focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiEye className="h-4 w-4 transition group-hover:-translate-y-0.5" />
              </button>
            )
          ) : (
            <div title={!data?.surat?.anggaran ? "Anggaran belum ditentukan" : "Cetak Dokumen"}>
              <PrintButton
                data={dataFilePegawai?.find((p) => p.nama === item.nama) || {}}
                format="/spd-rampung-kwitansi-format.docx"
                file={`spd-rampung-kwitansi-format-${item.nip}`}
                disabled={!data?.surat?.anggaran}
              />
            </div>
          )}
        </div>
      ),
    };
  });

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Biaya Perjalanan", href: "/daftar-nominatif" },
    { label: data?.surat?.noSurat || "Detail" },
  ];

  const handleTglPembayaran = async (values) => {
    try {
      startLoading();
      const formData = new FormData();

      if (values.anggaran?.value) {
        formData.append("anggaran", values.anggaran.value);
      }
      if (values.tglPengajuanKppn) {
        formData.append("tglKPPN", formatDate(values.tglPengajuanKppn, "YYYY-MM-DD"));
      }
      if (values.tglPembayaran) {
        formData.append("tglPembayaran", formatDate(values.tglPembayaran, "YYYY-MM-DD"));
      }
      if (values.buktiPembayaran) {
        formData.append("buktiPembayaran", values.buktiPembayaran);
      }

      await editSuratTugas({ idSurat: id, values: formData });
      await fetch();

      setShowSnackbar({
        show: true,
        message: "Berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menyimpan",
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const pegawaiVerifikasi = String(profil?.role || "").trim().toLowerCase() === "finance";

  // Statistik ringkas
  const totalPegawai = data?.pegawai?.length ?? 0;
  const totalVerifikasi = data?.pegawai?.filter(p => p.status === "verifikasi" || p.status === "selesai").length ?? 0;
  const totalPengajuan = data?.pegawai?.filter(p => p.status === "pengajuan").length ?? 0;

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={breadcrumbItem} />

      {/* Header Elegan */}
      <header className="mb-8 mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-gray-200/80 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 border border-blue-100/50">
            Biaya Perjalanan
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
            Detail Biaya Perjalanan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            Kelola pengajuan biaya, verifikasi bukti pendukung, dan cetak daftar nominatif perjalanan dinas secara terpusat.
          </p>
        </div>

        {totalPegawai > 0 && data?.pegawai?.every((item) => item.status === "verifikasi" || item.status === "selesai") && data?.surat?.anggaran && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow">
              <IoDocumentTextOutline className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
              <DaftarNominatifAjuan data={nominatifData} surat={data?.surat} kabKota={dataKabKota} />
            </div>
            <div className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand/90 hover:shadow-lg">
              <IoDocumentTextOutline className="h-4 w-4 mr-2 shrink-0 text-white" />
              <DaftarNominatif data={data} kabKota={dataKabKota} />
            </div>
          </div>
        )}
      </header>

      {/* Statistik Ringkas */}
      {totalPegawai > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Pegawai</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{totalPegawai}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sudah Terverifikasi</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{totalVerifikasi}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Menunggu Pengajuan</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">{totalPengajuan}</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmPembayaran data={data} canVerify={pegawaiVerifikasi} onSubmit={handleTglPembayaran} />

      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm mt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Pegawai</h2>
            <p className="mt-1 text-sm text-gray-500">
              Tambahkan biaya perjalanan atau cetak kwitansi untuk pegawai yang sudah terverifikasi.
            </p>
          </div>
        </div>

        <DataTables
          headCells={headCells}
          data={formattedData}
          loading={isLoading}
        />
      </section>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showVerifBiayaPerjalanan?.show}
      >
        <VerifBiayaPerjalanan
          data={
            showVerifBiayaPerjalanan?.data
              ? data?.pegawai?.find((p) => p.idPerjalananPegawai === showVerifBiayaPerjalanan.data)
              : {}
          }
          onSubmit={handleConfirmBiaya}
          onClose={() => setShowVerifBiayaPerjalanan({ show: false, data: null })}
          surat={data?.surat}
        />
      </FormModal>

      <Snackbar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.message}
        onClose={() => setShowSnackbar({ show: false, message: "", type: "" })}
      />

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}