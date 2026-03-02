"use client";
import React from "react";
import { Form, Field } from "react-final-form";
import InputField from "../FormField/InputField";
import TextareaField from "../FormField/TextAreaField";
import validation from "./validate";

export default function AddKabKotaForm({ onSubmit = () => {}, data = {}, onClose = () => {}, type = "add" }) {
  const totalFields = 3; // jumlah field: nama, uh, alamat

  return (
    <Form onSubmit={onSubmit} validate={validation} initialValues={data}>
      {({ handleSubmit, values }) => {
        // Hitung jumlah field yang sudah diisi
        const filledFields = ["kabkota", "uh", "alamat"].filter(
          (f) => String(values[f] ?? "").trim() !== ""
        ).length;

        const progress = (filledFields / totalFields) * 100;

        return (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl w-full space-y-6"
          >
            {/* Progress Bar */}
            {type === "add" && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-brand h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Progress: {filledFields}/{totalFields} field terisi
                </p>
              </>
            )}
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field
                name="kabkota"
                component={InputField}
                label="Nama Kabupaten / Kota"
                placeholder="Masukkan Nama Kabupaten / Kota"
                className="w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Field
                name="uh"
                component={InputField}
                label="Uang Harian"
                placeholder="Masukkan Uang Harian"
                type="number"
                className="w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="w-full md:col-span-2">
                <Field
                  name="alamat"
                  component={TextareaField}
                  label="Alamat"
                  placeholder="Masukkan Alamat"
                  className="w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              {type === "edit" && (
                <button
                  className="w-full bg-danger text-white py-2 rounded-md cursor-pointer transition"
                  onClick={onClose}
                >
                  Tutup
                </button>
              )}
            </div>
          </form>
        );
      }}
    </Form>
  );
}