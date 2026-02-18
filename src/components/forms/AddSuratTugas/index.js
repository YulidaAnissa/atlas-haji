"use client";
import React from "react";
import { Form, Field } from "react-final-form";
import { DatePicker } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";

export default function ComponentForm({
  onSubmit = () => {},
  onClose = false,
  data = {}
}) {

  return (
    <Form 
      onSubmit={onSubmit}
      initialValues={data}
    >
      {({ handleSubmit }) => (
        <form className="overflow-y-auto max-h-[80vh] flex flex-col" onSubmit={handleSubmit}>
          <Field
            component={InputField}
            label="No Surat Tugas"
            name="noSurat"
            placeholder="Masukkan Nomor Surat Tugas"
            type="text"
            className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Field
            component={DatePicker}
            label="Tanggal Surat"
            name="tglSurat"
            type="text"
            className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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