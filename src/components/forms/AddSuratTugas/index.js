"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";

import { DatePicker } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import CreateableSelect from "../FormField/CreateableSelect";

export default function ComponentForm({
  onSubmit = () => {},
  onClose = false,
  data = [],
  // surat = [
  //   {noSurat: 'ini value 1', tglSurat: '02-02-2026', kegiatan: 'ini kegiatan 1'},
  //   {noSurat: 'ini value 2', tglSurat: '04-04-2026', kegiatan: 'ini kegiatan 2'}
  // ]
}) {
  const [noSuratOptions, setSuratOptions] = useState([]);
  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuratOptions(
        data.map(item => ({
          value: item.noSurat,
          label: item.noSurat 
        }))
      );
    }
  }, [data]);

  return (
    <Form 
      onSubmit={onSubmit}
      initialValues={data}
    >
      {({ handleSubmit, form }) => (
        <form className="overflow-y-auto max-h-[80vh] flex flex-col" onSubmit={handleSubmit}>
          <Field
            className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left"
            name="noSurat"
            component={CreateableSelect}
            label="Nomor Surat"
            options={noSuratOptions}
            onChange={(newSurat) => {
              if (newSurat) {
                const selected = data.find(item => item.noSurat === newSurat.value);
                if (selected) {
                  // isi otomatis field lain
                  form.change("tglSurat", selected.tglSurat);
                  form.change("kegiatan", selected.kegiatan);
                } else {
                  // kalau option baru → kosongkan field lain
                  form.change("tglSurat", "");
                  form.change("kegiatan", "");
                  setSuratOptions([...noSuratOptions, newSurat]);
                }
              } else {
                // kalau di-clear → kosongkan field lain
                form.change("tglSurat", "");
                form.change("kegiatan", "");
              }
            }}
          />
          {/* <Field
            component={InputField}
            label="No Surat Tugas"
            name="noSurat"
            placeholder="Masukkan Nomor Surat Tugas"
            type="text"
            className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          /> */}
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
          <div className="flex gap-5 mt-6 sticky bottom-0 bg-white py-3 border-t">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md cursor-pointer transition"
            >
              Simpan
            </button>
            <button
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