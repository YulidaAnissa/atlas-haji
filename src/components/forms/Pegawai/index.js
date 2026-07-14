"use client";

import React from "react";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import validation from "./validate";

const EMPLOYEE_TYPES = [
  { label: "ASN", value: "ASN" },
  { label: "Non ASN", value: "NON_ASN" },
];

const BASE_FIELDS = ["jenisPegawai", "nama", "pangkat", "gol", "jabatan"];

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
          {meta.error}
        </p>
      )}
    </div>
  );
}

function EmployeeIdentityFields({
  employeeType,
  form,
  disabled = false,
}) {
  const handleTypeChange = () => {
    form.change("nip", "");
  };

  return (
    <>
      <Field
        name="jenisPegawai"
        component={SelectField}
        label="Jenis Pegawai"
        placeholder="Pilih jenis pegawai"
        options={EMPLOYEE_TYPES}
        disabled={disabled}
        onValueChange={handleTypeChange}
      />

      {employeeType === "ASN" && (
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
    </>
  );
}

function FormProgress({ values }) {
  const fields = [...BASE_FIELDS, "nip"];

  const filledFields = fields.filter((field) => {
    const value = values[field];

    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );
  }).length;

  const progress = Math.round(
    (filledFields / fields.length) * 100
  );

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-bold text-slate-800">
          Kelengkapan Data
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          ASN menggunakan NIP, sedangkan Non ASN menggunakan NIK.
        </p>
      </div>

      {/* <div className="rounded-xl border border-slate-200 bg-white p-4">
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
      </div> */}
    </aside>
  );
}

function PegawaiFields({ values, form, isEdit }) {
  return (
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

        <EmployeeIdentityFields
          employeeType={values.jenisPegawai}
          form={form}
          disabled={isEdit}
        />

        {values.jenisPegawai === "ASN" && (
          <>
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
          </>
        )}


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
  );
}

export default function AddPegawaiForm({
  onSubmit = () => {},
  data = {},
  onClose = () => {},
  type = "add",
}) {
  const isEdit = type === "edit";

  const initialValues = {
    ...data,

    // Field tetap menggunakan nip.
    // data.nik hanya dipakai sebagai fallback kalau ada data lama.
    nip: data.nip || data.nik || "",

    jenisPegawai:
      data.jenisPegawai ||
      (data.nik ? "NON_ASN" : data.nip ? "ASN" : ""),
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validation}
      initialValues={initialValues}
    >
      {({ handleSubmit, values, form, submitting }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
        >
          <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              {isEdit ? "Edit Pegawai" : "Data Master"}
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
              {isEdit ? "Perbarui Data Pegawai" : "Form Pegawai"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {isEdit
                ? "Perbarui informasi pegawai yang diperlukan."
                : "Pilih jenis pegawai, lalu lengkapi identitas dan jabatan."}
            </p>
          </div>

          <div
            className={`grid gap-5 p-4 sm:p-6 ${
              isEdit ? "" : "lg:grid-cols-[320px_1fr]"
            }`}
          >
            {!isEdit && <FormProgress values={values} />}

            <div className="min-w-0">
              <PegawaiFields
                values={values}
                form={form}
                isEdit={isEdit}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:justify-end sm:px-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
            >
              <FiSave className="h-4 w-4" />

              {submitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan"
                  : "Simpan Pegawai"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 sm:w-auto sm:min-w-44"
              >
                <FiX className="h-4 w-4" />
                Tutup
              </button>
            )}
          </div>
        </form>
      )}
    </Form>
  );
}