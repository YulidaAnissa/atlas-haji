"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import {
  DatePicker,
  TextArea,
  UploadFile,
} from "@/components/forms/FormField";

import CreateableSelect from "../FormField/CreateableSelect";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import TextareaField from "../FormField/TextAreaField";

// Definisikan opsi tipe perjalanan secara statis
const defaulttypeOptions = [
  { label: "Full Board", value: "full_board" },
  { label: "Full Day", value: "full_day" },
  { label: "Half Day", value: "half_day" },
];

function getOptionValue(option) {
  return typeof option === "object" && option !== null
    ? option.value
    : option;
}

function normalizeValue(value) {
  return String(value || "").trim();
}

function formatNoSurat(value, kode = "XXX") {
  const input = normalizeValue(value);

  if (!input) return "";
  if (input.startsWith("ST-")) return input;

  return `ST-${input}/${kode}/${new Date().getFullYear()}`;
}

export default function PerjalananForm({
  data = null,
  pejabat = [],
  typeOptions = defaulttypeOptions,
  onSubmit = () => {},
  onClose,
  kantor,
}) {
  const [customSuratOptions, setCustomSuratOptions] =
    useState([]);

  // Mendukung data flat dan data nested dari API.
  const suratData = data?.surat || data || {};
  
  // Ambil nilai kodeSurat dari objek kantor (fallback ke "XXX" jika belum ada)
  const kodeSuratKantor = kantor?.kodeSurat || "XXX";

  const isEdit = Boolean(
    suratData?.idSurat || suratData?.noSurat
  );

  useEffect(() => {
    setCustomSuratOptions([]);
  }, [
    suratData?.idSurat,
    suratData?.noSurat,
  ]);

  const pejabatOptions = useMemo(
    () =>
      Array.isArray(pejabat)
        ? pejabat.map((item) => ({
            value: normalizeValue(item.nip),
            label:
              item.jabatan ||
              item.nama ||
              normalizeValue(item.nip),
          }))
        : [],
    [pejabat]
  );

  const noSuratOptions = useMemo(() => {
    const existingOption = suratData?.noSurat
      ? [
          {
            value: suratData.noSurat,
            label: suratData.noSurat,
          },
        ]
      : [];

    return [
      ...existingOption,
      ...customSuratOptions,
    ].filter(
      (option, index, current) =>
        current.findIndex(
          (item) =>
            normalizeValue(
              item.value
            ).toLowerCase() ===
            normalizeValue(
              option.value
            ).toLowerCase()
        ) === index
    );
  }, [
    suratData?.noSurat,
    customSuratOptions,
  ]);

  const initialValues = useMemo(
    () => ({
      nip: suratData?.nip
        ? pejabatOptions.find(
            (option) =>
              normalizeValue(option.value) ===
              normalizeValue(suratData.nip)
          ) || {
            value: normalizeValue(suratData.nip),
            label:
              suratData.jabatan ||
              suratData.nama ||
              normalizeValue(suratData.nip),
          }
        : null,

      noSurat: suratData?.noSurat
        ? {
            value: suratData.noSurat,
            label: suratData.noSurat,
          }
        : null,

      type: suratData?.type
        ? typeOptions.find(
            (option) =>
              normalizeValue(option.value) ===
              normalizeValue(suratData.type)
          ) || {
            value: normalizeValue(suratData.type),
            label: suratData.type,
          }
        : null,

      tglSurat: suratData?.tglSurat
        ? new Date(suratData.tglSurat)
        : null,

      kegiatan: suratData?.kegiatan || "",

      ringKegiatan: suratData?.ringKegiatan || "",

      fileSurat:
        suratData?.fileSurat ||
        suratData?.file ||
        null,
    }),
    [suratData, pejabatOptions, typeOptions]
  );

  console.log(suratData, "suratData");

  const handleFormSubmit = (values, form) => {
    const payload = {
      ...values,

      ...(suratData?.idSurat && {
        idSurat: suratData.idSurat,
      }),

      nip: normalizeValue(
        getOptionValue(values.nip)
      ),

      noSurat: formatNoSurat(
        getOptionValue(values.noSurat),
        kodeSuratKantor
      ),

      type: normalizeValue(
        getOptionValue(values.type)
      ),
    };

    return onSubmit(payload, form, {
      mode: isEdit ? "edit" : "add",
      isEdit,
    });
  };

  const handleSuratChange = (
    newSurat,
    form
  ) => {
    if (!newSurat) {
      form.change("noSurat", null);
      return;
    }

    const formattedNoSurat = formatNoSurat(
      getOptionValue(newSurat),
      kodeSuratKantor
    );

    const formattedOption = {
      value: formattedNoSurat,
      label: formattedNoSurat,
    };

    setCustomSuratOptions((current) => {
      const alreadyExists = current.some(
        (option) =>
          normalizeValue(
            option.value
          ).toLowerCase() ===
          formattedNoSurat.toLowerCase()
      );

      return alreadyExists
        ? current
        : [...current, formattedOption];
    });

    form.change("noSurat", formattedOption);
  };

  return (
    <Form
      key={[
        isEdit ? "edit" : "add",
        suratData?.idSurat,
        suratData?.noSurat,
      ].join("-")}
      onSubmit={handleFormSubmit}
      validate={validation}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        form,
        submitting,
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <header className="border-b border-slate-100 px-5 py-6 sm:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              {isEdit
                ? "Edit Perjalanan Dinas"
                : "Perjalanan Dinas"}
            </span>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {isEdit
                ? "Perbarui Perjalanan Dinas"
                : "Buat Perjalanan Dinas"}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              {isEdit
                ? "Perbarui pejabat pemberi tugas dan informasi surat."
                : "Lengkapi pejabat pemberi tugas dan informasi surat."}
            </p>
          </header>

          <div className="divide-y divide-slate-100 px-5 sm:px-8">
            <section className="grid gap-5 py-6 sm:grid-cols-[180px_1fr] sm:py-8">
              <div>
                <p className="text-xs font-semibold text-brand">
                  01
                </p>

                <h3 className="mt-1 font-semibold text-slate-900">
                  Pemberi tugas
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Pejabat yang menerbitkan surat.
                </p>
              </div>

              <Field
                primary
                name="nip"
                component={SelectField}
                label="Pejabat Pemberi Tugas"
                options={pejabatOptions}
                placeholder="Pilih pejabat"
                className="w-full"
              />
            </section>

            <section className="grid gap-5 py-6 sm:grid-cols-[180px_1fr] sm:py-8">
              <div>
                <p className="text-xs font-semibold text-brand">
                  02
                </p>

                <h3 className="mt-1 font-semibold text-slate-900">
                  Detail surat
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Nomor, tanggal, berkas, dan kegiatan.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    primary
                    name="noSurat"
                    component={CreateableSelect}
                    label="Nomor Surat"
                    options={noSuratOptions}
                    placeholder="Contoh: 002"
                    className="text-left"
                    formatCreateLabel={(inputValue) =>
                      `Gunakan ${formatNoSurat(
                        inputValue,
                        kodeSuratKantor
                      )}`
                    }
                    getNewOptionData={(inputValue) => {
                      const formattedNoSurat =
                        formatNoSurat(inputValue, kodeSuratKantor);

                      return {
                        value: formattedNoSurat,
                        label: formattedNoSurat,
                      };
                    }}
                    isValidNewOption={(
                      inputValue
                    ) => {
                      const formattedNoSurat =
                        formatNoSurat(inputValue, kodeSuratKantor);

                      if (!formattedNoSurat) {
                        return false;
                      }

                      return !noSuratOptions.some(
                        (option) =>
                          normalizeValue(
                            option.value
                          ).toLowerCase() ===
                          formattedNoSurat.toLowerCase()
                      );
                    }}
                    onChange={(newSurat) =>
                      handleSuratChange(
                        newSurat,
                        form
                      )
                    }
                  />

                  <Field
                    primary
                    name="type"
                    component={SelectField}
                    label="Tipe Perjalanan"
                    options={typeOptions}
                    placeholder="Pilih tipe"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    primary
                    name="tglSurat"
                    component={DatePicker}
                    label="Tanggal Surat"
                    disableWeekend
                  />

                  <Field
                    name="fileSurat"
                    component={UploadFile}
                    label="File Surat Tugas"
                  />
                </div>

                <Field
                  name="kegiatan"
                  component={TextareaField}
                  label="Kegiatan"
                  placeholder="Masukkan nama kegiatan"
                  multiline
                  rows={3}
                />

                <Field
                  name="ringKegiatan"
                  component={InputField}
                  label="Ringkasan Kegiatan"
                  placeholder="Masukkan ringkasan kegiatan"
                  multiline
                  rows={4}
                />
              </div>
            </section>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto sm:min-w-36"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-[#b5964f] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-44"
            >
              {submitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Perjalanan Dinas"}
            </button>
          </footer>
        </form>
      )}
    </Form>
  );
}