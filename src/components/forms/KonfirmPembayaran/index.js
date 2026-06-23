"use client";

import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";
import { formatDate } from "@/utils/date";
import { DatePicker, UploadFile } from "../FormField";
import SelectField from "../FormField/SelectField";

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
              <DetailItem label="Nomor Surat" value={data?.surat?.noSurat} />

              <DetailItem
                label="Tanggal Surat"
                value={formatDate(data?.surat?.tglSurat)}
              />

              <DetailItem label="Kegiatan" value={data?.surat?.kegiatan} />

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