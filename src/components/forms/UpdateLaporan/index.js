"use client";

import React, { useMemo, useEffect } from "react";
import { Form, Field } from "react-final-form";

import TextAreaField from "../FormField/TextAreaField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import { UploadFile } from "@/components/forms/FormField";

const noop = () => {};

// Komponen helper untuk membersihkan data jika toggle dimatikan
function ToggleResetWatcher({ values, form }) {
  useEffect(() => {
    if (!values.addBiayaTrans) {
      form.change("biayaTrans", "");
      form.change("tfBiayaTrans", null);
      form.change("buktiTrans", null);
    }
  }, [values.addBiayaTrans, form]);

  useEffect(() => {
    if (!values.addBiayaPeng) {
      form.change("biayaPeng", "");
      form.change("tfBiayaPeng", null);
      form.change("buktiPeng", null);
    }
  }, [values.addBiayaPeng, form]);

  return null;
}

export default function FormPerbaikiLaporan({
  data = {},
  onSubmit,
  onClose = noop,
  pegawai = [], 
  pegawaiTf = []
}) {

  // Opsi Pegawai untuk SelectField
  const pegawaiOptions = useMemo(() => {
    return pegawai.map((item) => ({
      value: item.nip, 
      label: `${item.nip} - ${item.nama}`,
    }));
  }, [pegawai]);

  const pegawaiTfOptions = useMemo(() => {
    return pegawaiTf.map((item) => ({
      value: item.nip, 
      label: `${item.nip} - ${item.nama}`,
    }));
  }, [pegawaiTf]);

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        ...data,
        hasil: data?.hasil || data?.laporan || "",
        spd: data?.spd || null,
        
        // Toggle aktif otomatis jika nilai biaya / bukti tersedia
        addBiayaTrans: Boolean(data?.biayaTrans || data?.buktiTrans),
        addBiayaPeng: Boolean(data?.biayaPeng || data?.buktiPeng),

        // Transportasi Terpisah
        biayaTrans: data?.biayaTrans || "",
        tfBiayaTrans: data?.tfBiayaTrans ? {
          value: data.tfBiayaTrans,
          label: `${data.tfBiayaTrans} - ${data.namaBiayaTrans || ""}`
        } : null,
        buktiTrans: data?.buktiTrans || null,
        
        // Penginapan Terpisah
        biayaPeng: data?.biayaPeng || "",
        tfBiayaPeng: data?.tfBiayaPeng ? {
          value: data.tfBiayaPeng,
          label: `${data.tfBiayaPeng} - ${data.namaBiayaPeng || ""}`
        } : null,
        buktiPeng: data?.buktiPeng || null,
      }}
    >
      {({ handleSubmit, values, form }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex max-h-[85vh] flex-col overflow-hidden bg-slate-50/50"
        >
          {/* Watcher untuk reset state ketika toggle dimatikan */}
          <ToggleResetWatcher values={values} form={form} />

          <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 custom-scrollbar">
            <div className="space-y-6">
              
              {/* Info Pegawai */}
              <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <div className="min-w-0 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Nama
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {data?.nama || "-"}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    NIP
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {data?.nip || "-"}
                  </p>
                </div>
              </section>

              {/* Catatan Perbaikan */}
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    ⚠️
                  </span>
                  <h3 className="text-sm font-bold text-amber-800">Catatan Perbaikan</h3>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-amber-900">
                  {data?.catatan || data?.alasan || "Tidak ada catatan perbaikan."}
                </p>
              </section>

              {/* Laporan Perjalanan */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-800">Laporan Perjalanan</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Perbaiki hasil laporan dan unggah kembali dokumen SPD jika diperlukan.
                  </p>
                </div>

                <div className="space-y-5">
                  <Field
                    component={TextAreaField}
                    label="Hasil Laporan"
                    name="hasil"
                    type="text"
                  />
                  <Field
                    component={UploadFile}
                    label="Surat Perjalanan Dinas"
                    name="spd"
                  />
                </div>
              </section>

              {/* Biaya Perjalanan */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-800">Biaya Perjalanan</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Perbaiki nominal, penanggung biaya, dan bukti pendukung perjalanan.
                  </p>
                </div>

                <div className="rounded-2xl">
                  <div className="grid gap-3 md:grid-cols-2">
                    
                    {/* Kolom Transportasi */}
                    <div className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md">
                      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-500 ring-1 ring-blue-100/50">
                            🚗
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Transportasi</h4>
                            <p className="text-xs text-slate-500">Tiket, bensin, atau travel</p>
                          </div>
                        </div>

                        {/* Toggle Transportasi */}
                        <label className="relative inline-flex cursor-pointer items-center">
                          <Field
                            name="addBiayaTrans"
                            component="input"
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 hover:bg-slate-400 peer-checked:hover:bg-blue-600"></div>
                        </label>
                      </div>

                      {values.addBiayaTrans && (
                        <div className="flex-1 space-y-4 animate-in fade-in duration-300">
                          <Field
                            component={InputField}
                            label="Total Biaya Transportasi"
                            name="biayaTrans"
                            startAdornment={
                              <span className="text-sm font-semibold text-slate-500">Rp</span>
                            }
                            type="number"
                          />
                          <Field
                            name="tfBiayaTrans"
                            component={SelectField}
                            label="Ditanggung Oleh"
                            options={pegawaiTfOptions}
                            className="text-left"
                          />
                          <Field
                            component={UploadFile}
                            label="Bukti Pembayaran / Struk"
                            name="buktiTrans"
                          />
                        </div>
                      )}
                    </div>

                    {/* Kolom Penginapan */}
                    <div className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md">
                      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-500 ring-1 ring-amber-100/50">
                            🏨
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Penginapan</h4>
                            <p className="text-xs text-slate-500">Hotel, mess, atau wisma</p>
                          </div>
                        </div>

                        {/* Toggle Penginapan */}
                        <label className="relative inline-flex cursor-pointer items-center">
                          <Field
                            name="addBiayaPeng"
                            component="input"
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/30 hover:bg-slate-400 peer-checked:hover:bg-amber-600"></div>
                        </label>
                      </div>

                      {values.addBiayaPeng && (
                        <div className="flex-1 space-y-4 animate-in fade-in duration-300">
                          <Field
                            component={InputField}
                            label="Total Biaya Penginapan"
                            name="biayaPeng"
                            startAdornment={
                              <span className="text-sm font-semibold text-slate-500">Rp</span>
                            }
                            type="number"
                          />
                          <Field
                            name="tfBiayaPeng"
                            component={SelectField}
                            label="Ditanggung Oleh"
                            options={pegawaiTfOptions}
                            className="text-left"
                          />
                          <Field
                            component={UploadFile}
                            label="Bukti Inap / Struk"
                            name="buktiPeng"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-10 flex gap-3 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-md">
            <button
              type="button"
              className="inline-flex w-1/3 min-w-25 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={handleClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Simpan Perbaikan
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}