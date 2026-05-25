"use client";

import React from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import validation from "./validate";

export default function AddPegawaiForm({
  onSubmit = () => {},
  data = {},
  onClose = () => {},
  type = "add",
}) {
  const isEdit = type === "edit";

  if (isEdit) {
    return (
      <Form onSubmit={onSubmit} validate={validation} initialValues={data}>
        {({ handleSubmit, submitting }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl bg-white"
          >
            <div className="overflow-y-auto px-1 pb-4">
              <div className="mb-6 rounded-2xl border border-[#eadfbe] bg-[#fbf7ec] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                  Edit Pegawai
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Perbarui Data Pegawai
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ubah informasi pegawai yang diperlukan. NIP dikunci agar data
                  tetap konsisten.
                </p>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-sm font-bold text-slate-800">
                    Informasi Pegawai
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Pastikan nama, pangkat, golongan, dan jabatan sudah benar.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  <Field
                    name="nama"
                    component={InputField}
                    label="Nama Pegawai"
                    placeholder="Masukkan nama pegawai"
                  />

                  <Field
                    name="nip"
                    component={InputField}
                    label="NIP"
                    placeholder="Masukkan NIP"
                    disabled
                  />

                  <Field
                    name="pangkat"
                    component={InputField}
                    label="Pangkat"
                    placeholder="Masukkan pangkat"
                  />

                  <Field
                    name="gol"
                    component={InputField}
                    label="Golongan"
                    placeholder="Masukkan golongan"
                  />

                  <div className="md:col-span-2">
                    <Field
                      name="jabatan"
                      component={InputField}
                      label="Jabatan"
                      placeholder="Masukkan jabatan"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-slate-200 bg-white px-1 py-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70"
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
    <Form onSubmit={onSubmit} validate={validation} initialValues={data}>
      {({ handleSubmit, values, submitting }) => {
        const fields = ["nama", "nip", "pangkat", "gol", "jabatan"];
        const filledFields = fields.filter(
          (field) => values[field] && String(values[field]).trim() !== ""
        ).length;

        const progress = Math.round((filledFields / fields.length) * 100);

        return (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
          >
            <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Data Master
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                Form Pegawai
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lengkapi nama, NIP, pangkat, golongan, dan jabatan pegawai.
              </p>
            </div>

            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-800">
                    Kelengkapan Data
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pastikan semua informasi dasar pegawai sudah terisi.
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
                      Informasi Pegawai
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Isi identitas dan jabatan pegawai.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      name="nama"
                      component={InputField}
                      label="Nama Pegawai"
                      placeholder="Masukkan nama pegawai"
                    />

                    <Field
                      name="nip"
                      component={InputField}
                      label="NIP"
                      placeholder="Masukkan NIP"
                    />

                    <Field
                      name="pangkat"
                      component={InputField}
                      label="Pangkat"
                      placeholder="Masukkan pangkat"
                    />

                    <Field
                      name="gol"
                      component={InputField}
                      label="Golongan"
                      placeholder="Masukkan golongan"
                    />

                    <div className="md:col-span-2">
                      <Field
                        name="jabatan"
                        component={InputField}
                        label="Jabatan"
                        placeholder="Masukkan jabatan"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:justify-end sm:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
              >
                <FiSave className="h-4 w-4" />
                {submitting ? "Menyimpan..." : "Simpan Pegawai"}
              </button>
            </div>
          </form>
        );
      }}
    </Form>
  );
}