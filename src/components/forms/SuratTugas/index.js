"use client";

import React, { useMemo } from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import { DatePicker, UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import validation from "./validate";

export default function ComponentForm({
  onSubmit = () => {},
  onClose = false,
  data = {},
  type = "add",
}) {
  const fields = ["noSurat", "tglSurat", "kegiatan", "file"];
  const isEdit = type === "edit";

  const initialValues = useMemo(
    () => ({
      ...data,
      idSurat: data?.idSurat || null,
      tglSurat: data?.tglSurat ? new Date(data.tglSurat) : null,
      noSurat: data?.noSurat || "",
      kegiatan: data?.kegiatan || "",
      file: data?.file || null,
    }),
    [data]
  );

  if (isEdit) {
    return (
      <Form onSubmit={onSubmit} validate={validation} initialValues={initialValues}>
        {({ handleSubmit, submitting }) => (
          <form
            noValidate
            className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl bg-white"
            onSubmit={handleSubmit}
          >
            <div className="overflow-y-auto px-1 pb-4">
              <div className="mb-6 rounded-2xl border border-[#eadfbe] bg-[#fbf7ec] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                  Edit Surat Tugas
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Perbarui Data Surat
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ubah nomor surat, tanggal, kegiatan, atau dokumen surat tugas.
                </p>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-sm font-bold text-slate-800">
                    Informasi Surat Tugas
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Pastikan detail surat tugas sesuai dokumen yang berlaku.
                  </p>
                </div>

                <div className="space-y-4">
                  <Field
                    className="hidden"
                    component={InputField}
                    label="idSurat"
                    name="idSurat"
                  />

                  <Field
                    component={InputField}
                    label="Nomor Surat"
                    name="noSurat"
                    placeholder="Masukkan nomor surat tugas"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      component={DatePicker}
                      label="Tanggal Surat"
                      name="tglSurat"
                      type="text"
                    />

                    <Field
                      component={UploadFile}
                      label="File Surat Tugas"
                      name="file"
                    />
                  </div>

                  <Field
                    component={InputField}
                    label="Kegiatan"
                    name="kegiatan"
                    placeholder="Masukkan kegiatan"
                  />
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-slate-200 bg-white px-1 py-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSave className="h-4 w-4" />
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>

              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                onClick={onClose}
              >
                <FiX className="h-4 w-4" />
                Tutup
              </button>
            </div>
          </form>
        )}
      </Form>
    );
  }

  return (
    <Form onSubmit={onSubmit} validate={validation} initialValues={initialValues}>
      {({ handleSubmit, values, submitting }) => {
        const filledFields = fields.filter((field) => {
          const value = values[field];
          if (value instanceof File) return true;
          return String(value ?? "").trim() !== "";
        }).length;

        const progress = Math.round((filledFields / fields.length) * 100);

        return (
          <form
            noValidate
            className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
            onSubmit={handleSubmit}
          >
            <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Dokumen Perjalanan
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                Form Surat Tugas
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lengkapi nomor surat, tanggal, kegiatan, dan dokumen pendukung.
              </p>
            </div>

            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-800">
                    Kelengkapan Dokumen
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pastikan informasi surat tugas sudah lengkap.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-black text-slate-950">
                        {filledFields}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        dari {fields.length} field
                      </p>
                    </div>

                    <span className="rounded-full bg-[#fbf7ec] px-3 py-1 text-xs font-bold text-brand">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </aside>

              <div className="min-w-0 space-y-5">
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Informasi Surat Tugas
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Isi detail surat dan unggah dokumen surat tugas.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field
                      className="hidden"
                      component={InputField}
                      label="idSurat"
                      name="idSurat"
                    />

                    <Field
                      component={InputField}
                      label="Nomor Surat"
                      name="noSurat"
                      placeholder="Masukkan nomor surat tugas"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        component={DatePicker}
                        label="Tanggal Surat"
                        name="tglSurat"
                        type="text"
                      />

                      <Field
                        component={UploadFile}
                        label="File Surat Tugas"
                        name="file"
                      />
                    </div>

                    <Field
                      component={InputField}
                      label="Kegiatan"
                      name="kegiatan"
                      placeholder="Masukkan kegiatan"
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:justify-end sm:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
              >
                <FiSave className="h-4 w-4" />
                {submitting ? "Menyimpan..." : "Simpan Surat"}
              </button>
            </div>
          </form>
        );
      }}
    </Form>
  );
}