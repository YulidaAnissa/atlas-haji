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

export default function LoginPage({
  onSubmit = () => {},
  kabkota = [],
  pegawai = []
}) {
  
  const [kabkotaOptions, setKabKotaOptions] = useState([]);
  const [pegawaiOptions, setPegawaiOptions] = useState([]);

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
    if (pegawai && Array.isArray(pegawai)) {
      setPegawaiOptions(
        pegawai.map(item => ({
          value: item.nip,
          label: `${item.nip} | ${item.nama}` 
        }))
      );
    }
  }, [kabkota, pegawai]);

  return (
    <Form onSubmit={onSubmit} mutators={{ ...arrayMutators }} validate={validation}>
      {({ handleSubmit, values }) => (
        <form noValidate onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-lg space-y-6">
          <div className="flex gap-6">
            <Field name="dateRange">
              {({ input }) => (
                <>
                  <DatePickerRange
                    input={input}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </>
              )}
            </Field>
            <div className="w-2/3 border border-gray-300 rounded-md p-6">
              <Field
                className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="tujuan"
                component={SelectField}
                label="Tujuan Kabupaten/Kota"
                options={kabkotaOptions}
              />
              <p className="font-lg font-bold my-2">-- Daftar Pegawai --</p>
              
              <FieldArray name="pegawai">
                {({ fields, meta }) => (
                  <div>
                    {fields.map((name, index) => {
                      const selectedNips = Array.isArray(values.pegawai)
                        ? values.pegawai.filter(Boolean)
                        : [];

                      const filteredOptions = pegawaiOptions.filter(
                        (opt) =>
                          !selectedNips.includes(opt.value) ||
                          opt.value === values.pegawai?.[index]
                      );

                      return (
                        <div key={index} className="flex items-center gap-2.5">
                          <Field
                            className="w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            name={name}
                            component={SelectField}
                            label="Nomor Induk Pegawai"
                            options={filteredOptions}
                          />
                          <FaRegTrashAlt
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => fields.remove(index)}
                          />
                        </div>
                      );
                    })}
                    {!fields?.value && (
                      <p className="text-danger leading-5 text-xs">Minimal Pilih 1 Pegawai</p>
                    )}
                    <button
                      type="button"
                      className="bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition"
                      onClick={() => fields.push("")}
                    >
                      Tambah Pegawai
                    </button>
                  </div>
                )}
              </FieldArray>

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md cursor-pointer transition"
          >
            Simpan
          </button>
        </form>
      )}
    </Form>
  );
}