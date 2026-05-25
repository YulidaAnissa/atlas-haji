"use client";

import React from "react";
import { Form, Field } from "react-final-form";

import TextAreaField from "../FormField/TextAreaField";
import InputField from "../FormField/InputField";
import { UploadFile } from "@/components/forms/FormField";

export default function FormPerbaikiLaporan({
  data = {},
  onSubmit,
  onClose = false,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        ...data,
        hasil: data?.hasil || data?.laporan || "",
        spd: data?.spd || null,
        biayaTrans: data?.biayaTrans || "",
        buktiTrans: data?.buktiTrans || null,
        biayaPeng: data?.biayaPeng || "",
        buktiPeng: data?.buktiPeng || null,
      }}
    >
      {({ handleSubmit }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex max-h-[80vh] flex-col overflow-y-auto"
        >
          <div className="space-y-6 px-1">
            <section className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
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
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                Catatan Perbaikan
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-amber-900">
                {data?.catatan || data?.alasan || "Tidak ada catatan"}
              </p>
            </section>

            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Laporan Perjalanan
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Perbaiki hasil laporan dan unggah kembali dokumen SPD jika diperlukan.
                </p>
              </div>

              <Field
                component={TextAreaField}
                label="Hasil Laporan"
                name="hasil"
                type="text"
              />

              <Field
                component={UploadFile}
                label="Surat Perjalanan Dinas"
                name="spd"
              />
            </section>

            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Biaya Perjalanan
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Perbaiki nominal dan bukti pendukung biaya perjalanan.
                </p>
              </div>

              <div className="grid gap-5 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2">
                <Field
                  component={InputField}
                  label="Biaya Transportasi"
                  name="biayaTrans"
                  startAdornment={
                    <span className="text-sm font-semibold text-gray-500">
                      Rp
                    </span>
                  }
                  type="number"
                />

                <Field
                  component={InputField}
                  label="Biaya Penginapan"
                  name="biayaPeng"
                  startAdornment={
                    <span className="text-sm font-semibold text-gray-500">
                      Rp
                    </span>
                  }
                  type="number"
                />

                <Field
                  component={UploadFile}
                  label="Bukti Pendukung Transportasi"
                  name="buktiTrans"
                />

                <Field
                  component={UploadFile}
                  label="Bukti Pendukung Penginapan"
                  name="buktiPeng"
                />
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-gray-200 bg-white px-1 py-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Simpan Perbaikan
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}