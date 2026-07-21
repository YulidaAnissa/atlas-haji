"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { FaPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { FiUsers } from "react-icons/fi";

import { formatDate } from "@/utils/date";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import PegawaiBadge from "./PegawaiBadge";
import { ScheduleSection, RouteSection } from "./RouteAndScheduleSections";

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
  surat = null,
  onClose = () => {},
  tglSurat = null,
  type = "add",
  perjalananPegawai = null,
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

  const defaultKabKotaOption = useMemo(() => {
    const rawId =
      type === "edit"
        ? perjalananPegawai?.idKabKota ?? surat?.idKabKota
        : surat?.idKabKota;

    if (!rawId) return "";

    return (
      kabkotaOptions.find((opt) => String(opt.value) === String(rawId)) ||
      rawId
    );
  }, [surat, perjalananPegawai, kabkotaOptions, type]);

  const INITIAL_VALUES = useMemo(
    () => ({
      dateRange: null,
      idKabKota: defaultKabKotaOption,
      tujuan: "",
      pegawai: [],
    }),
    [defaultKabKotaOption]
  );

  const getDateOrToday = (date) => (date ? new Date(date) : new Date());

  const INITIAL_VALUES_EDIT = useMemo(
    () => ({
      dateRange: {
        startDate: getDateOrToday(perjalananPegawai?.tglBerangkat),
        endDate: getDateOrToday(perjalananPegawai?.tglKembali),
        formattedStart: formatDate(
          perjalananPegawai?.tglBerangkat,
          "YYYY-MM-DD"
        ),
        formattedEnd: formatDate(
          perjalananPegawai?.tglKembali,
          "YYYY-MM-DD"
        ),
      },
      idKabKota: defaultKabKotaOption,
      tujuan: perjalananPegawai?.tujuan || "",
      pegawai: [
        {
          value: perjalananPegawai?.nip,
          label: perjalananPegawai?.nama,
        },
      ],
    }),
    [perjalananPegawai, defaultKabKotaOption]
  );

  const handleFormSubmit = (values, form) => {
    const payload = {
      dateRange: {
        startDate: values.dateRange?.startDate || null,
        endDate: values.dateRange?.endDate || null,
        formattedStart: values.dateRange?.formattedStart || null,
        formattedEnd: values.dateRange?.formattedEnd || null,
      },

      idKabKota: getOptionValue(values.idKabKota) || "",
      tujuan: String(values.tujuan || "").trim(),

      pegawai: Array.isArray(values.pegawai)
        ? values.pegawai.map(getOptionValue).filter(Boolean)
        : [],
    };

    return onSubmit(payload, form);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      validate={validation}
      mutators={{ ...arrayMutators }}
      initialValues={type === "edit" ? INITIAL_VALUES_EDIT : INITIAL_VALUES}
    >
      {({ handleSubmit, values, submitting }) => (
        <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col">
          {/* Header */}
          {type === "add" && (
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
                    Tentukan jadwal, rute, dan pegawai yang mengikuti perjalanan dinas.
                  </p>
                </div>

                <div className="inline-flex self-start rounded-full border border-[#eadfbe] bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm">
                  {values.pegawai?.filter(Boolean).length || 0} pegawai dipilih
                </div>
              </div>
            </header>
          )}

          <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* Jadwal Section */}
            <ScheduleSection tglSurat={tglSurat} />

            <div className="min-w-0 space-y-5">
              {/* Rute Section */}
              <RouteSection kabkotaOptions={kabkotaOptions} values={values} />

              {/* Daftar Pegawai */}
              {type === "add" ? (
                <FieldArray name="pegawai">
                  {({ fields }) => (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                              const selectedNips = Array.isArray(values.pegawai)
                                ? values.pegawai
                                    .map(getOptionValue)
                                    .filter(Boolean)
                                : [];
                              const currentNip = getOptionValue(
                                values.pegawai?.[index]
                              );
                              const filteredOptions = pegawaiOptions.filter(
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
                                      className="inline-flex items-center justify-center rounded-full text-red-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-700"
                                      aria-label={`Hapus pegawai ${index + 1}`}
                                      title="Hapus pegawai"
                                    >
                                      <TiDeleteOutline className="h-8 w-8" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}

                            {!fields.length && (
                              <tr>
                                <td colSpan={3} className="px-5 py-10 text-center">
                                  <div className="mx-auto max-w-sm">
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                      <FiUsers className="h-5 w-5" />
                                    </div>
                                    <p className="mt-3 text-sm font-bold text-slate-700">
                                      Belum ada pegawai
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      Klik “Tambah Pegawai” untuk menambahkan peserta perjalanan.
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {fields.length > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                          <p className="text-xs text-slate-500">Total pegawai</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                            {fields.length}
                          </span>
                        </div>
                      )}
                    </section>
                  )}
                </FieldArray>
              ) : (
                <PegawaiBadge
                  nip={perjalananPegawai?.nip}
                  nama={perjalananPegawai?.nama}
                  className="w-full"
                />
              )}
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
              {submitting ? "Menyimpan..." : "Simpan Penugasan"}
            </button>
          </footer>
        </form>
      )}
    </Form>
  );
}

ComponentForm.propTypes = {
  onSubmit: PropTypes.func,
  pegawai: PropTypes.array,
  kabkota: PropTypes.array,
  surat: PropTypes.object,
  onClose: PropTypes.func,
  tglSurat: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  type: PropTypes.oneOf(["add", "edit"]),
  perjalananPegawai: PropTypes.object,
};