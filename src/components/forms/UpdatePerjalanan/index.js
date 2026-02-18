"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { DatePicker, UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import { DatePickerRange } from "@/components/forms/FormField";
import { format } from "date-fns";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  kabkota = []
}) {

  const [kabkotaOptions, setKabKotaOptions] = useState([]);
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
  }, [kabkota]);
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
      {({ handleSubmit }) => (
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
              name="tujuan"
              component={SelectField}
              label="Tujuan Kabupaten/Kota"
              options={kabkotaOptions}
            />
            <Field
              component={InputField}
              label="Kegiatan"
              name="kegiatan"
              type="text"
              className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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