// components/forms/FormField/DateField.tsx
"use client";
import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputBase from "../InputBase";

export default function DateField({ input, meta, label, ...rest }) {
  return (
    <div className="flex flex-col p-2">
      {label && (
        <label htmlFor={input.name} className="text-sm md:text-base font-semibold text-left mb-1">
          {label}
        </label>
      )}
      <DatePicker
        selected={input.value}
        onChange={(date) => input.onChange(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText={rest.placeholder || "Pilih tanggal"}
        customInput={
          <InputBase
            {...rest}
            error={meta.touched && meta.error}
            name={input.name}
          />
        }
      />
      <div className="mt-1 min-h-1">
        {meta.touched && meta.error && (
          <p className="text-danger text-xs leading-5 flex items-center">
            {typeof meta.error === "string" ? meta.error : meta.error[0].message }
          </p>
        )}
      </div>

    </div>
  );
}

DateField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
};