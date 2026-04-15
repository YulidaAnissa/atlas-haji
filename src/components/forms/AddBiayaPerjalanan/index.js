"use client";
import React from "react";
import { Form, Field } from "react-final-form";
import { UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
}) {

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <div className="min-w-3/4 grid grid-cols-2 bg-gray-50 rounded-xl shadow-lg px-6 py-4 text-left mb-4">
        <ol className="relative border-l border-indigo-300 space-y-6">
          <li className="ml-6">
            <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
            <h3 className="font-semibold text-gray-900">Nama</h3>
            <p className="text-sm text-gray-600">{data?.nama}</p>
          </li>
        </ol>
        <ol className="relative border-l border-indigo-300 space-y-6">
          <li className="ml-6">
            <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
            <h3 className="font-semibold text-gray-900">NIP</h3>
            <p className="text-sm text-gray-600">{data?.nip}</p>
          </li>
        </ol>
      </div>
      <Form 
        onSubmit={onSubmit}
        initialValues={{
          biayaTrans: data?.biayaTrans || "",
          buktiTrans: data?.buktiTrans || null, // URL string dari server
          biayaPeng: data?.biayaPeng || "",
          buktiPeng: data?.buktiPeng || null,   // URL string dari server
        }}
      >
        {({ handleSubmit }) => (
          <form className="flex flex-col w-full" noValidate onSubmit={handleSubmit}>
            {/* <div className="grid grid-cols-2 gap-10"> */}
              <Field
                component={InputField}
                label="Biaya Transportasi"
                name="biayaTrans"
                startAdornment={<span className="text-gray-500 text-sm">Rp</span>}
                type="number"
              />
              <Field
                component={UploadFile}
                label="Bukti Pendukung Transportasi"
                name="buktiTrans"
              />
              <Field
                component={InputField}
                label="Biaya Penginapan"
                name="biayaPeng"
                startAdornment={<span className="text-gray-500 text-sm">Rp</span>}
                type="number"
              />
              <Field
                component={UploadFile}
                label="Bukti Pendukung Penginapan"
                name="buktiPeng"
              />
            {/* </div> */}
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
    </div>
  );
}