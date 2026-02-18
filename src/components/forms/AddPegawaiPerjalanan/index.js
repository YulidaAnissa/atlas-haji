"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { DatePickerRange } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { FaRegTrashAlt } from "react-icons/fa";

export default function ComponentForm({
  onSubmit = () => {},
  pegawai = [],
  onClose = false
}) {
  
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

  useEffect(() => {
    if (pegawai && Array.isArray(pegawai)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPegawaiOptions(
        pegawai.map(item => ({
          value: item.nip,
          label: `${item.nip} | ${item.nama}` 
        }))
      );
    }
  }, [pegawai]);

  return (
    <Form onSubmit={onSubmit} validate={validation}>
      {({ handleSubmit, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Field
            className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left"
            name="pegawai"
            component={SelectField}
            label="Data Pegawai"
            options={pegawaiOptions}
          />
          <div className="flex gap-5 mt-6 border-t py-3">
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