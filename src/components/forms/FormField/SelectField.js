import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { useForm } from "react-final-form";

import FormField from "./FormField";

function SelectField({ input, options, meta, ...rest }) {
  const form = useForm();

  const handleClearFieldState = () => {
    form.resetFieldState(input?.name);
    input?.onChange("");
  };

  const hasError =
    (meta?.touched || meta?.submitFailed) &&
    (meta?.error || meta?.submitError);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: state.selectProps.size === "small" ? 40 : 46,
      borderRadius: 7,
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
        ? "#2563eb"
        : "#d1d5db",
      backgroundColor: state.isDisabled ? "#f3f4f6" : "#ffffff",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(37, 99, 235, 0.12)"
        : "0 1px 2px rgba(15, 23, 42, 0.04)",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      transition: "all 160ms ease",
      "&:hover": {
        borderColor: hasError ? "#ef4444" : "#2563eb",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      paddingInline: 14,
    }),

    input: (base) => ({
      ...base,
      color: "#111827",
      margin: 0,
      padding: 0,
    }),

    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: 14,
    }),

    singleValue: (base, state) => ({
      ...base,
      color: state.isDisabled ? "#9ca3af" : "#111827",
      fontSize: 14,
      fontWeight: 500,
    }),

    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#2563eb" : "#9ca3af",
      paddingInline: 10,
      transition: "all 160ms ease",
      "&:hover": {
        color: "#2563eb",
      },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
      paddingInline: 8,
      "&:hover": {
        color: "#ef4444",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 30,
      overflow: "hidden",
      borderRadius: 14,
      border: "1px solid #e5e7eb",
      boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
    }),

    menuList: (base) => ({
      ...base,
      padding: 6,
    }),

    option: (base, state) => ({
      ...base,
      borderRadius: 10,
      padding: "10px 12px",
      color: state.isSelected ? "#ffffff" : "#374151",
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#eff6ff"
        : "#ffffff",
      fontSize: 14,
      fontWeight: state.isSelected ? 600 : 500,
      cursor: "pointer",
      "&:active": {
        backgroundColor: state.isSelected ? "#2563eb" : "#dbeafe",
      },
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: "#6b7280",
      fontSize: 14,
      padding: "12px",
    }),
  };

  return (
    <FormField
      onClear={handleClearFieldState}
      {...rest}
      input={input}
      meta={meta}
      className="w-full"
    >
      <Select
        {...rest}
        inputId={input?.name}
        instanceId={input?.name}
        styles={customSelectStyles}
        options={options}
        size="small"
        value={options.find((opt) => opt.value === input.value) || null}
        onChange={(opt) => input.onChange(opt ? opt.value : null)}
        onBlur={() => input.onBlur(input.value)}
        isClearable
        isSearchable
        placeholder={rest.placeholder || "Pilih data..."}
        noOptionsMessage={() => "Data tidak ditemukan"}
      />
    </FormField>
  );
}

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
};

export default SelectField;