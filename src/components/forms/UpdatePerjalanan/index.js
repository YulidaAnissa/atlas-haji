"use client";

import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";

import SelectField from "../FormField/SelectField";

function getOptionValue(option) {
  return typeof option === "object" && option !== null
    ? option.value
    : option;
}

function validate(values) {
  const errors = {};

  if (!values.nip) {
    errors.nip = "Pejabat pemberi tugas wajib dipilih";
  }

  if (!values.idSurat) {
    errors.idSurat = "Surat tugas wajib dipilih";
  }

  return errors;
}

export default function EditPerjalananForm({
  data = {},
  pejabat = [],
  st = [],
  onSubmit = () => {},
  onClose = () => {},
}) {
  const pejabatOptions = useMemo(
    () =>
      Array.isArray(pejabat)
        ? pejabat.map((item) => ({
            value: item.nip,
            label: item.jabatan,
          }))
        : [],
    [pejabat]
  );

  const suratOptions = useMemo(
    () =>
      Array.isArray(st)
        ? st
            .filter((item) => item?.idSurat)
            .map((item) => ({
              value: item.idSurat,
              label: item.noSurat,
            }))
        : [],
    [st]
  );

  const initialValues = useMemo(
    () => ({
      nip: data?.nip
        ? pejabatOptions.find(
            (option) =>
              String(option.value) === String(data.nip)
          ) || {
            value: data.nip,
            label: data.jabatan || data.nip,
          }
        : null,

      idSurat: data?.idSurat
        ? suratOptions.find(
            (option) =>
              String(option.value) ===
              String(data.idSurat)
          ) || {
            value: data.idSurat,
            label: data.noSurat || data.idSurat,
          }
        : null,
    }),
    [data, pejabatOptions, suratOptions]
  );

  const handleFormSubmit = (values, form) => {
    const selectedSurat = st.find(
      (item) =>
        String(item.idSurat) ===
        String(getOptionValue(values.idSurat))
    );

    const payload = {
      ...data,
      nip: getOptionValue(values.nip),
      idSurat: getOptionValue(values.idSurat),
      noSurat: selectedSurat?.noSurat || data?.noSurat,
    };

    return onSubmit(payload, form);
  };

  return (
    <Form
      key={`${data?.idPerjalanan}-${data?.idSurat}-${data?.nip}`}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validate={validate}
    >
      {({ handleSubmit, submitting }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <header className="border-b border-slate-100 px-5 py-6 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Edit Perjalanan Dinas
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Pejabat dan Surat Tugas
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ubah pejabat pemberi tugas atau surat tugas
              perjalanan.
            </p>
          </header>

          <div className="space-y-5 px-5 py-6 sm:px-7">
            <Field
              primary
              name="nip"
              component={SelectField}
              label="Pejabat Pemberi Tugas"
              options={pejabatOptions}
              placeholder="Pilih pejabat"
              className="w-full"
            />

            <Field
              primary
              name="idSurat"
              component={SelectField}
              label="Surat Tugas"
              options={suratOptions}
              placeholder="Pilih surat tugas"
              className="w-full"
            />
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition hover:bg-[#b5964f] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>
          </footer>
        </form>
      )}
    </Form>
  );
}