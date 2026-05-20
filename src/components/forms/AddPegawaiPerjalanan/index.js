"use client";

import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";

import SelectField from "../FormField/SelectField";
import validation from "./validate";

export default function ComponentForm({
  onSubmit = () => {},
  pegawai = [],
  onClose = false,
}) {
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  useEffect(() => {
    if (Array.isArray(pegawai)) {
      setPegawaiOptions(
        pegawai.map((item) => ({
          value: item.nip,
          label: `${item.nip} | ${item.nama}`,
        }))
      );
    }
  }, [pegawai]);

  return (
    <Form onSubmit={onSubmit} validate={validation}>
      {({ handleSubmit, submitting }) => (
        <form
          className="flex w-full flex-col"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="mb-6 rounded-2xl border border-[#eadfbe] bg-[#fbf7ec] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Tambah Pegawai
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-950">
              Pilih Data Pegawai
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pilih pegawai yang akan ditambahkan ke daftar perjalanan dinas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Field
              name="pegawai"
              component={SelectField}
              label="Data Pegawai"
              options={pegawaiOptions}
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white pt-4 sm:flex-row">
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