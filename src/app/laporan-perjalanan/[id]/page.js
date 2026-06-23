"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  FormModal,
  PrintButton,
  Snackbar,
  StatusBadge,
  VerifBiayaPerjalanan,
  InfoPerjalanan,
} from "@/components/elements";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import LaporanPerjalanan from "@/components/forms/LaporanPerjalanan";
import UpdateLaporanPerjalanan from "@/components/forms/UpdateLaporan";

import { useUpdateLaporan, useLaporan, useSuratTugas } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { formatDate, calculateTripDuration, formatRangeDate } from "@/utils/date";


export default function Component() {
  const params = useParams();
  const { id } = params;
  const EMPTY_MODAL = {
    show: false,
    data: null,
  };
  const [showLaporan, setShowLaporan] = useState(EMPTY_MODAL);
  const [showAddLaporan, setShowAddLaporan] = useState(false);
  const [showUpdateLaporan, setShowUpdateLaporan] = useState(EMPTY_MODAL);
  const [laporan, setLaporan] = useState({});
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  console.log('show update laporan', showUpdateLaporan);

  const [loading, startLoading, endLoading] = useLoading();

  const { data, isLoading, fetch } = useSuratTugas({
    urlParams: { id },
  });

  const { updateLaporan } = useUpdateLaporan();

  const handleLaporanPerjalanan = async (values) => {
    const idPerjalananPegawai = values?.pegawai?.value;
    try {
      startLoading();

      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng);
      formData.append("biayaTrans", values?.biayaTrans);
      formData.append("buktiPeng", values?.buktiPeng); // file object
      formData.append("buktiTrans", values?.buktiTrans); // file object
      formData.append("spd", values?.spd); // file object
      formData.append("status", "pengajuan");
      formData.append("hasil", values?.hasil);
      await updateLaporan(idPerjalananPegawai, formData);
      await fetch();
      setShowAddLaporan(false);
      setShowSnackbar({
        show: true,
        message: "Laporan berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menyimpan laporan",
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleFormLaporan = (type) => {
    setShowAddLaporan(true);
    setLaporan(type);

    console.log(type, "type laporan");
  };

  const handleUpdateLaporan = async (values) => {
    console.log('update laporan', values);
    const idPerjalananPegawai = values?.idPerjalananPegawai;
    try {
      startLoading();

      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng);
      formData.append("biayaTrans", values?.biayaTrans);
      formData.append("buktiPeng", values?.buktiPeng); // file object
      formData.append("buktiTrans", values?.buktiTrans); // file object
      formData.append("spd", values?.spd); // file object
      formData.append("status", "pengajuan");
      formData.append("hasil", values?.hasil);
      await updateLaporan(idPerjalananPegawai, formData);

      await fetch();
      setShowUpdateLaporan(EMPTY_MODAL);
      setShowSnackbar({
        show: true,
        message: "Laporan berhasil diperbarui",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal memperbarui laporan",
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
    { id: "aksi", label: "", numeric: false },
  ];

  console.log(showLaporan, "show laporan");
  const formattedData = (data?.pegawai ?? []).map((item) => {
    return {
      ...item,
      tanggal: formatRangeDate(
        item.tglBerangkat,
        item.tglKembali,
        "DD MMM YYYY",
      ),
      status: (
        <StatusBadge
          className="justify-center"
          status={item.status}
        />
      ),
      aksi: (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              item.status === "tolak"
                ? setShowUpdateLaporan({
                    show: true,
                    data: item,
                  })
                : setShowLaporan({
                    show: true,
                    data: item,
                  })
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 ${
              item.status === "tolak"
                ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 focus:ring-red-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand/30 hover:bg-[#fbf7ec] hover:text-brand focus:ring-brand/30"
            }`}
          >
            <FiEye className="h-4 w-4" />
            {item.status === "tolak" ? "Perbaiki" : "Lihat"}
          </button>
        </div>
      ),
    };
  });

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Laporan Perjalanan Dinas", href: "/laporan-perjalanan" },
    { label: data?.surat?.kegiatan || "Detail" },
  ];

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItem} />

      <header className="mb-8 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Laporan Perjalanan
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Detail Laporan Perjalanan Dinas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola laporan perjalanan, cetak dokumen, dan pantau detail surat
            tugas dalam satu halaman.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={() => handleFormLaporan("add")}
        >
          <FaPlusCircle className="h-4 w-4" />
          Buat Laporan
        </button>
      </header>

      <InfoPerjalanan data={data?.surat} className="mb-8" />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pegawai
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Cetak laporan perjalanan berdasarkan pegawai.
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
        show={showAddLaporan}
      >
        <LaporanPerjalanan
          data={data?.pegawai}
          pegawai={data?.pegawai}
          onSubmit={handleLaporanPerjalanan}
          onClose={() => setShowAddLaporan(false)}
          type={laporan}
        />
      </FormModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showUpdateLaporan.show}
      >
        <UpdateLaporanPerjalanan
          data={showUpdateLaporan.data}
          onSubmit={handleUpdateLaporan}
          onClose={() => setShowUpdateLaporan(EMPTY_MODAL)}
        />
      </FormModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showLaporan?.show}
      >
        <VerifBiayaPerjalanan
          data={showLaporan?.data}
          // onSubmit={handleConfirmBiaya}
          onClose={() =>
            setShowLaporan(EMPTY_MODAL)
          }
          type="laporan"
        />
      </FormModal>

      <Snackbar
        show={showSnackbar?.show}
        type={showSnackbar?.type}
        message={showSnackbar?.message}
        onClose={() =>
          setShowSnackbar({ show: false, message: "", type: "" })
        }
      />

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}