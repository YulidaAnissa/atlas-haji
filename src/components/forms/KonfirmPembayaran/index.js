"use client";

import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";
import { formatDate } from "@/utils/date";
import { DatePicker, UploadFile } from "../FormField";
import SelectField from "../FormField/SelectField";
import { formatTipePerjalanan } from "@/utils/string";

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

export default function ComponentForm({
  onSubmit = () => {},
  data = {},
  canVerify = false,
}) {

  const anggaranOptions = [
    {
      value: "DIPA",
      label: "DIPA"
    },
    {
      value: "PKOH",
      label: "PKOH"
    }
  ]
  const selectedAnggaran =
    anggaranOptions.find((option) => option.value === data?.surat?.anggaran) ??
    null;
    
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        anggaran: selectedAnggaran,
        tglPengajuanKppn: data?.surat?.tglKPPN
          ? new Date(data.surat.tglKPPN)
          : null,
        tglPembayaran: data?.surat?.tglPembayaran
          ? new Date(data.surat.tglPembayaran)
          : null,
        buktiPembayaran: data?.surat?.buktiPembayaran || null,
      }}
    >
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Surat Tugas
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ringkasan surat tugas yang menjadi dasar biaya perjalanan.
                </p>
              </div>

              {canVerify && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Bagian ini dibuat col-span-full agar mengambil lebar penuh di dalam grid */}
              <div className="col-span-full flex items-center self-start sm:self-auto">
                <div className="flex w-full items-center justify-start gap-3 rounded-full border border-slate-200/80 bg-white/95 p-1.5 pr-5 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md">
                  {/* Segment 1: Tipe Dinas */}
                  {data?.surat?.type && (
                    <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold tracking-wide text-white shadow-sm">
                      {/* Indikator Titik (Sedikit diperbesar dengan efek pulse halus) */}
                      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {formatTipePerjalanan(data?.surat?.type)}
                    </span>
                  )}

                  {/* Garis Pembatas (Divider) - Menambah kerapian visual */}
                  {data?.surat?.type && data?.surat?.namaKantor && (
                    <div className="h-6 w-px shrink-0 bg-slate-200" />
                  )}

                  {/* Segment 2: Nama Kantor */}
                  {data?.surat?.namaKantor && (
                    <div className="flex min-w-0 flex-1 items-center gap-3 text-slate-600">
                      {/* Ikon dibungkus dalam lingkaran agar tampak lebih premium */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100/80 text-slate-500 shadow-inner">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      {/* Teks diperbesar ke text-sm */}
                      <span className="truncate text-sm font-medium text-slate-700">
                        {data?.surat?.namaKantor}
                      </span>
                    </div>
                  )}
                  
                </div>
              </div>

              {/* Sisa form di bawahnya */}
              <DetailItem 
                label="Nomor Surat" 
                value={data?.surat?.noSurat} 
              />

              <DetailItem
                label="Tanggal Surat"
                value={formatDate(data?.surat?.tglSurat)}
              />

              <DetailItem 
                label="Kegiatan" 
                value={data?.surat?.ringKegiatan || data?.surat?.kegiatan} 
              />

              {canVerify ? (
                <>
                  <Field
                    label="Anggaran"
                    name="anggaran"
                    component={SelectField}
                    options={anggaranOptions}
                  />

                  <Field
                    component={DatePicker}
                    label="Tanggal Pengajuan KPPN"
                    name="tglPengajuanKppn"
                    type="text"
                    minDate={data?.surat?.tglSurat}
                    disableWeekend
                  />

                  <Field
                    component={DatePicker}
                    label="Tanggal Pembayaran"
                    name="tglPembayaran"
                    type="text"
                    disableWeekend
                  />

                  <Field
                    component={UploadFile}
                    label="Bukti Pembayaran"
                    name="buktiPembayaran"
                    accept="image/*,.pdf"
                  />
                </>
              ) : (
                <>
                  <DetailItem
                    label="Anggaran"
                    value={data?.surat?.anggaran}
                  />

                  <DetailItem
                    label="Tanggal Pengajuan KPPN"
                    value={
                      data?.surat?.tglKPPN
                        ? formatDate(data.surat.tglKPPN)
                        : "-"
                    }
                  />

                  <DetailItem
                    label="Tanggal Pembayaran"
                    value={
                      data?.surat?.tglPembayaran
                        ? formatDate(data.surat.tglPembayaran)
                        : "-"
                    }
                  />

                  <DetailItem
                    label="Bukti Pembayaran"
                    value={
                      data?.surat?.buktiPembayaran ? (
                        <a
                          href={data.surat.buktiPembayaran}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand underline underline-offset-4 hover:text-[#b5964f]"
                        >
                          Lihat File
                        </a>
                      ) : (
                        "Belum Diunggah"
                      )
                    }
                  />
                </>
              )}
            </div>
          </section>
        </form>
      )}
    </Form>
  );
}