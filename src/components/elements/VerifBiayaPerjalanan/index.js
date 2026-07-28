"use client";

import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { PreviewPDF } from "@/components/elements";

function formatRupiah(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function getFileType(url = "") {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (/\.(png|jpg|jpeg|webp|gif)$/i.test(cleanUrl)) return "image";
  if (/\.pdf$/i.test(cleanUrl)) return "pdf";

  return "file";
}

function FilePreview({ file, title }) {
  if (!file) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm text-gray-500">Bukti belum tersedia</p>
      </div>
    );
  }

  const fileType = getFileType(file);

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <p className="min-w-0 truncate text-sm font-semibold text-gray-800">
          {title}
        </p>

        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Buka
          <FaExternalLinkAlt className="h-3 w-3" />
        </a>
      </div>

      {fileType === "image" && (
        <div className="min-w-0 overflow-hidden bg-gray-50 p-3">
          <img
            src={file}
            alt={title}
            className="mx-auto block max-h-80 w-full max-w-full rounded-xl object-contain"
          />
        </div>
      )}

      {fileType === "pdf" && (
        <div className="min-w-0 overflow-hidden bg-gray-50">
          <iframe
            src={`${file}#toolbar=0&navpanes=0&scrollbar=0`}
            title={title}
            className="block h-130 w-full max-w-full border-0"
          />
        </div>
      )}

      {fileType === "file" && (
        <div className="bg-gray-50 px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            Preview tidak tersedia untuk tipe file ini.
          </p>
        </div>
      )}
    </div>
  );
}

// Menambahkan prop payerName pada CostCard
function CostCard({ title, amount, file, payerName }) {
  return (
    <section className="min-w-0 space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Rp {formatRupiah(amount)}
          </p>
        </div>
        
        {/* Menampilkan label Ditanggung Oleh jika payerName ada */}
        {payerName && (
          <div className="flex shrink-0 flex-col items-end justify-center rounded-lg bg-blue-50 px-3 py-2 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Ditanggung Oleh
            </span>
            <span className="mt-0.5 max-w-35 truncate text-xs font-semibold text-blue-900 sm:max-w-50">
              {payerName}
            </span>
          </div>
        )}
      </div>

      <FilePreview file={file} title={`Bukti ${title}`} />
    </section>
  );
}

function DocumentCard({ title, file }) {
  return (
    <section className="min-w-0 space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <p className="mt-1 text-sm text-gray-700">
          Preview dokumen pendukung
        </p>
      </div>

      <FilePreview file={file} title={title} />
    </section>
  );
}

export default function ComponentForm({ data = {}, onSubmit, onClose = false, type = "verifikasi", surat = {} }) {
  const [showAlasan, setShowAlasan] = useState(false);
  const [catatan, setCatatan] = useState("");

  const dataFilePreview = {
    nama: data?.nama,
    nip: data?.jenisPegawai === "PNS" ? data?.nip : "-",
    tglBerangkat: formatDate(data?.tglBerangkat, "DD MMMM YYYY"),
    tglKembali: formatDate(data?.tglKembali, "DD MMMM YYYY"),
    kabkota: data?.tujuan,
    kegiatan: data?.kegiatan || "",
    hasil: data?.hasil,
    lama: calculateTripDuration(
      data?.tglBerangkat,
      data?.tglKembali
    ),
    asal: data?.kabkota || "",
    namaKantor: surat?.namaKantor || "",
    alamat: surat?.alamat || "",
    callCenter: surat?.callCenter || "",
    website: surat?.website || "",
    email: surat?.email || "",
  };

  return (
    <div className="max-h-[80vh] min-w-0 overflow-y-auto overflow-x-hidden">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          {type === "verifikasi" ? "Verifikasi Pembiayaan" : "Laporan Perjalanan"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Periksa bukti pendukung sebelum melakukan verifikasi.
        </p>
      </div>

      <div className="mb-5 grid min-w-0 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left sm:grid-cols-2">
        <div className="min-w-0 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Nama
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-gray-800">
            {data?.nama || "-"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            NIP
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-gray-800">
            {data?.nip || "-"}
          </p>
        </div>
      </div>

      <div className="min-w-0 space-y-5">
        <DocumentCard title="Surat Perjalanan Dinas" file={data?.spd} />

        <section className="min-w-0 space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Laporan Perjalanan
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Hasil laporan perjalanan dinas
              </p>
            </div>
          </div>

          {data?.hasil ? (
            <PreviewPDF 
              title="Laporan Perjalanan"
              text="Hasil laporan perjalanan dinas"
              data={dataFilePreview}
              format="/laporan-format.docx"
              file={`laporan-${data?.nip}`}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
              <p className="text-sm text-gray-500">Laporan belum tersedia</p>
            </div>
          )}
        </section>

        {/* Mengirimkan namaBiayaTrans dan namaBiayaPeng sebagai prop payerName */}
        <CostCard
          title="Biaya Transportasi"
          amount={data?.biayaTrans}
          file={data?.buktiTrans}
          payerName={data?.namaBiayaTrans} 
        />

        <CostCard
          title="Biaya Penginapan"
          amount={data?.biayaPeng}
          file={data?.buktiPeng}
          payerName={data?.namaBiayaPeng} 
        />
      </div>

      {showAlasan && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <label className="block text-sm font-semibold text-red-800">
            Alasan Penolakan
          </label>
          <textarea
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-red-200 bg-white p-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
            placeholder="Tuliskan alasan penolakan..."
          />

          <button
            type="button"
            onClick={() => onSubmit("tolak", catatan)}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Kirim Penolakan
          </button>
        </div>
      )}

      <div className="sticky bottom-0 mt-6 flex flex-col gap-3 border-t border-gray-200 bg-white py-4 sm:flex-row sm:items-center sm:justify-between">
        {type === "verifikasi" && data?.status === "pengajuan" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onSubmit("verifikasi")}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <FaCheckCircle className="h-4 w-4" />
              Verifikasi
            </button>

            <button
              type="button"
              onClick={() => setShowAlasan(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <FaTimesCircle className="h-4 w-4" />
              Tolak
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}