"use client";

import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { v4 as uuidv4 } from "uuid";

import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import CreateableSelect from "../FormField/CreateableSelect";
import validation from "./validate";
import {
  DatePickerRange,
  DatePicker,
  UploadFile,
} from "@/components/forms/FormField";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  kabkota = [],
  pejabat = [],
  st = [],
}) {
  const [kabkotaOptions, setKabKotaOptions] = useState([]);
  const [noSuratOptions, setSuratOptions] = useState([]);
  const [pejabatOptions, setPejabatOptions] = useState([]);

  useEffect(() => {
    if (Array.isArray(kabkota)) {
      setKabKotaOptions(
        kabkota.map((item) => ({
          value: item.idKabKota,
          label: item.kabkota,
        }))
      );
    }

    if (Array.isArray(pejabat)) {
      setPejabatOptions(
        pejabat.map((item) => ({
          value: item.nip,
          label: item.jabatan,
        }))
      );
    }

    if (Array.isArray(st)) {
      setSuratOptions(
        st.map((item) => ({
          value: item.noSurat,
          label: item.noSurat,
        }))
      );
    }
  }, [kabkota, pejabat, st]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        ...data,
        tujuan: data?.idKabKota || "",
        dateRange: {
          startDate: data?.tglBerangkat
            ? new Date(data.tglBerangkat)
            : new Date(),
          endDate: data?.tglKembali ? new Date(data.tglKembali) : new Date(),
        },
        file: data?.file || null,
      }}
      validate={validation}
    >
      {({ handleSubmit, form, submitting }) => (
        <form
          className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl bg-white"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="overflow-y-auto px-1 pb-4">
            <div className="mb-6 rounded-2xl border border-[#eadfbe] bg-[#fbf7ec] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                Form Perjalanan Dinas
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">
                Data Surat dan Tujuan
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lengkapi periode perjalanan, pejabat PPK, tujuan, dan dokumen
                surat tugas.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-800">
                    Periode Perjalanan
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Pilih tanggal berangkat dan kembali.
                  </p>
                </div>

                <Field name="dateRange">
                  {({ input, meta }) => (
                    <>
                      <DatePickerRange input={input} />

                      <div className="min-h-5">
                        {meta.error && meta.touched && (
                          <p className="mt-2 text-xs leading-5 text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </Field>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-sm font-bold text-slate-800">
                    Informasi Surat Tugas
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Pilih surat yang sudah ada atau buat nomor surat baru.
                  </p>
                </div>

                <div className="space-y-4">
                  <Field
                    name="nip"
                    component={SelectField}
                    label="Pejabat Pembuat Komitmen (PPK)"
                    options={pejabatOptions}
                  />

                  <Field
                    name="tujuan"
                    component={SelectField}
                    label="Tujuan Kabupaten/Kota"
                    options={kabkotaOptions}
                  />

                  <Field
                    name="noSurat"
                    component={CreateableSelect}
                    label="Nomor Surat"
                    options={noSuratOptions}
                    onChange={(newSurat) => {
                      if (newSurat) {
                        const selected = st.find(
                          (item) =>
                            item.idSurat === newSurat.value ||
                            item.noSurat === newSurat.value
                        );

                        if (selected) {
                          form.change("idSurat", selected.idSurat);
                          form.change("noSurat", selected.noSurat);
                          form.change("tglSurat", selected.tglSurat);
                          form.change("kegiatan", selected.kegiatan);
                        } else {
                          form.change("idSurat", uuidv4());
                          form.change("noSurat", newSurat.value);
                          form.change("tglSurat", "");
                          form.change("kegiatan", "");
                          setSuratOptions((current) => [
                            ...current,
                            newSurat,
                          ]);
                        }
                      } else {
                        form.change("idSurat", null);
                        form.change("noSurat", "");
                        form.change("tglSurat", "");
                        form.change("kegiatan", "");
                      }
                    }}
                  />

                  <div className="hidden">
                    <Field
                      component={InputField}
                      label="No Surat Tugas"
                      disabled
                      name="idSurat"
                      placeholder="Masukkan Nomor Surat Tugas"
                      type="text"
                    />
                  </div>

                  <Field
                    component={DatePicker}
                    label="Tanggal Surat"
                    name="tglSurat"
                    type="text"
                  />

                  <Field
                    component={InputField}
                    label="Kegiatan"
                    name="kegiatan"
                    placeholder="Masukkan kegiatan"
                  />

                  <Field
                    component={UploadFile}
                    label="File Surat Tugas"
                    name="file"
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-slate-200 bg-white px-1 py-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}