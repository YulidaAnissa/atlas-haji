"use client";
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { DatePickerRange, DatePicker } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import validation from "./validate";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { FaRegTrashAlt } from "react-icons/fa";
import CreateableSelect from "../FormField/CreateableSelect";
import { v4 as uuidv4 } from 'uuid';

export default function LoginPage({
  onSubmit = () => {},
  kabkota = [],
  pegawai = [],
  pejabat = [],
  st = [],
}) {
  
  const [kabkotaOptions, setKabKotaOptions] = useState([]);
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [pejabatOptions, setPejabatOptions] = useState([]);
  const [noSuratOptions, setSuratOptions] = useState([]);

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
    if (pejabat && Array.isArray(pejabat)) {
      setPejabatOptions(
        pejabat.map(item => ({
          value: item.nip,
          label: item.jabatan
        }))
      );
    }
    if (st && Array.isArray(st)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuratOptions(
        st.map(item => ({
          value: item.noSurat,
          label: item.noSurat 
        }))
      );
    }
  }, [kabkota, pegawai, pejabat, st]);

  return (
    <Form onSubmit={onSubmit} mutators={{ ...arrayMutators }} validate={validation}>
      {({ handleSubmit, values, form }) => (
        <form noValidate onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-lg space-y-6">
          <div className="flex gap-6">
            <div>
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
            </div>
            <div className="w-2/3 border border-gray-300 rounded-md p-6">
              <Field
                className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="nip"
                component={SelectField}
                label="Pejabat Pembuat Komitmen (PPK)"
                options={pejabatOptions}
              />
              <Field
                className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                name="tujuan"
                component={SelectField}
                label="Tujuan Kabupaten/Kota"
                options={kabkotaOptions}
              />
              {/* SUrat Tugas */}
              <Field
                className="col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left"
                name="noSurat"
                component={CreateableSelect}
                label="Nomor Surat"
                options={noSuratOptions}
                onChange={(newSurat) => {
                  if (newSurat) {
                    const selected = st.find(
                      item => item.idSurat === newSurat.value || item.noSurat === newSurat.value
                    );
                    if (selected) {
                      // ✅ kalau option sudah ada → pakai idSurat
                      form.change("idSurat", selected.idSurat);
                      form.change("noSurat", selected.noSurat);
                      form.change("tglSurat", selected.tglSurat);
                      form.change("kegiatan", selected.kegiatan);
                    } else {
                      // ✨ kalau option baru → simpan noSurat saja
                      form.change("idSurat", uuidv4());
                      form.change("noSurat", newSurat.value);
                      form.change("tglSurat", "");
                      form.change("kegiatan", "");
                      setSuratOptions([...noSuratOptions, newSurat]);
                    }
                  } else {
                    // kalau di-clear → kosongkan semua field
                    form.change("idSurat", null);
                    form.change("noSurat", "");
                    form.change("tglSurat", "");
                    form.change("kegiatan", "");
                  }
                }}
              />
              <div className="hidden">
                <Field
                  component={InputField}
                  label="No Surat Tugas"
                  disabled
                  name="idSurat"
                  placeholder="Masukkan Nomor Surat Tugas"
                  type="text"
                  className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Field
                component={DatePicker}
                label="Tanggal Surat"
                name="tglSurat"
                type="text"
                className="w-full rounded-md py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Field
                component={InputField}
                label="Kegiatan"
                name="kegiatan"
                placeholder="Masukkan kegiatan"
              />
              {/* Section Pegawai */}
              <h3 className="text-lg font-semibold border-b pb-2">Daftar Pegawai</h3>              
              <FieldArray name="pegawai">
                {({ fields, meta }) => (
                  <div className="space-y-3">
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
                        <div key={index} className="flex items-center justify-between w-full">
                          <Field
                            className="flex-1 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            name={name}
                            component={SelectField}
                            label="Nomor Induk Pegawai"
                            options={filteredOptions}
                            style="width: inherit;"
                          />
                          <FaRegTrashAlt
                            className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700 -mb-3.5"
                            onClick={() => fields.remove(index)}
                          />
                        </div>
                      );
                    })}
                    {!fields?.value && (
                      <p className="text-danger leading-5 text-xs">
                        Minimal Pilih 1 Pegawai
                      </p>
                    )}
                    <button
                      type="button"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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