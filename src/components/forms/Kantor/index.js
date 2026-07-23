"use client";

import React from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField"; 
import validation from "./validate";
import CreateableSelect from "../FormField/CreateableSelect";

const formatKodeSurat = (inputValue = "") => {
  if (!inputValue) return "";
  const cleanInput = inputValue.trim().toUpperCase();
  const currentYear = new Date().getFullYear();
  return `ST-XXX/${cleanInput}/${currentYear}`;
};

const normalizeValue = (val = "") => String(val).trim();

function KantorFormProgress({ values = {} }) {
  const targetFields = [
    "nama",
    "alamat",
    "email",
    "website",
    "callCenter",
    "idKabKota",
    "unitKantor",
  ];

  const filledFields = targetFields.filter((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }).length;

  const progress = Math.round((filledFields / targetFields.length) * 100);

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Kelengkapan Data</p>
          <span className="text-sm font-bold text-brand">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-brand transition-all duration-300 ease-out-in"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Pastikan seluruh informasi operasional dan rincian kontak kantor sudah terisi penuh.
        </p>
      </div>
    </aside>
  );
}

export default function KantorForm({
  onSubmit = () => {},
  data = {},
  onClose = () => {},
  type = "add",
  kabKotaOptions = [], 
  kodeSuratOptions = [], // Prop untuk opsi pilihan kode surat
  handleKodeSuratChange = () => {}, // Handler jika ada aksi tambahan saat kode surat berubah
}) {
  const isEdit = type === "edit";

  // 1. Pastikan value options dipaksa menjadi Number agar konsisten
  const formattedKabKotaOptions = (kabKotaOptions || []).map((item) => ({
    value: item.idKabKota ? Number(item.idKabKota) : "", 
    label: item.kabkota || item.nama || "",
  }));

  // 2. Format initial data sebelum masuk ke Form
  const formattedInitialValues = {
    ...data,
    idKabKota: formattedKabKotaOptions.find(opt => opt.value === Number(data?.idKabKota)) || null,
    kodeSurat: data?.kodeSurat 
      ? { 
          value: data.kodeSurat.includes("ST-XXX/") ? data.kodeSurat : formatKodeSurat(data.kodeSurat), 
          label: data.kodeSurat.includes("ST-XXX/") ? data.kodeSurat : formatKodeSurat(data.kodeSurat),
        } 
      : null,
  };

  // Render form fields yang sama untuk mode Edit dan Add
  const renderFormFields = (form) => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="nama"
          component={InputField}
          label="Nama Kantor"
          placeholder="Contoh: KANTOR WILAYAH KEMENTERIAN HAJI DAN UMRAH PROVINSI JAWA BARAT"
        />
        <Field
          name="unitKantor"
          component={InputField}
          label="Unit Kantor"
          placeholder="Contoh: Kantor Wilayah Provinsi Jawa Barat"
        />
      </div>

      <Field
        name="idKabKota"
        component={SelectField}
        label="Kabupaten / Kota"
        placeholder="Pilih Kabupaten / Kota"
        options={formattedKabKotaOptions} 
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          name="email"
          component={InputField}
          label="Email"
          placeholder="Contoh: info@kantor.com"
          type="email"
        />
        <Field
          name="callCenter"
          component={InputField}
          label="Call Center"
          placeholder="Contoh: 1500123"
        />
        <Field
          name="website"
          component={InputField}
          label="Website"
          placeholder="Contoh: www.kantor.com"
        />
      </div>

      <Field
        name="alamat"
        component={InputField}
        label="Alamat Lengkap"
        placeholder="Masukkan alamat lengkap kantor"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {/* --- FIELD KODE SURAT (MENGGANTIKAN NOMOR SURAT) --- */}
        <Field
          primary
          name="kodeSurat"
          component={CreateableSelect}
          label="Kode Surat"
          options={kodeSuratOptions}
          placeholder="Contoh: Kw.13"
          className="text-left"
          formatCreateLabel={(inputValue) =>
            `Gunakan ${formatKodeSurat(inputValue)}`
          }
          getNewOptionData={(inputValue) => {
            const formattedValue = formatKodeSurat(inputValue);
            return {
              value: formattedValue,
              label: formattedValue,
            };
          }}
          isValidNewOption={(inputValue) => {
            const formattedValue = formatKodeSurat(inputValue);
            if (!formattedValue) return false;

            return !kodeSuratOptions.some(
              (option) =>
                normalizeValue(option.value).toLowerCase() ===
                formattedValue.toLowerCase()
            );
          }}
          onChange={(newKode) =>
            handleKodeSuratChange(newKode, form)
          }
        />
      </div>
    </div>
  );

  if (isEdit) {
    return (
      <Form onSubmit={onSubmit} validate={validation} initialValues={formattedInitialValues}>
        {({ handleSubmit, form, submitting }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-white"
          >
            {/* Header Modal Edit */}
            <div className="border-b border-slate-100 bg-[#fbf7ec]/40 px-6 py-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Edit Kantor
              </p>
              <h2 className="mt-1.5 text-xl font-black text-slate-950">
                Perbarui Data Kantor
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ubah informasi nama, alamat, atau rincian kontak kantor.
              </p>
            </div>

            {/* Content Form Edit */}
            <div className="space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              {renderFormFields(form)}
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
      {({ handleSubmit, values, form, submitting }) => {
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
                Form Kantor
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lengkapi informasi detail operasional cabang dan alamat lengkap perusahaan.
              </p>
            </div>

            {/* Grid Konten Utama */}
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[260px_1fr]">
              {/* Sidebar Progress */}
              <KantorFormProgress values={values} />

              {/* Input Form Fields */}
              <div className="min-w-0 space-y-6">
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Informasi Kantor
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Tentukan detail lokasi dan kontak pusat layanan.
                    </p>
                  </div>
                  
                  {renderFormFields(form)}
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