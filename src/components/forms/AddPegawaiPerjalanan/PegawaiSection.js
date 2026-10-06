// PegawaiSection.jsx
"use client";

import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FaPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { FiUsers } from "react-icons/fi";

import SelectField from "../FormField/SelectField";
import PegawaiFollowerFields from "./PegawaiFollowerFields";
import { getOptionValue } from "@/utils/formHelpers";

export default function PegawaiSection({ values, pegawaiOptions }) {
  return (
    <FieldArray name="pegawai">
      {({ fields }) => {
        // Dapatkan semua NIP terpilih untuk mencegah duplikasi pilihan
        const allSelectedNips = Array.isArray(values.pegawai)
          ? values.pegawai
              .flatMap((p) => [
                getOptionValue(p?.utama),
                ...(Array.isArray(p?.pengikut)
                  ? p.pengikut.map(getOptionValue)
                  : []),
              ])
              .filter(Boolean)
          : [];

        return (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FiUsers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daftar Pegawai & Pengikut
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Pegawai utama beserta pengikut perjalanan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fields.push({ utama: "", pengikut: [] })}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#eadfbe] bg-white px-4 text-sm font-bold text-brand shadow-sm transition hover:border-brand hover:bg-[#fbf7ec]"
              >
                <FaPlus className="mr-2 h-3.5 w-3.5" />
                Tambah Pegawai Utama
              </button>
            </div>

            {/* List Item Pegawai Utama */}
            <div className="p-4 space-y-4">
              {fields.map((name, index) => {
                const currentUtamaNip = getOptionValue(
                  values.pegawai?.[index]?.utama
                );

                const filteredUtamaOptions = pegawaiOptions.filter(
                  (opt) =>
                    !allSelectedNips.includes(opt.value) ||
                    opt.value === currentUtamaNip
                );

                return (
                  <div
                    key={name}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-2xs transition hover:border-slate-300"
                  >
                    {/* Pegawai Utama Row */}
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fbf7ec] text-xs font-black text-brand">
                        {index + 1}
                      </span>

                      <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">
                          Pegawai Utama <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name={`${name}.utama`}
                          component={SelectField}
                          options={filteredUtamaOptions}
                          placeholder="Pilih pegawai utama"
                          className="w-full bg-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => fields.remove(index)}
                        className="mt-6 inline-flex items-center justify-center rounded-full text-red-500 transition hover:bg-red-100 hover:text-red-700 p-1"
                        title="Hapus Pegawai Utama"
                      >
                        <TiDeleteOutline className="h-8 w-8" />
                      </button>
                    </div>

                    {/* Sub-Section Pengikut */}
                    <PegawaiFollowerFields
                      parentName={name}
                      parentIndex={index}
                      values={values}
                      pegawaiOptions={pegawaiOptions}
                      allSelectedNips={allSelectedNips}
                    />
                  </div>
                );
              })}

              {(!fields.length || fields.length === 0) && (
                <div className="px-5 py-10 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FiUsers className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-700">
                      Belum ada pegawai
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Klik “Tambah Pegawai Utama” untuk menambahkan peserta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Total */}
            {fields.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                <p className="text-xs text-slate-500">Total Pegawai Utama</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                  {fields.length}
                </span>
              </div>
            )}
          </section>
        );
      }}
    </FieldArray>
  );
}

PegawaiSection.propTypes = {
  values: PropTypes.object.isRequired,
  pegawaiOptions: PropTypes.array.isRequired,
};
