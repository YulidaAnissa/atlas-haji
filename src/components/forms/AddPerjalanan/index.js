"use client";

import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { DatePickerRange, DatePicker, UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import CreateableSelect from "../FormField/CreateableSelect";
import validation from "./validate";

export default function LoginPage({
  onSubmit = () => {},
  kabkota = [],
  pegawai = [],
  pejabat = [],
  st = [],
}) {
  const [kabkotaOptions, setKabKotaOptions] = useState([]);
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [pejabatOptions, setPejabatOptions] = useState([]);
  const [noSuratOptions, setSuratOptions] = useState([]);
  const [isExistingSurat, setIsExistingSurat] = useState(false);

  console.log(st, "st");
  useEffect(() => {
    if (Array.isArray(kabkota)) {
      setKabKotaOptions(
        kabkota.map((item) => ({
          value: item.idKabKota,
          label: item.kabkota,
        }))
      );
    }

    if (Array.isArray(pegawai)) {
      setPegawaiOptions(
        pegawai.map((item) => ({
          value: item.nip,
          label: `${item.nip} | ${item.nama}`,
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
  }, [kabkota, pegawai, pejabat, st]);

  return (
    <Form onSubmit={onSubmit} mutators={{ ...arrayMutators }} validate={validation}>
      {({ handleSubmit, values, form, submitting }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
        >
          <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Perjalanan Dinas
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
              Form Perjalanan Dinas
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Lengkapi tanggal, tujuan, surat tugas, dan daftar pegawai.
            </p>
          </div>

          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-800">
                  Jadwal Perjalanan
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Pilih tanggal berangkat dan kembali.
                </p>
              </div>

              <Field name="dateRange">
                {({ input, meta }) => (
                  <div>
                    {(meta.touched || meta.submitFailed) && meta.error && (
                      <p className="mb-2 text-xs leading-5 text-danger">
                        {meta.error[0]?.message || meta.error}
                      </p>
                    )}

                    <DatePickerRange input={input} meta={meta} className="w-full" />
                  </div>
                )}
              </Field>
            </aside>

            <div className="min-w-0 space-y-5">
              <section className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Detail Perjalanan
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Tentukan PPK dan tujuan kabupaten/kota.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    name="nip"
                    component={SelectField}
                    label="Pejabat Pembuat Komitmen (PPK)"
                    options={pejabatOptions}
                    className="w-full"
                  />

                  <Field
                    name="tujuan"
                    component={SelectField}
                    label="Tujuan Kabupaten/Kota"
                    options={kabkotaOptions}
                    className="w-full"
                  />
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Surat Tugas
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Pilih surat yang sudah ada atau buat nomor surat baru.
                  </p>
                </div>

                <Field
                  name="noSurat"
                  component={CreateableSelect}
                  label="Nomor Surat"
                  options={noSuratOptions}
                  className="text-left"
                  onChange={(newSurat) => {
                    if (newSurat) {
                      const selected = st.find(
                        (item) =>
                          item.idSurat === newSurat.value ||
                          item.noSurat === newSurat.value
                      );

                      if (selected) {
                        setIsExistingSurat(true);

                        form.change("idSurat", selected.idSurat);
                        form.change("noSurat", selected.noSurat);
                        form.change("tglSurat", selected.tglSurat);
                        form.change("kegiatan", selected.kegiatan);
                        form.change("fileSurat", selected.fileSurat);
                      } else {
                        setIsExistingSurat(false);

                        form.change("idSurat", uuidv4());
                        form.change("noSurat", newSurat.value);
                        form.change("tglSurat", "");
                        form.change("kegiatan", "");
                        form.change("fileSurat", null);

                        setSuratOptions((current) => [...current, newSurat]);
                      }
                    } else {
                      setIsExistingSurat(false);

                      form.change("idSurat", null);
                      form.change("noSurat", "");
                      form.change("tglSurat", "");
                      form.change("kegiatan", "");
                      form.change("fileSurat", null);
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

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    component={DatePicker}
                    label="Tanggal Surat"
                    name="tglSurat"
                    type="text"
                    disabled={isExistingSurat}
                  />
                  <Field
                    component={UploadFile}
                    label="File Surat Tugas"
                    name="fileSurat"
                    disabled={isExistingSurat}
                  />
                </div>

                <Field
                  component={InputField}
                  label="Kegiatan"
                  name="kegiatan"
                  placeholder="Masukkan kegiatan"
                  disabled={isExistingSurat}
                />
              </section>
            </div>
          </div>

          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <section className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Pegawai
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Tambahkan minimal satu pegawai untuk perjalanan ini.
                </p>
              </div>

              <FieldArray name="pegawai">
                {({ fields }) => (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {fields.map((name, index) => {                        
                        const getValue = (item) =>
                          typeof item === "object" && item !== null ? item.value : item;

                        const selectedNips = Array.isArray(values.pegawai)
                          ? values.pegawai.filter(Boolean).map(getValue)
                          : [];

                        const currentValue = getValue(values.pegawai?.[index]);

                        const filteredOptions = pegawaiOptions.filter(
                          (opt) => !selectedNips.includes(opt.value) || opt.value === currentValue
                        );

                        console.log('selectedNips', selectedNips);
                        console.log('filteredOptions', filteredOptions);
                        console.log('values.pegawai', values.pegawai);

                        return (
                          <div
                            key={name}
                            className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[36px_1fr_44px] sm:items-start"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fbf7ec] text-xs font-bold text-brand">
                              {index + 1}
                            </div>

                            <Field
                              name={name}
                              component={SelectField}
                              options={filteredOptions}
                              className="w-full"
                            />

                            <button
                              type="button"
                              onClick={() => fields.remove(index)}
                              className="inline-flex h-10 w-full items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:w-10"
                              aria-label={`Hapus pegawai ${index + 1}`}
                              title="Hapus pegawai"
                            >
                              <FaRegTrashAlt className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {!fields?.value?.length && (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                          Belum ada pegawai dipilih
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Tambahkan minimal satu pegawai untuk perjalanan dinas ini.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#eadfbe] bg-white px-4 text-sm font-bold text-brand transition hover:border-brand hover:bg-[#fbf7ec] sm:w-auto"
                      onClick={() => fields.push("")}
                    >
                      <FaPlus className="mr-2 h-3.5 w-3.5" />
                      Tambah Pegawai
                    </button>
                  </div>
                )}
              </FieldArray>
            </section>
          </div>

          <div className="flex border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:justify-end sm:px-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
            >
              {submitting ? "Menyimpan..." : "Simpan Perjalanan"}
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}