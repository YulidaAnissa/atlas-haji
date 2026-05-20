"use client";

import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { formatDate } from "@/utils/date";
import { DatePicker } from "../FormField";

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
}) {

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        tglPengajuanKppn: data?.tglPengajuanKppn
          ? new Date(data.tglPengajuanKppn)
          : null,
        tglPembayaran: data?.tglPembayaran
          ? new Date(data.tglPembayaran)
          : null,
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

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Menyimpan..." : "Simpan Tanggal"}
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              <DetailItem label="Nomor Surat" value={data?.surat?.noSurat} />

              <DetailItem
                label="Tanggal Surat"
                value={formatDate(data?.surat?.tglSurat)}
              />

              <DetailItem label="Kegiatan" value={data?.surat?.kegiatan} />

              <Field
                component={DatePicker}
                label="Tanggal Pengajuan KPPN"
                name="tglPengajuanKppn"
                type="text"
              />

              <Field
                component={DatePicker}
                label="Tanggal Pembayaran"
                name="tglPembayaran"
                type="text"
              />
            </div>
          </section>
        </form>
      )}
    </Form>
  );
}