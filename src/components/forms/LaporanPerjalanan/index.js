"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import TextAreaField from "../FormField/TextAreaField";
import SelectField from "../FormField/SelectField";
import InputBase from "../FormField/InputBase";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  type = "edit",
  pegawai = [],
}) {
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  
  console.log('pegawai', pegawai);
  useEffect(() => {
    if (type === "add" && pegawai && Array.isArray(pegawai)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPegawaiOptions(
        pegawai.map(item => ({
          value: item.idPerjalananPegawai,
          label: `${item.nip} | ${item.nama}` 
        }))
      );
    }
  }, [pegawai, type]);

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
    >
      {({ handleSubmit }) => (
        <form className="overflow-y-auto max-h-[80vh] flex flex-col" onSubmit={handleSubmit}>
          {type === "add" && (
            <Field
              className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left"
              name="pegawai"
              component={SelectField}
              label="Data Pegawai"
              options={pegawaiOptions}
            />
          )}
          <Field
            component={TextAreaField}
            label="Hasil Laporan"
            name="hasil"
            type="text"
            className="rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
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