"use client";

import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";

import { UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import TextAreaField from "../FormField/TextAreaField";
import validation from "./validate";

const noop = () => {};

const getDateOrToday = (date) => (date ? new Date(date) : new Date());

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = noop,
  type = "edit",
  pegawai = [],
  pegawaiTf = [],
}) {
  const isAddMode = type === "add";

  // Opsi Pegawai
  const pegawaiOptionsTf = useMemo(() => {
    return pegawaiTf.map((item) => ({
      value: item.nip,
      label: `${item.nip} - ${item.nama}`,
    }));
  }, [pegawaiTf]);

  const pegawaiOptions = useMemo(() => {
    if (!isAddMode) return [];

    return pegawai
      .filter((item) => item.status === "perjalanan")
      .map((item) => ({
        value: item.idPerjalananPegawai,
        label: `${item.nip} | ${item.nama}`,
        id: item.nip,
      }));
  }, [isAddMode, pegawai]);

  const defaultPegawaiValue = pegawaiOptions[0]?.value || "";

  const initialValues = useMemo(
    () => ({
      ...data,
      tujuan: data?.idKabKota || "",
      pegawai: data?.pegawai ?? defaultPegawaiValue,
      hasil: data?.hasil || `Terlaksananya tugas ${data[0]?.kegiatan || ""}`,
      spd: data?.spd || null,

      // Status Toggle Terpisah untuk Transport & Penginapan
      adaBiayaTrans: Boolean(data?.biayaTrans || data?.buktiTrans),
      adaBiayaPeng: Boolean(data?.biayaPeng || data?.buktiPeng),

      tfBiayaTrans: data?.tfBiayaTrans || defaultPegawaiValue,
      tfBiayaPeng: data?.tfBiayaPeng || defaultPegawaiValue,

      biayaTrans: data?.biayaTrans || "",
      buktiTrans: data?.buktiTrans || null,
      biayaPeng: data?.biayaPeng || "",
      buktiPeng: data?.buktiPeng || null,
      dateRange: {
        startDate: getDateOrToday(data?.tglBerangkat),
        endDate: getDateOrToday(data?.tglKembali),
      },
    }),
    [data, defaultPegawaiValue]
  );

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} validate={validation}>
      {({ handleSubmit, values }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex max-h-[85vh] flex-col overflow-hidden bg-slate-50/50"
        >
          {/* Konten Form yang bisa di-scroll */}
          <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 custom-scrollbar">
            <div className="space-y-6">
              {isAddMode && (
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <Field
                    name="pegawai"
                    component={SelectField}
                    label="Data Pegawai"
                    options={pegawaiOptions}
                    className="text-left"
                  />
                </div>
              )}

              {/* Laporan Perjalanan Section */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all">
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-800">Laporan Perjalanan</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Lengkapi hasil laporan dan unggah dokumen Surat Perjalanan Dinas (SPD).
                  </p>
                </div>

                <div className="space-y-5">
                  <Field
                    name="hasil"
                    component={TextAreaField}
                    label="Hasil Laporan"
                    type="text"
                  />
                  <Field
                    name="spd"
                    component={UploadFile}
                    label="Surat Perjalanan Dinas"
                  />
                </div>
              </section>

              {/* --- SECTION 1: BIAYA TRANSPORTASI --- */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-500 ring-1 ring-blue-100/50">
                      🚗
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Biaya Transportasi</h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        Tiket, bensin, atau travel perjalanan dinas.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Transportasi */}
                  <div className="flex items-center rounded-full bg-slate-50 py-1.5 pl-3 pr-1.5 ring-1 ring-slate-200">
                    <span className="mr-3 text-sm font-medium text-slate-600">Ada Transport?</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <Field
                        name="adaBiayaTrans"
                        component="input"
                        type="checkbox"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 hover:bg-slate-400 peer-checked:hover:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {values.adaBiayaTrans && (
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Field
                      name="biayaTrans"
                      component={InputField}
                      label="Total Biaya Transportasi"
                      placeholder="0"
                      startAdornment={
                        <span className="text-sm font-semibold text-slate-500">Rp</span>
                      }
                    />
                    <Field
                      name="tfBiayaTrans"
                      component={SelectField}
                      label="Ditanggung Oleh"
                      options={pegawaiOptionsTf}
                      className="text-left"
                    />
                    <Field
                      name="buktiTrans"
                      component={UploadFile}
                      label="Bukti Pembayaran / Struk Transport"
                    />
                  </div>
                )}
              </section>

              {/* --- SECTION 2: BIAYA PENGINAPAN --- */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-500 ring-1 ring-amber-100/50">
                      🏨
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Biaya Penginapan</h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        Hotel, mess, atau wisma selama perjalanan.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Penginapan */}
                  <div className="flex items-center rounded-full bg-slate-50 py-1.5 pl-3 pr-1.5 ring-1 ring-slate-200">
                    <span className="mr-3 text-sm font-medium text-slate-600">Ada Penginapan?</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <Field
                        name="adaBiayaPeng"
                        component="input"
                        type="checkbox"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/30 hover:bg-slate-400 peer-checked:hover:bg-amber-600"></div>
                    </label>
                  </div>
                </div>

                {values.adaBiayaPeng && (
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Field
                      name="biayaPeng"
                      component={InputField}
                      label="Total Biaya Penginapan"
                      placeholder="0"
                      startAdornment={
                        <span className="text-sm font-semibold text-slate-500">Rp</span>
                      }
                    />
                    <Field
                      name="tfBiayaPeng"
                      component={SelectField}
                      label="Ditanggung Oleh"
                      options={pegawaiOptionsTf}
                      className="text-left"
                    />
                    <Field
                      name="buktiPeng"
                      component={UploadFile}
                      label="Bukti Inap / Struk Penginapan"
                    />
                  </div>
                )}
              </section>

            </div>
          </div>

          {/* Sticky Footer - Glassmorphism */}
          <div className="sticky bottom-0 z-10 flex gap-3 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-1/3 min-w-25 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Simpan Data
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}