// PegawaiFollowerFields.jsx
"use client";

import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FaPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

import SelectField from "../FormField/SelectField";
import { getOptionValue } from "@/utils/formHelpers";

export default function PegawaiFollowerFields({
  parentName,
  parentIndex,
  values,
  pegawaiOptions,
  allSelectedNips,
}) {
  return (
    <div className="mt-4 ml-11 border-l-2 border-slate-200 pl-4 pt-2">
      <FieldArray name={`${parentName}.pengikut`}>
        {({ fields: followerFields }) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pengikut ({followerFields.length || 0})
              </span>
              <button
                type="button"
                onClick={() => followerFields.push("")}
                className="inline-flex items-center text-xs font-bold text-brand hover:underline"
              >
                <FaPlus className="mr-1 h-3 w-3" /> Tambah Pengikut
              </button>
            </div>

            {/* List Item Pengikut */}
            {followerFields.map((followerName, followerIndex) => {
              const currentFollowerNip = getOptionValue(
                values.pegawai?.[parentIndex]?.pengikut?.[followerIndex]
              );

              const filteredFollowerOptions = pegawaiOptions.filter(
                (opt) =>
                  !allSelectedNips.includes(opt.value) ||
                  opt.value === currentFollowerNip
              );

              return (
                <div key={followerName} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    └ {followerIndex + 1}.
                  </span>
                  <div className="flex-1">
                    <Field
                      name={followerName}
                      component={SelectField}
                      options={filteredFollowerOptions}
                      placeholder="Pilih pengikut"
                      className="w-full bg-white text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => followerFields.remove(followerIndex)}
                    className="text-red-400 hover:text-red-600 p-1 transition-colors"
                    title="Hapus pengikut"
                  >
                    <TiDeleteOutline className="h-6 w-6" />
                  </button>
                </div>
              );
            })}

            {(!followerFields.length || followerFields.length === 0) && (
              <p className="text-xs text-slate-400 italic">
                Belum ada pengikut ditambahkan.
              </p>
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
}

PegawaiFollowerFields.propTypes = {
  parentName: PropTypes.string.isRequired,
  parentIndex: PropTypes.number.isRequired,
  values: PropTypes.object.isRequired,
  pegawaiOptions: PropTypes.array.isRequired,
  allSelectedNips: PropTypes.array.isRequired,
};