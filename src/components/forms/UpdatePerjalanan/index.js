"use client";

import React, { useMemo, useState } from "react";
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

export default function ComponentFormc({
  data = {},
  onSubmit,
  onClose = false,
  kabkota = [],
  pejabat = [],
  st = [],
}) {
  const [customSuratOptions, setCustomSuratOptions] = useState([]);
  const [isExistingSurat, setIsExistingSurat] = useState(Boolean(data?.idSurat));

  const kabkotaOptions = useMemo(() => {
    return Array.isArray(kabkota)
      ? kabkota.map((item) => ({
          value: item.idKabKota,
          label: item.kabkota,
        }))
      : [];
  }, [kabkota]);

  const pejabatOptions = useMemo(() => {
    return Array.isArray(pejabat)
      ? pejabat.map((item) => ({
          value: item.nip,
          label: item.jabatan,
        }))
      : [];
  }, [pejabat]);

  const baseNoSuratOptions = useMemo(() => {
    return Array.isArray(st)
      ? st
          .filter((item) => item?.idSurat && item?.noSurat)
          .map((item) => ({
            value: item.idSurat,
            label: item.noSurat,
          }))
      : [];
  }, [st]);

  const noSuratOptions = useMemo(() => {
    return [...baseNoSuratOptions, ...customSuratOptions];
  }, [baseNoSuratOptions, customSuratOptions]);

  const selectedSurat = useMemo(() => {
    if (!data?.idSurat || !Array.isArray(st)) return null;

    return (
      st.find(
        (item) =>
          item?.idSurat &&
          String(item.idSurat) === String(data.idSurat)
      ) || null
    );
  }, [st, data?.idSurat]);

  const initialValues = useMemo(
    () => ({
      ...data,

      nip: data?.nip
        ? pejabatOptions.find(
            (item) => String(item.value) === String(data.nip)
          ) || {
            value: data.nip,
            label: data.jabatan || data.nip,
          }
        : null,

      tujuan: data?.idKabKota
        ? kabkotaOptions.find(
            (item) => String(item.value) === String(data.idKabKota)
          ) || {
            value: data.idKabKota,
            label: data.kabkota || data.idKabKota,
          }
        : null,

      idSurat: selectedSurat
        ? {
            value: selectedSurat.idSurat,
            label: selectedSurat.noSurat,
          }
        : data?.idSurat
          ? {
              value: data.idSurat,
              label: data.noSurat || data.idSurat,
            }
          : null,

      noSurat: data?.noSurat || selectedSurat?.noSurat || "",

      tglSurat: data?.tglSurat ? new Date(data.tglSurat) : null,

      kegiatan: data?.kegiatan || "",

      dateRange: {
        startDate: data?.tglBerangkat
          ? new Date(data.tglBerangkat)
          : new Date(),
        endDate: data?.tglKembali ? new Date(data.tglKembali) : new Date(),
        formattedStart: data?.tglBerangkat || null,
        formattedEnd: data?.tglKembali || null,
      },

      file: data?.file || null,
    }),
    [data, pejabatOptions, kabkotaOptions, selectedSurat]
  );

  const formKey = [
    data?.idPerjalanan,
    data?.idSurat,
    data?.noSurat,
    st.length,
    kabkotaOptions.length,
    pejabatOptions.length,
  ].join("-");

  return (
    <Form
      key={formKey}
      onSubmit={onSubmit}
      initialValues={initialValues}
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
                    name="idSurat"
                    component={CreateableSelect}
                    label="Nomor Surat"
                    options={noSuratOptions}
                    onChange={(newSurat) => {
                      if (newSurat) {
                        const selected = st.find(
                          (item) =>
                            item?.idSurat &&
                            String(item.idSurat) === String(newSurat.value)
                        );

                        if (selected) {
                          setIsExistingSurat(true);

                          form.change("idSurat", {
                            value: selected.idSurat,
                            label: selected.noSurat,
                          });
                          form.change("noSurat", selected.noSurat);
                          form.change(
                            "tglSurat",
                            selected.tglSurat ? new Date(selected.tglSurat) : null
                          );
                          form.change("kegiatan", selected.kegiatan || "");
                          form.change("file", selected.file || null);
                        } else {
                          setIsExistingSurat(false);

                          const newIdSurat = uuidv4();

                          const createdOption = {
                            value: newIdSurat,
                            label: newSurat.label || newSurat.value,
                          };

                          form.change("idSurat", createdOption);
                          form.change("noSurat", createdOption.label);
                          form.change("tglSurat", null);
                          form.change("kegiatan", "");
                          form.change("file", null);

                          setCustomSuratOptions((current) => [...current, createdOption]);
                        }
                      } else {
                        setIsExistingSurat(false);

                        form.change("idSurat", null);
                        form.change("noSurat", "");
                        form.change("tglSurat", null);
                        form.change("kegiatan", "");
                        form.change("file", null);
                      }
                    }}
                  />

                  <Field
                    component={DatePicker}
                    label="Tanggal Surat"
                    name="tglSurat"
                    type="text"
                    disabled={isExistingSurat}
                  />

                  <Field
                    component={InputField}
                    label="Kegiatan"
                    name="kegiatan"
                    placeholder="Masukkan kegiatan"
                    disabled={isExistingSurat}
                  />

                  <Field
                    component={UploadFile}
                    label="File Surat Tugas"
                    name="file"
                    disabled={isExistingSurat}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-slate-200 bg-white px-1 py-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70"
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