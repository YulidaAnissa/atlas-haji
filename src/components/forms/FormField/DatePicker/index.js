"use client";

import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import InputBase from "../InputBase";

export default function DateField({
  input,
  meta,
  label,
  className = "",
  ...rest
}) {
  const hasError = meta?.touched && meta?.error;
  const errorMessage = Array.isArray(meta?.error)
    ? meta.error[0]?.message
    : meta?.error;

  const handleClear = (event) => {
    event?.stopPropagation?.();
    input.onChange(null);
  };

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={input.name}
          className="text-left text-sm font-semibold tracking-wide text-gray-800"
        >
          {label}
        </label>
      )}

      <DatePicker
        selected={input.value || null}
        onChange={(date) => input.onChange(date)}
        onBlur={input.onBlur}
        dateFormat="dd/MM/yyyy"
        placeholderText={rest.placeholder || "Pilih tanggal"}
        wrapperClassName="w-full"
        popperClassName="z-[9999]"
        customInput={
          <InputBase
            {...rest}
            name={input.name}
            error={!!hasError}
            size={rest.size || "small"}
            clearOnError
            onClear={handleClear}
          />
        }
      />

      <div className="min-h-4">
        {hasError && <p className="text-xs leading-5 text-danger">{errorMessage}</p>}
      </div>
    </div>
  );
}

DateField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
};