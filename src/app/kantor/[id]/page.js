"use client";

import PageBase from "@/components/pagebase";
import { DataTables, Breadcrumb, FormModal, PrintButton } from "@/components/elements";
import { useParams } from "next/navigation";
import { useUpdateLaporan, useLaporan, usePerjalanan } from "@/hooks/useData";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { useState } from "react";
import { useLoading } from "@/hooks";
import LaporanPerjalanan from "@/components/forms/LaporanPerjalanan";
import { FaEdit, FaPlusCircle, FaRegFileAlt } from "react-icons/fa";
import { FiCalendar, FiMapPin, FiFileText, FiInfo } from "react-icons/fi";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function Component() {
  const params = useParams();
  const [showLaporan, setShowLaporan] = useState(false);
  const [laporan, setLaporan] = useState({});
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
    { id: 'nip', label: 'NIP', numeric: false, width: 160 },
    { id: 'nama', label: 'Nama Pegawai', numeric: false },
    { id: 'gol', label: 'Gol', numeric: false, width: 80 },
    { id: 'jabatan', label: 'Jabatan', numeric: false },
    { id: 'aksi', label: '', numeric: false, width: 140 },
  ];

  const handleFormLaporan = (type) => {
    setShowLaporan(true);
    setLaporan(type);
  };

  const formattedData = (data?.pegawai ?? [])?.map(item => ({
    ...item,
    aksi: (
      <div className="flex gap-2 justify-end">
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
    { label: data?.perjalanan?.kegiatan || "Detail" }
  ];

  return (
    <PageBase className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      {/* HEADER TITLE SECTION */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <FaRegFileAlt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Detail Laporan Perjalanan
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Informasi detail kegiatan dinas beserta output laporan masing-masing pegawai
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand/25"
            onClick={() => handleFormLaporan("add")}
          >
            <FaPlusCircle className="h-4 w-4" />
            Buat Laporan Hasil
          </button>
        </div>
      </section>

      {/* INFORMATION CARDS GRID */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Waktu Pelaksanaan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FiCalendar className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Waktu Pelaksanaan</h3>
          </div>
          <div className="mt-3.5 space-y-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Berangkat</p>
              <p className="text-sm font-semibold text-slate-700">{data?.perjalanan?.tglBerangkat ? formatDate(data.perjalanan.tglBerangkat, "DD MMMM YYYY") : "-"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Kembali</p>
              <p className="text-sm font-semibold text-slate-700">{data?.perjalanan?.tglKembali ? formatDate(data.perjalanan.tglKembali, "DD MMMM YYYY") : "-"}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Lokasi & Administrasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FiMapPin className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tujuan & Surat</h3>
          </div>
          <div className="mt-3.5 space-y-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kota / Kabupaten Tujuan</p>
              <p className="text-sm font-semibold text-slate-700">{data?.perjalanan?.kabkota || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nomor Surat Tugas</p>
              <p className="text-sm font-semibold text-slate-700">{data?.perjalanan?.noSurat || "-"}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Agenda Kegiatan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <FiFileText className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Agenda Utama</h3>
          </div>
          <div className="mt-3.5 space-y-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Kegiatan</p>
              <p className="mt-0.5 text-sm font-medium leading-relaxed text-slate-600 line-clamp-3" title={data?.perjalanan?.kegiatan}>
                {data?.perjalanan?.kegiatan || "-"}
              </p>
            </div>
            {data?.perjalanan?.tglSurat && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Penerbitan Surat</p>
                <p className="text-xs font-semibold text-slate-500">{formatDate(data.perjalanan.tglSurat, "DD MMMM YYYY")}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* DATA TABLES SECTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 px-1">
          <FiInfo className="text-slate-400 h-4 w-4" />
          <h2 className="text-sm font-bold text-slate-800">Daftar Manifest Peserta & Unduhan File</h2>
        </div>
        <DataTables headCells={headCells} data={formattedData} loading={isLoading} />
      </section>

      {/* MODAL & OVERLAY */}
      <FormModal className="w-xl" icon={<FaEdit className="text-white w-6 h-6" />} show={showLaporan}>
        <LaporanPerjalanan 
          data={data?.perjalanan}
          pegawai={pegawai?.pegawai}
          onSubmit={handleLaporanPerjalanan}
          onClose={() => setShowLaporan(false)}
          type={laporan}
        />
      </FormModal>
      
      <LoadingOverlay show={loading} />
    </PageBase>
  );
}