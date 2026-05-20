"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit, FaPlusCircle } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  FormModal,
  PrintButton,
  Snackbar,
} from "@/components/elements";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import LaporanPerjalanan from "@/components/forms/LaporanPerjalanan";

import { useUpdateLaporan, useLaporan, usePerjalanan } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { formatDate, calculateTripDuration } from "@/utils/date";

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

export default function Component() {
  const params = useParams();
  const { id } = params;

  const [showLaporan, setShowLaporan] = useState(false);
  const [laporan, setLaporan] = useState({});
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [loading, startLoading, endLoading] = useLoading();

  const { data, isLoading, fetch } = useLaporan({
    urlParams: { id },
  });

  const { updateLaporan } = useUpdateLaporan();

  const { data: pegawai } = usePerjalanan({
    urlParams: { id },
  });

  console.log("data perjalanan ", data);

  const handleLaporanPerjalanan = async (values) => {
    const idPerjalananPegawai = values?.pegawai?.value;

    console.log('ini hasil laporan ', values);
    console.log('id perjalanan pegawai ', idPerjalananPegawai);

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
      // await updateLaporan(idPerjalananPegawai, {
      //   hasil: values?.hasil,
      //   status: "pengajuan",
      // });

      await fetch();
      setShowLaporan(false);
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
    setShowLaporan(true);
    setLaporan(type);
  };

  const headCells = [
    { id: "nip", label: "NIP", numeric: false },
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "gol", label: "Gol", numeric: false },
    { id: "jabatan", label: "Jabatan", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  const formattedData = (data?.pegawai ?? []).map((item) => ({
    ...item,
    aksi: (
      <div className="flex justify-end">
        <PrintButton
          data={{
            nama: item?.nama,
            nip: item?.nip,
            tglBerangkat: formatDate(
              data?.perjalanan?.tglBerangkat,
              "DD MMMM YYYY"
            ),
            tglKembali: formatDate(
              data?.perjalanan?.tglKembali,
              "DD MMMM YYYY"
            ),
            kabkota: data?.perjalanan?.kabkota,
            kegiatan: data?.perjalanan?.kegiatan,
            hasil: item?.hasil,
            lama: calculateTripDuration(
              data?.perjalanan?.tglBerangkat,
              data?.perjalanan?.tglKembali
            ),
          }}
          format="/laporan-format.docx"
          file={`laporan-${item.nip}`}
        />
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Laporan Perjalanan Dinas", href: "/laporan-perjalanan" },
    { label: data?.perjalanan?.kegiatan || "Detail" },
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

      <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Informasi Perjalanan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Ringkasan tanggal, tujuan, kegiatan, dan surat tugas.
          </p>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            label="Tanggal Berangkat"
            value={formatDate(data?.perjalanan?.tglBerangkat)}
          />
          <DetailItem
            label="Tanggal Kembali"
            value={formatDate(data?.perjalanan?.tglKembali)}
          />
          <DetailItem label="Tujuan" value={data?.perjalanan?.kabkota} />
          <DetailItem label="Kegiatan" value={data?.perjalanan?.kegiatan} />
          <DetailItem label="No Surat" value={data?.perjalanan?.noSurat} />
          <DetailItem
            label="Tanggal Surat"
            value={
              data?.perjalanan?.tglSurat
                ? formatDate(data?.perjalanan?.tglSurat)
                : "-"
            }
          />
        </div>
      </section>

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
        className="w-xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showLaporan}
      >
        <LaporanPerjalanan
          data={data?.perjalanan}
          pegawai={pegawai?.pegawai}
          onSubmit={handleLaporanPerjalanan}
          onClose={() => setShowLaporan(false)}
          type={laporan}
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