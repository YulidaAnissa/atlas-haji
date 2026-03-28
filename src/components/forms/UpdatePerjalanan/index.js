"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import { DatePickerRange, DatePicker } from "@/components/forms/FormField";
import { v4 as uuidv4 } from 'uuid';
import CreateableSelect from "../FormField/CreateableSelect";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  kabkota = [],
  pejabat = [],
  st = [],
}) {

  console.log("Data di form perjalanan:", data); // Debug: cek data yang diterima oleh form

  const [kabkotaOptions, setKabKotaOptions] = useState([]);
  const [noSuratOptions, setSuratOptions] = useState([]);
  const [pejabatOptions, setPejabatOptions] = useState([]);

  useEffect(() => {
    if (kabkota && Array.isArray(kabkota)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKabKotaOptions(
        kabkota.map(item => ({
          value: item.idKabKota,
          label: item.kabkota 
        }))
      );
    }
    if (pejabat && Array.isArray(pejabat)) {
      setPejabatOptions(
        pejabat.map(item => ({
          value: item.nip,
          label: item.jabatan
        }))
      );
    }
    if (st && Array.isArray(st)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuratOptions(
        st.map(item => ({
          value: item.noSurat,
          label: item.noSurat 
        }))
      );
    }
  }, [kabkota, pejabat, st]);
  return (
    <Form 
      onSubmit={onSubmit}
      initialValues={{
        ...data,
        tujuan: data?.idKabKota || "", // pastikan sesuai key yang dipakai di Field
        dateRange: {
          startDate: data?.tglBerangkat ? new Date(data.tglBerangkat) : new Date(),
          endDate: data?.tglKembali ? new Date(data.tglKembali) : new Date()
        }
      }}
      validate={validation}
    >
      {({ handleSubmit, form }) => (
        <form className="overflow-y-auto max-h-[80vh] flex flex-col w-full" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-10">
            <Field name="dateRange">
              {({ input, meta }) => (
                <>
                  <DatePickerRange
                    input={input}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {meta.error && meta.touched && (
                    <span className="text-red-500 text-sm">{meta.error}</span>
                  )}

                </>
              )}
            </Field>
            <div>
              <Field
                className="text-left col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="nip"
                component={SelectField}
                label="Pejabat Pembuat Komitmen (PPK)"
                options={pejabatOptions}
              />
              <Field
                className="text-left col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="tujuan"
                component={SelectField}
                label="Tujuan Kabupaten/Kota"
                options={kabkotaOptions}
              />
              {/* SUrat Tugas */}
              <Field
                className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left"
                name="noSurat"
                component={CreateableSelect}
                label="Nomor Surat"
                options={noSuratOptions}
                onChange={(newSurat) => {
                  if (newSurat) {
                    const selected = st.find(
                      item => item.idSurat === newSurat.value || item.noSurat === newSurat.value
                    );
                    if (selected) {
                      // ✅ kalau option sudah ada → pakai idSurat
                      form.change("idSurat", selected.idSurat);
                      form.change("noSurat", selected.noSurat);
                      form.change("tglSurat", selected.tglSurat);
                      form.change("kegiatan", selected.kegiatan);
                    } else {
                      // ✨ kalau option baru → simpan noSurat saja
                      form.change("idSurat", uuidv4());
                      form.change("noSurat", newSurat.value);
                      form.change("tglSurat", "");
                      form.change("kegiatan", "");
                      setSuratOptions([...noSuratOptions, newSurat]);
                    }
                  } else {
                    // kalau di-clear → kosongkan semua field
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
                  className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Field
                component={DatePicker}
                label="Tanggal Surat"
                name="tglSurat"
                type="text"
                className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Field
                component={InputField}
                label="Kegiatan"
                name="kegiatan"
                placeholder="Masukkan kegiatan"
              />
            </div>
          </div>
          <div className="flex gap-5 mt-6 sticky bottom-0 bg-white py-3 border-t">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md cursor-pointer transition"
            >
              Simpan
            </button>
            <button
              type="button"
              className="w-full bg-danger text-white py-2 rounded-md cursor-pointer transition"
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