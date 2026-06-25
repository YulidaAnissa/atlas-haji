"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  DaftarNominatif,
  PrintButton,
  Snackbar,
  VerifBiayaPerjalanan,
  StatusBadge,
} from "@/components/elements";
import FormModal from "@/components/elements/FormModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import ConfirmPembayaran from "@/components/forms/KonfirmPembayaran";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useSuratTugas, useUpdateLaporan, useEditSuratTugas } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { calculateTripDuration, formatDate, formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";
import { FiEye } from "react-icons/fi";
import { terbilang } from "@/utils/currency";
import { capitalize } from "@/utils/string";

export default function Component() {
  const { id } = useParams();

  console.log('id ', id);

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

  const { updateLaporan } = useUpdateLaporan();
  const { editSuratTugas, loading: loadingEdit } = useEditSuratTugas();

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

  const totalCount = (uh, biayaTrans, biayaPeng) => {
    return (Number(uh) || 0) + (Number(biayaTrans) || 0) + (Number(biayaPeng) || 0);
  };

  const dataFilePegawai = data?.pegawai?.map((item, index) => {
    const uh = item?.jenisPegawai === "ASN" ? 430000 : 250000;
    const isKhusus = item.typePerjalanan === "khusus";
    const uhValue = isKhusus ? 0 : uh;
    const jumlahTotal = totalCount(
      uhCount(uhValue, item.tglBerangkat, item.tglKembali),
      item.biayaTrans,
      item.biayaPeng
    );

    return {
      idx: index + 1,
      nama: item.nama,
      nip: item.nip,
      kegiatan: data?.surat?.kegiatan,
      tujuan: item.tujuan,
      tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
      lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
      uh: formatRupiah(uhValue),
      uhTotal: formatRupiah(
        uhCount(uhValue, item.tglBerangkat, item.tglKembali)
      ),
      biayaTrans: formatRupiah(item.biayaTrans),
      biayaPeng: formatRupiah(item.biayaPeng),
      jumlahTotal: formatRupiah(jumlahTotal),
      image: item.buktiTrans,
      buktiPeng: item.buktiPeng,
      nipPPK: item?.nipPPK,
      namaPPK: item?.namaPPK,
      unitPPK: item?.unitPPK,
      trans: Number(item.biayaTrans || 0) === 0 ? "" : "- Transportasi",
      peng: Number(item.biayaPeng || 0) === 0 ? "" : "- Penginapan",
      terbilang: `${capitalize(terbilang(jumlahTotal))} Rupiah`
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
    const isPerjalananKhusus =
      String(item?.typePerjalanan ?? "").trim().toLowerCase() === "khusus";
    return {
      ...item,
      nama: (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{item.nama}</span>
          {item.nip && (
            <span className="text-xs text-gray-500">{item.nip}</span>
          )}
          {isPerjalananKhusus && (
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Perjalanan Khusus
            </span>
          )}
        </div>
      ),
      tanggal: formatRangeDate(
        item.tglBerangkat,
        item.tglKembali,
        "DD MMM YYYY",
      ),
      status: (
        <StatusBadge
          status={item.status}
          canVerify={canVerify}
        />
      ),
      aksi: (
        <div className="flex justify-end gap-2">
          {item?.status !== "verifikasi" ? canVerify && (
            <button
              type="button"
              onClick={() =>
                setShowVerifBiayaPerjalanan({
                  show: true,
                  data: item.idPerjalananPegawai,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#fbf7ec] px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              <FiEye className="h-4 w-4" />
              Lihat
            </button>
          ) : (
            <PrintButton
              data={dataFilePegawai?.find((p) => p.nama === item.nama) || {}}
              format="/spd-rampung-kwitansi-format.docx"
              file={`spd-rampung-kwitansi-format-${item.nip}`}
            />
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
    console.log("values ", values);

    try {
      startLoading();

      const formData = new FormData();

      if (values.anggaran.value) {
        formData.append("anggaran", values.anggaran.value);
      }

      if (values.tglPengajuanKppn) {
        formData.append(
          "tglKPPN",
          formatDate(values.tglPengajuanKppn, "YYYY-MM-DD")
        );
      }

      if (values.tglPembayaran) {
        formData.append(
          "tglPembayaran",
          formatDate(values.tglPembayaran, "YYYY-MM-DD")
        );
      }

      if (values.buktiPembayaran) {
        formData.append("buktiPembayaran", values.buktiPembayaran);
      }

      await editSuratTugas({
        idSurat: id,
        values: formData,
      });

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

  const pegawaiVerifikasi =
    String(profil?.role || "").trim().toLowerCase() === "finance" &&
    (data?.pegawai?.length ?? 0) > 0 &&
    data?.pegawai?.every((item) => item.status === "verifikasi");

  console.log('data ', data);

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItem} />

      <header className="mb-8 mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Biaya Perjalanan
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Detail Biaya Perjalanan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola pengajuan biaya, verifikasi bukti pendukung, dan cetak daftar
            nominatif perjalanan dinas.
          </p>
        </div>
        {(data?.pegawai?.length ?? 0) > 0 &&
          data?.pegawai?.every((item) => item.status === "verifikasi" || item.status === "selesai") && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="inline-flex items-center gap-2 justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <IoDocumentTextOutline className="h-4 w-4" />
                <DaftarNominatif data={data} />
              </button>
            </div>
          )}

      </header>

      <ConfirmPembayaran data={data} canVerify={pegawaiVerifikasi} onSubmit={handleTglPembayaran} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pegawai
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan biaya perjalanan atau cetak kwitansi untuk pegawai yang
            sudah terverifikasi.
          </p>
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
              ? data?.pegawai?.find(
                  (p) =>
                    p.idPerjalananPegawai === showVerifBiayaPerjalanan.data
                )
              : {}
          }
          onSubmit={handleConfirmBiaya}
          onClose={() =>
            setShowVerifBiayaPerjalanan({ show: false, data: null })
          }
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