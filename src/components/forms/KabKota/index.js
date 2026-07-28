"use client";

import React from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import validation from "./validate";

// Komponen internal untuk menghitung progres kelengkapan data master wilayah & tarif SBM
function KabKotaFormProgress({ values = {} }) {
  const targetFields = ["kabkota", "uhPNS", "uhPPPK", "uhNonASN"];

  const filledFields = targetFields.filter((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }).length;

  // const progress = Math.round((filledFields / fieldsCount) * 100);
  const progress = Math.round((filledFields / targetFields.length) * 100);

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Kelengkapan Data</p>
          <span className="text-sm font-bold text-brand">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-brand transition-all duration-300 ease-out-in" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Pastikan nama wilayah dan nominal SBM kepegawaian sudah terisi penuh.
        </p>
      </div>
    </aside>
  );
}

export default function KabKotaForm({
  onSubmit = () => {},
  data = {},
  onClose = () => {},
  type = "add",
}) {

  const fields = ["kabkota", "uhPNS", "uhPPPK", "uhNonASN"];
  const isEdit = type === "edit";

  if (isEdit) {
    return (
      <Form onSubmit={onSubmit} validate={validation} initialValues={data}>
        {({ handleSubmit, submitting }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-white"
          >
            {/* Header Modal Edit */}
            <div className="border-b border-slate-100 bg-[#fbf7ec]/40 px-6 py-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Edit Kabupaten / Kota
              </p>
              <h2 className="mt-1.5 text-xl font-black text-slate-950">
                Perbarui Data Kabupaten / Kota
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ubah nama wilayah dan nominal standar uang harian instansi.
              </p>
            </div>

            {/* Content Form Edit */}
            <div className="overflow-y-auto px-6 py-6 sm:px-8 space-y-5">
              <div className="flex flex-col gap-4">
                {/* Wilayah full width */}
                <Field
                  name="kabkota"
                  component={InputField}
                  label="Nama Kabupaten / Kota"
                  placeholder="Masukkan nama kabupaten / kota"
                />

                {/* Uang Harian Satu Baris (3 Kolom Sejajar) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    name="uhPNS"
                    component={InputField}
                    label="Uang Harian PNS"
                    placeholder="Contoh: 430000"
                  />
                  <Field
                    name="uhPPPK"
                    component={InputField}
                    label="Uang Harian PPPK"
                    placeholder="Contoh: 380000"
                  />
                  <Field
                    name="uhNonASN"
                    component={InputField}
                    label="Uang Harian Non ASN"
                    placeholder="Contoh: 320000"
                  />
                </div>
              </div>
            </div>

            {/* Footer Modal Edit */}
            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:justify-end sm:px-8">
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
                onClick={onClose}
              >
                <FiX className="h-4 w-4" />
                Batal
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-36"
              >
                <FiSave className="h-4 w-4" />
                {submitting ? "Menyimpan..." : "Simpan"}
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
        return (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
          >
            {/* Header Add Mode */}
            <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-5 py-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Data Master
              </p>
              <h2 className="mt-1.5 text-xl font-black text-slate-950 sm:text-2xl">
                Form Kabupaten / Kota
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lengkapi nama wilayah tujuan beserta alokasi uang harian tiap kategori pegawai.
              </p>
            </div>

            {/* Grid Konten Utama */}
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[260px_1fr]">
              {/* Sidebar Progress yang sudah difaktorisasi */}
              <KabKotaFormProgress values={values} fieldsCount={fields.length} />

              {/* Input Form Fields */}
              <div className="min-w-0 space-y-6">
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Informasi Wilayah & Tarif Uang Harian
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Tentukan pembagian alokasi uang harian perjalanan dinas daerah tujuan.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Wilayah full width */}
                    <Field
                      name="kabkota"
                      component={InputField}
                      label="Nama Kabupaten / Kota"
                      placeholder="Masukkan nama kabupaten / kota"
                    />

                    {/* Uang Harian Satu Baris (3 Kolom Sejajar) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field
                        name="uhPNS"
                        component={InputField}
                        label="Uang Harian PNS"
                        placeholder="Contoh: 430000"
                      />

                      <Field
                        name="uhPPPK"
                        component={InputField}
                        label="Uang Harian PPPK"
                        placeholder="Contoh: 380000"
                      />

                      <Field
                        name="uhNonASN"
                        component={InputField}
                        label="Uang Harian Non ASN"
                        placeholder="Contoh: 320000"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 border-t border-[#eadfbe] bg-[#fbf7ec]/40 px-5 py-4 sm:justify-end sm:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
              >
                <FiSave className="h-4 w-4" />
                {submitting ? "Menyimpan..." : "Simpan Data Master"}
              </button>
            </div>
          </form>
        );
      }}
    </Form>
  );
}