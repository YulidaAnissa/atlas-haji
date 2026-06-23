"use client";

import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import InputBase from "../InputBase";
import styles from "./DateField.module.css";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const CustomInput = forwardRef(function CustomInput(
  { error, inputName, inputSize, onClear, disabled, ...props },
  ref
) {
  return (
    <div className={styles.inputWrap}>
      <span className={styles.calendarIcon} aria-hidden="true" />
      <InputBase
        {...props}
        ref={ref}
        name={inputName}
        error={error}
        size={inputSize}
        disabled={disabled}
        clearOnError={!disabled}
        onClear={disabled ? undefined : onClear}
        className={`${styles.input} ${props.className || ""}`}
      />
    </div>
  );
});

CustomInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  inputName: PropTypes.string.isRequired,
  inputSize: PropTypes.string,
  onClear: PropTypes.func.isRequired,
};

export default function DateField({
  input,
  meta,
  label,
  className = "",
  disabled = false,
  maxDate = null,
  minDate = null,
  disableWeekend = false,
  primary = false,
  ...rest
}) {
  const hasError = Boolean(meta?.touched && meta?.error);
  const errorMessage = Array.isArray(meta?.error)
    ? meta.error[0]?.message
    : meta?.error;

  const selectedDate = useMemo(() => {
    if (!input.value) return null;
    return input.value instanceof Date ? input.value : new Date(input.value);
  }, [input.value]);

  const handleClear = (event) => {
    if (disabled) return;

    event?.stopPropagation?.();
    input.onChange(null);
  };

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={input.name}
          className={`text-left text-sm font-semibold tracking-wide ${
            disabled ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {label}
          {primary && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <DatePicker
        id={input.name}
        selected={selectedDate}
        onChange={(date) => {
          if (!disabled) input.onChange(date);
        }}
        onBlur={input.onBlur}
        disabled={disabled}
        dateFormat="dd/MM/yyyy"
        placeholderText={rest.placeholder || "Pilih tanggal"}
        wrapperClassName="w-full"
        popperClassName={styles.popper}
        calendarClassName={styles.calendar}
        showPopperArrow={false}
        maxDate={maxDate}
        minDate={minDate}
        filterDate={(date) => {
          if (!disableWeekend) return true;

          return ![0, 6].includes(date.getDay());
        }}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navButton}
              onClick={decreaseMonth}
              disabled={disabled || prevMonthButtonDisabled}
              aria-label="Bulan sebelumnya"
            >
              ‹
            </button>
            <div className={styles.monthTitle}>
              <strong>{monthNames[date.getMonth()]}</strong>
              <span>{date.getFullYear()}</span>
            </div>
            <button
              type="button"
              className={styles.navButton}
              onClick={increaseMonth}
              disabled={disabled || nextMonthButtonDisabled}
              aria-label="Bulan berikutnya"
            >
              ›
            </button>
          </div>
        )}
        dayClassName={(date) => {
          const isWeekend = [0, 6].includes(date.getDay());
          return isWeekend ? styles.weekend : undefined;
        }}
        customInput={
          <CustomInput
            {...rest}
            error={hasError}
            disabled={disabled}
            inputName={input.name}
            inputSize={rest.size || "small"}
            onClear={handleClear}
          />
        }
      />

      <div className="min-h-4">
        {hasError && (
          <p className="text-xs leading-5 text-danger">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

DateField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  disableWeekend: PropTypes.bool,
  primary: PropTypes.bool,
};