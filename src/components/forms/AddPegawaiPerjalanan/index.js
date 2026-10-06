// ComponentForm.jsx
"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";

import { formatDate } from "@/utils/date";
import validation from "./validate";
import PegawaiBadge from "./PegawaiBadge";
import PegawaiSection from "./PegawaiSection";
import { ScheduleSection, RouteSection } from "./RouteAndScheduleSections";
import { buildFormPayload } from "@/utils/formHelpers";

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
    const rawId = type === "edit" ? perjalananPegawai?.asal : surat?.idKabKota;
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
      pegawai: [{ utama: "", pengikut: [] }],
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
    const payload = buildFormPayload(values);
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
                  {Array.isArray(values.pegawai)
                    ? values.pegawai.filter((p) => p?.utama || p?.value).length
                    : 0}{" "}
                  pegawai utama dipilih
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

              {/* Daftar Pegawai Section */}
              {type === "add" ? (
                <PegawaiSection values={values} pegawaiOptions={pegawaiOptions} />
              ) : (
                <PegawaiBadge
                  nip={perjalananPegawai?.nip}
                  nama={perjalananPegawai?.nama}
                  className="w-full"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
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