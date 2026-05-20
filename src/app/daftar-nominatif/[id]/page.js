"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit, FaMoneyBillWave } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  DaftarNominatif,
  PrintButton,
  Snackbar,
  VerifBiayaPerjalanan,
} from "@/components/elements";
import FormModal from "@/components/elements/FormModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import AddBiayaPerjalanan from "@/components/forms/AddBiayaPerjalanan";
import ConfirmPembayaran from "@/components/forms/KonfirmPembayaran";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useSuratTugas, useUpdateLaporan } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { calculateTripDuration, formatDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";
import { DatePicker } from "@/components/forms/FormField";
import { Field } from "react-final-form";


function StatusBadge({ status, canVerify, onClick }) {
  const variants = {
    verifikasi: {
      label: "Verified",
      className: "border-green-200 bg-green-50 text-green-700",
    },
    tolak: {
      label: "Rejected",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    default: {
      label: "Pending",
      className: "border-gray-200 bg-gray-50 text-gray-700",
    },
  };

  const current = variants[status] || variants.default;

  return (
    <button
      type="button"
      onClick={canVerify ? onClick : undefined}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
        current.className
      } ${canVerify ? "cursor-pointer hover:shadow-sm" : "cursor-default"}`}
    >
      {current.label}
    </button>
  );
}

export default function Component() {
  const { id } = useParams();

  const [showBiayaPerjalanan, setShowBiayaPerjalanan] = useState({
    show: false,
    data: null,
  });
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

  const dataFilePegawai = data?.pegawai?.map((item, index) => ({
    idx: index + 1,
    nama: item.nama,
    nip: item.nip,
    kegiatan: data?.surat?.kegiatan,
    tujuan: item.kabkota,
    tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
    lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
    uh: formatRupiah(item.uh),
    uhTotal: formatRupiah(uhCount(item.uh, item.tglBerangkat, item.tglKembali)),
    biayaTrans: formatRupiah(item.biayaTrans),
    biayaPeng: formatRupiah(item.biayaPeng),
    jumlahTotal: formatRupiah(
      totalCount(
        uhCount(item.uh, item.tglBerangkat, item.tglKembali),
        item.biayaTrans,
        item.biayaPeng
      )
    ),
    image: item.buktiTrans,
    buktiPeng: item.buktiPeng,
    nipPPK: item?.nipPPK,
    namaPPK: item?.namaPPK,
    unitPPK: item?.unitPPK,
    trans: Number(item.biayaTrans || 0) === 0 ? "" : "- Transportasi",
    peng: Number(item.biayaPeng || 0) === 0 ? "" : "- Penginapan",
  }));

  const handleBiayaPerjalanan = async (values) => {
    const idPerjalananPegawai = showBiayaPerjalanan?.data;

    try {
      startLoading();

      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng || "");
      formData.append("biayaTrans", values?.biayaTrans || "");
      if (values?.buktiPeng) formData.append("buktiPeng", values.buktiPeng);
      if (values?.buktiTrans) formData.append("buktiTrans", values.buktiTrans);
      formData.append("status", "pengajuan");

      await updateLaporan(idPerjalananPegawai, formData);
      await fetch();

      setShowBiayaPerjalanan({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Biaya perjalanan berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menyimpan biaya perjalanan",
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleConfirmBiaya = async (aksi, catatan = null) => {
    const idPerjalananPegawai = showVerifBiayaPerjalanan?.data;

    try {
      startLoading();

      await updateLaporan(idPerjalananPegawai, { status: aksi, catatan });
      await fetch();

      setShowVerifBiayaPerjalanan({ show: false, data: null });
      setShowSnackbar({
        show: true,
        message: "Biaya perjalanan berhasil diverifikasi",
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
    { id: "nip", label: "NIP", numeric: false },
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "kabkota", label: "Tujuan", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "aksi", label: "", numeric: false, align: "right" },
  ];

  const formattedData = (data?.pegawai ?? []).map((item) => {
    const canVerify = item.status === "pengajuan" && profil?.role === "finance";

    return {
      ...item,
      status: (
        <StatusBadge
          status={item.status}
          canVerify={canVerify}
          onClick={() =>
            setShowVerifBiayaPerjalanan({
              show: true,
              data: item.idPerjalananPegawai,
            })
          }
        />
      ),
      aksi: (
        <div className="flex justify-end gap-2">
          {item?.status !== "verifikasi" ? (
            <button
              type="button"
              onClick={() =>
                setShowBiayaPerjalanan({
                  show: true,
                  data: item.idPerjalananPegawai,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FaMoneyBillWave className="h-4 w-4" />
              Biaya
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

  const handleConfirmPembayaran = async (values) => {
    console.log('values ', values);
    // try {
    //   startLoading();

    //   const formData = new FormData();
    //   formData.append("tglPengajuanKppn", values.tglPengajuanKppn);

    //   await updateLaporan(id, formData);
    //   await fetch();

    //   setShowSnackbar({
    //     show: true,
    //     message: "Tanggal pengajuan ke KPPN berhasil disimpan",
    //     type: "success",
    //   });
    // } catch (err) {
    //   setShowSnackbar({
    //     show: true,
    //     message: "Gagal menyimpan tanggal pengajuan ke KPPN",
    //     type: "error",
    //   });
    //   return err;
    // } finally {
    //   endLoading();
    // }
  };

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

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-2 justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <IoDocumentTextOutline className="h-4 w-4" />
            <DaftarNominatif data={data} />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Bukti Pembayaran
          </button>
        </div>
      </header>

      <ConfirmPembayaran data={data} onSubmit={handleConfirmPembayaran} />

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
        className="w-xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showBiayaPerjalanan?.show}
      >
        <AddBiayaPerjalanan
          data={
            showBiayaPerjalanan?.data
              ? data?.pegawai?.find(
                  (p) => p.idPerjalananPegawai === showBiayaPerjalanan.data
                )
              : {}
          }
          onSubmit={handleBiayaPerjalanan}
          onClose={() => setShowBiayaPerjalanan({ show: false, data: null })}
        />
      </FormModal>

      <FormModal
        className="w-xl"
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