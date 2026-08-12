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
      <p className="mt-1 text-sm font-semibold leading-6 text-gray-800 break-words">
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
    { value: "DIPA", label: "DIPA" },
    { value: "PKOH", label: "PKOH" },
  ];

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
        <form onSubmit={handleSubmit} className="w-full">
          <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
            
            {/* Header Section */}
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Informasi Surat Tugas
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                  Ringkasan surat tugas yang menjadi dasar biaya perjalanan.
                </p>
              </div>

              {canVerify && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 md:h-10 w-full md:w-auto items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              )}
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
              
              {/* Badge Tipe Dinas & Nama Kantor (Responsive Pill) */}
              <div className="col-span-full self-start">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-3 rounded-2xl sm:rounded-full border border-slate-200/80 bg-white/95 p-3 sm:p-1.5 sm:pr-5 shadow-sm backdrop-blur-md">
                  
                  {/* Segment 1: Tipe Dinas */}
                  {data?.surat?.type && (
                    <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-sm">
                      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {formatTipePerjalanan(data?.surat?.type)}
                    </span>
                  )}

                  {/* Garis Pembatas (Hidden on Mobile, Visible on Tablet+) */}
                  {data?.surat?.type && data?.surat?.namaKantor && (
                    <div className="hidden sm:block h-6 w-px shrink-0 bg-slate-200" />
                  )}

                  {/* Segment 2: Nama Kantor */}
                  {data?.surat?.namaKantor && (
                    <div className="flex min-w-0 flex-1 items-center gap-3 text-slate-600">
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
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <span className="truncate text-xs sm:text-sm font-medium text-slate-700">
                        {data?.surat?.namaKantor}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Detail / Form Fields */}
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
                  <div className="w-full">
                    <Field
                      label="Anggaran"
                      name="anggaran"
                      component={SelectField}
                      options={anggaranOptions}
                    />
                  </div>

                  <div className="w-full">
                    <Field
                      component={DatePicker}
                      label="Tanggal Pengajuan KPPN"
                      name="tglPengajuanKppn"
                      type="text"
                      minDate={data?.surat?.tglSurat}
                      disableWeekend
                    />
                  </div>

                  <div className="w-full">
                    <Field
                      component={DatePicker}
                      label="Tanggal Pembayaran"
                      name="tglPembayaran"
                      type="text"
                      disableWeekend
                    />
                  </div>

                  <div className="col-span-full">
                    <Field
                      component={UploadFile}
                      label="Bukti Pembayaran"
                      name="buktiPembayaran"
                      accept="image/*,.pdf"
                    />
                  </div>
                </>
              ) : (
                <>
                  <DetailItem
                    label="Anggaran"
                    value={data?.surat?.anggaran}
                  />

                  <DetailItem
                    label="Tanggal Pengajuan KPPN"
                    value={data?.surat?.tglKPPN ? formatDate(data.surat.tglKPPN) : "-"}
                  />

                  <DetailItem
                    label="Tanggal Pembayaran"
                    value={data?.surat?.tglPembayaran ? formatDate(data.surat.tglPembayaran) : "-"}
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