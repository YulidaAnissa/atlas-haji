"use client";

import React from "react";
import PropTypes from "prop-types";

// Opsi pilihan role bawaan
export const DEFAULT_ROLE_OPTIONS = [
  { label: "User", value: "user", description: "Akses standar ke sistem" },
  { label: "Admin", value: "admin", description: "Akses penuh ke semua fitur" },
  { label: "Finance", value: "finance", description: "Akses fitur keuangan & laporan" },
];

export default function RoleRadioGroup({
  input,
  meta,
  label = "Role Pengguna",
  required = true,
  options = DEFAULT_ROLE_OPTIONS,
}) {
  const hasError = meta?.touched && meta?.error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((item) => {
          const isSelected = input.value === item.value;

          return (
            <label
              key={item.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                isSelected
                  ? "border-brand bg-brand/5 shadow-sm ring-1 ring-brand"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={input.name}
                value={item.value}
                checked={isSelected}
                onChange={() => input.onChange(item.value)}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                className="mt-0.5 h-4 w-4 text-brand focus:ring-brand"
              />
              <div>
                <p className={`text-sm font-bold ${isSelected ? "text-brand" : "text-slate-800"}`}>
                  {item.label}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {hasError && <p className="text-xs font-medium text-red-500">{meta.error}</p>}
    </div>
  );
}

RoleRadioGroup.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  label: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
};