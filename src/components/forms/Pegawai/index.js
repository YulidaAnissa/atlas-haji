"use client";

import React, { useMemo } from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import validation from "./validate";

const EMPLOYEE_TYPES = [
  { label: "PNS", value: "PNS" },
  { label: "PPPK", value: "PPPK" },
  { label: "Non ASN", value: "NON_ASN" },
];

function SelectField({
  input,
  meta,
  label,
  placeholder = "Pilih data",
  options = [],
  disabled = false,
  onValueChange,
}) {
  const handleChange = (event) => {
    input.onChange(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...input}
        disabled={disabled}
        onChange={handleChange}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {meta.touched && meta.error && (
        <p className="mt-1 text-xs font-medium text-red-500">
          {typeof meta.error === 'object' ? meta.error.message : meta.error}
        </p>
      )}
    </div>
  );
}

function EmployeeIdentityFields({ employeeType, form, disabled = false }) {
  const handleTypeChange = (newValue) => {
    form.change("nip", "");
    if (newValue !== "PNS") {
      form.change("isPejabat", false);
      form.change("unit", "");
      form.change("pangkat", "");
    }
    if (newValue === "NON_ASN") {
      form.change("gol", "");
    }
  };

  return (
    <>
      <div className="col-span-2 sm:col-span-1">
        <Field
          name="jenisPegawai"
          component={SelectField}
          label="Jenis Pegawai"
          placeholder="Pilih jenis pegawai"
          options={EMPLOYEE_TYPES}
          disabled={disabled}
          onValueChange={handleTypeChange}
        />
      </div>

      <div className="col-span-2 sm:col-span-1">
        {(employeeType === "PNS" || employeeType === "PPPK") && (
          <Field
            name="nip"
            component={InputField}
            label="NIP"
            placeholder="Masukkan NIP"
            disabled={disabled}
          />
        )}

        {employeeType === "NON_ASN" && (
          <Field
            name="nip"
            component={InputField}
            label="NIK"
            placeholder="Masukkan NIK"
            disabled={disabled}
          />
        )}

        {!employeeType && (
          <Field
            name="nip"
            component={InputField}
            label="NIP / NIK"
            placeholder="Pilih jenis pegawai terlebih dahulu"
            disabled={true}
          />
        )}
      </div>
    </>
  );
}

function FormProgress({ values }) {
  const baseFields = ["jenisPegawai", "nama", "jabatan", "nip"];
  const isPns = values.jenisPegawai === "PNS";
  const isPppk = values.jenisPegawai === "PPPK";
  
  let targetFields = [...baseFields];
  if (isPns) {
    targetFields = [...targetFields, "pangkat", "gol"];
  } else if (isPppk) {
    targetFields = [...targetFields, "gol"];
  }

  if (isPns && values.isPejabat) {
    targetFields = [...targetFields, "unit"];
  }

  const filledFields = targetFields.filter((field) => {
    const value = values[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }).length;

  const progress = Math.round((filledFields / targetFields.length) * 100);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 h-fit sticky top-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Kelengkapan Data</p>
          <span className="text-sm font-bold text-brand">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-brand transition-all duration-300 ease-out-in" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          PNS menggunakan NIP, pangkat & golongan. PPPK menggunakan NIP & golongan. Non ASN menggunakan NIK.
          {values.isPejabat && " Sebagai pejabat, kolom Unit wajib diisi."}
        </p>
      </div>
    </aside>
  );
}

function PegawaiFields({ values, form, isEdit }) {
  const isPns = values.jenisPegawai === "PNS";
  const isPppk = values.jenisPegawai === "PPPK";

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">Informasi Pegawai</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">Isi identitas, kategori kepegawaian, dan jabatan saat ini.</p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <EmployeeIdentityFields employeeType={values.jenisPegawai} form={form} disabled={isEdit} />

        <div className="col-span-2">
          <Field name="nama" component={InputField} label="Nama Pegawai" placeholder="Masukkan nama lengkap beserta gelar" />
        </div>

        {isPns && (
          <div className="col-span-2 sm:col-span-1">
            <Field name="pangkat" component={InputField} label="Pangkat" placeholder="Contoh: Penata" />
          </div>
        )}

        {(isPns || isPppk) && (
          <div className={`col-span-2 ${isPns ? 'sm:col-span-1' : ''}`}>
            <Field 
              name="gol" 
              component={InputField} 
              label={isPppk ? "Golongan / Kelas Jabatan" : "Golongan"} 
              placeholder={isPppk ? "Contoh: IX atau VII" : "Contoh: III/c"} 
            />
          </div>
        )}

        <div className="col-span-2">
          <Field name="jabatan" component={InputField} label="Jabatan" placeholder="Masukkan nama jabatan atau posisi saat ini" />
        </div>

        {isPns && (
          <>
            <div className="col-span-2 py-2 border-t border-slate-100 mt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Field
                  name="isPejabat"
                  component="input"
                  type="checkbox"
                  onChange={(e) => {
                    form.change("isPejabat", e.target.checked);
                    if (!e.target.checked) form.change("unit", "");
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
                />
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">Pegawai ini merupakan Pejabat</p>
                  <p className="text-slate-500 text-xs">Centang jika memiliki peran struktural tertentu</p>
                </div>
              </label>
            </div>

            {values.isPejabat && (
              <div className="col-span-2 animate-fadeIn">
                <Field name="unit" component={InputField} label="Unit Kerja" placeholder="Masukkan nama unit kerja (Contoh: Bidang Integrasi Data)" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function AddPegawaiForm({ onSubmit = () => {}, data = {}, onClose = () => {}, type = "add" }) {
  const isEdit = type === "edit";

  const getInitialJenisPegawai = () => {
    if (data.jenisPegawai) return data.jenisPegawai;
    if (data.nik) return "NON_ASN";
    if (data.nip) return "PNS";
    return "";
  };

  const checkIsPejabat = () => {
    if (!data.status) return false;
    return String(data.status).toLowerCase().includes("eselon");
  };

  const initialValues = useMemo(() => ({
    ...data,
    nip: data.nip || data.nik || "",
    jenisPegawai: getInitialJenisPegawai(),
    isPejabat: checkIsPejabat(),
    unit: data.unit || "",
  }), [data]);

  return (
    <Form onSubmit={onSubmit} validate={validation} initialValues={initialValues}>
      {({ handleSubmit, values, form, submitting }) => (
        <form noValidate onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm">
          {!isEdit && (
            <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Data Master</p>
              <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">Form Pegawai</h2>
            </div>
          )}

          <div className={`grid gap-6 p-4 sm:p-6 ${isEdit ? "" : "lg:grid-cols-[280px_1fr]"}`}>
            {!isEdit && <FormProgress values={values} />}
            <div className="min-w-0 bg-white">
              <PegawaiFields values={values} form={form} isEdit={isEdit} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            {isEdit && (
              <button type="button" onClick={onClose} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 sm:w-auto sm:min-w-44">
                <FiX className="h-4 w-4" /> Tutup
              </button>
            )}
            <button type="submit" disabled={submitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44">
              <FiSave className="h-4 w-4" />
              {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Pegawai"}
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}