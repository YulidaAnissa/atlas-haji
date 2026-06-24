"use client";

import React, { useMemo } from "react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import {
  FiCalendar,
  FiMapPin,
  FiSave,
  FiUsers,
  FiX,
} from "react-icons/fi";

import {
  DatePickerRange,
  MultiSelectTextField,
} from "@/components/forms/FormField";

import SelectField from "../FormField/SelectField";
import validation from "./validate";

const INITIAL_VALUES = {
  dateRange: null,
  tujuan: "",
  pegawai: [""],
};

function getOptionValue(option) {
  if (typeof option === "object" && option !== null) {
    return option.value;
  }

  return option;
}

export default function ComponentForm({
  onSubmit = () => {},
  pegawai = [],
  kabkota = [],
  onClose = () => {},
  tglSurat = null,
}) {
  const pegawaiOptions = useMemo(
    () =>
      Array.isArray(pegawai)
        ? pegawai.map((item) => ({
            value: item.nip,
            label: `${item.nip} | ${item.nama}`,
          }))
        : [],
    [pegawai]
  );

  const kabkotaOptions = useMemo(
    () =>
      Array.isArray(kabkota)
        ? kabkota.map((item) => ({
            value: item.idKabKota,
            label: item.kabkota,
          }))
        : [],
    [kabkota]
  );

  const handleFormSubmit = (values, form) => {
    const payload = {
      dateRange: {
        startDate:
          values.dateRange?.startDate || null,
        endDate:
          values.dateRange?.endDate || null,
        formattedStart:
          values.dateRange?.formattedStart || null,
        formattedEnd:
          values.dateRange?.formattedEnd || null,
      },

      tujuan: String(values.tujuan || "").trim(),

      pegawai: Array.isArray(values.pegawai)
        ? values.pegawai
            .map(getOptionValue)
            .filter(Boolean)
        : [],
    };

    return onSubmit(payload, form);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      validate={validation}
      mutators={{ ...arrayMutators }}
      initialValues={INITIAL_VALUES}
    >
      {({ handleSubmit, values, submitting }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full flex-col"
        >
          {/* Header */}
          <header className="mb-6 overflow-hidden rounded-2xl border border-[#eadfbe] bg-linear-to-r from-[#fbf7ec] via-white to-white">
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand" />

                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                    Penugasan Pegawai
                  </p>
                </div>

                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Tambah Pegawai Perjalanan
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Tentukan jadwal, tujuan, dan pegawai yang
                  mengikuti perjalanan dinas.
                </p>
              </div>

              <div className="inline-flex self-start rounded-full border border-[#eadfbe] bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm">
                {values.pegawai?.filter(Boolean).length || 0}{" "}
                pegawai dipilih
              </div>
            </div>
          </header>

          <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* Jadwal */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-0">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCalendar className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Jadwal Perjalanan
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Tanggal berangkat dan kembali
                  </p>
                </div>
              </div>

              <div className="p-4">
                <Field name="dateRange">
                  {({ input, meta }) => {
                    const hasError = Boolean(
                      (meta.touched ||
                        meta.submitFailed) &&
                        meta.error
                    );

                    const errorMessage = Array.isArray(
                      meta.error
                    )
                      ? meta.error[0]?.message
                      : meta.error;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const suratDate = tglSurat
                      ? new Date(tglSurat)
                      : null;

                    if (suratDate) {
                      suratDate.setHours(0, 0, 0, 0);
                    }

                    const minimumDate =
                      suratDate &&
                      !Number.isNaN(suratDate.getTime()) &&
                      suratDate > today
                        ? suratDate
                        : today;

                    return (
                      <div>
                        {hasError && (
                          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                            <p className="text-xs font-medium leading-5 text-red-600">
                              {errorMessage}
                            </p>
                          </div>
                        )}

                        <DatePickerRange
                          input={input}
                          meta={meta}
                          minDate={minimumDate}
                          className="w-full"
                        />
                      </div>
                    );
                  }}
                </Field>
              </div>
            </section>

            <div className="min-w-0 space-y-5">
              {/* Tujuan */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FiMapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Tujuan Perjalanan
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Pilih satu atau beberapa kabupaten/kota
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <Field
                    name="tujuan"
                    component={MultiSelectTextField}
                    label="Kabupaten/Kota"
                    options={kabkotaOptions}
                    placeholder="Pilih tujuan perjalanan"
                    className="w-full"
                  />

                  {values.tujuan && (
                    <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#eadfbe] bg-[#fbf7ec] px-4 py-3">
                      <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Tujuan terpilih
                        </p>

                        <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
                          {values.tujuan}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
             <FieldArray name="pegawai">
                {({ fields }) => (
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <FiUsers className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Daftar Pegawai
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Pegawai yang mengikuti perjalanan
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => fields.push("")}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#eadfbe] bg-white px-4 text-sm font-bold text-brand shadow-sm transition hover:border-brand hover:bg-[#fbf7ec]"
                      >
                        <FaPlus className="mr-2 h-3.5 w-3.5" />
                        Tambah Pegawai
                      </button>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-160 table-fixed border-collapse">
                        <colgroup>
                          <col className="w-18" />
                          <col />
                          <col className="w-22.5" />
                        </colgroup>

                        <thead>
                          <tr className="bg-[#f1f8f5]">
                            <th className="border-b border-r border-slate-200 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
                              No
                            </th>

                            <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                              Nama Pegawai
                              <span className="ml-1 text-red-500">*</span>
                            </th>

                            <th className="border-b border-slate-200 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {fields.map((name, index) => {
                            const selectedNips = Array.isArray(
                              values.pegawai
                            )
                              ? values.pegawai
                                  .map(getOptionValue)
                                  .filter(Boolean)
                              : [];

                            const currentNip = getOptionValue(
                              values.pegawai?.[index]
                            );

                            const filteredOptions =
                              pegawaiOptions.filter(
                                (option) =>
                                  !selectedNips.includes(option.value) ||
                                  option.value === currentNip
                              );

                            return (
                              <tr
                                key={name}
                                className="align-top transition hover:bg-slate-50/70"
                              >
                                <td className="border-b border-r border-slate-200 px-3 py-5 text-center">
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#fbf7ec] text-xs font-black text-brand">
                                    {index + 1}
                                  </span>
                                </td>

                                <td className="border-b border-r border-slate-200 p-3">
                                  <Field
                                    name={name}
                                    component={SelectField}
                                    options={filteredOptions}
                                    placeholder="Pilih pegawai"
                                    className="w-full"
                                  />
                                </td>

                                <td className="border-b border-slate-200 px-3 py-5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                    aria-label={`Hapus pegawai ${
                                      index + 1
                                    }`}
                                    title="Hapus pegawai"
                                  >
                                    <FaRegTrashAlt className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {!fields.length && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-5 py-10 text-center"
                              >
                                <div className="mx-auto max-w-sm">
                                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <FiUsers className="h-5 w-5" />
                                  </div>

                                  <p className="mt-3 text-sm font-bold text-slate-700">
                                    Belum ada pegawai
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Klik “Tambah Pegawai” untuk menambahkan
                                    peserta perjalanan.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer */}
                    {fields.length > 0 && (
                      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                        <p className="text-xs text-slate-500">
                          Total pegawai
                        </p>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                          {fields.length}
                        </span>
                      </div>
                    )}
                  </section>
                )}
              </FieldArray>
            </div>
          </div>

          {/* Action */}
          <footer className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto sm:min-w-36"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-[#b5964f] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
            >
              {submitting
                ? "Menyimpan..."
                : "Simpan Penugasan"}
            </button>
          </footer>
        </form>
      )}
    </Form>
  );
}