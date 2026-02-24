"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { DatePicker, UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import { DatePickerRange } from "@/components/forms/FormField";
import { format } from "date-fns";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
}) {

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
        <form className="overflow-y-auto max-h-[80vh] flex flex-col w-full" noValidate onSubmit={handleSubmit}>
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
  );
}