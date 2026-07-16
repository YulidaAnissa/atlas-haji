"use client";

import React from "react";
import { Form, Field } from "react-final-form";
import InputField from "../FormField/InputField";
import validate from "./validate";

export default function UangHarianForm({
  onSubmit,
  onClose,
  data = null,
  type = "add",
}) {
  const isEdit = type === "edit";

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        jenisPegawai: data?.jenisPegawai || "",
        jumlah: data?.jumlah || "",
      }}
      validate={validate} // 💡 Tetap direferensikan di sini
    >
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isEdit ? "Ubah Data Uang Harian" : "Tambah Data Uang Harian"}
          </h2>

          <Field
            name="jenisPegawai"
            component={InputField}
            label="Jenis / Golongan Pegawai"
            placeholder="Contoh: PNS Golongan IV, Pegawai Kontrak, PPK"
          />

          <Field
            name="jumlah"
            component={InputField}
            type="number"
            label="Jumlah Uang Harian (Rp)"
            placeholder="Contoh: 430000"
          />

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brand text-sm font-bold text-white shadow-md hover:bg-[#b5964f] disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}