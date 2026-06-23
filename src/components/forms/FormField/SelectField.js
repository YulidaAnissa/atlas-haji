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
      minHeight:
        state.selectProps.size === "small" ? 40 : 46,
      borderRadius: 7,
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
          ? "#2563eb"
          : "#d1d5db",
      backgroundColor: state.isDisabled
        ? "#f3f4f6"
        : "#ffffff",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(37, 99, 235, 0.12)"
        : "0 1px 2px rgba(15, 23, 42, 0.04)",
      cursor: state.isDisabled
        ? "not-allowed"
        : "pointer",
      transition: "all 160ms ease",

      "&:hover": {
        borderColor: hasError
          ? "#ef4444"
          : "#2563eb",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      paddingInline: 14,
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "#111827",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: 14,
    }),

    singleValue: (base, state) => ({
      ...base,
      color: state.isDisabled
        ? "#9ca3af"
        : "#111827",
      fontSize: 14,
      fontWeight: 500,
    }),

    dropdownIndicator: (base, state) => ({
      ...base,
      paddingInline: 10,
      color: state.isFocused
        ? "#2563eb"
        : "#9ca3af",
      transition: "all 160ms ease",

      "&:hover": {
        color: "#2563eb",
      },
    }),

    clearIndicator: (base) => ({
      ...base,
      paddingInline: 8,
      color: "#9ca3af",

      "&:hover": {
        color: "#ef4444",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
      marginTop: 6,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      backgroundColor: "#ffffff",
      boxShadow:
        "0 16px 40px rgba(15, 23, 42, 0.18)",
    }),

    menuList: (base) => ({
      ...base,
      maxHeight: 240,
      padding: 6,
    }),

    option: (base, state) => ({
      ...base,
      padding: "10px 12px",
      borderRadius: 10,
      color: state.isSelected
        ? "#ffffff"
        : "#374151",
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "#ffffff",
      fontSize: 14,
      fontWeight: state.isSelected ? 600 : 500,
      cursor: "pointer",

      "&:active": {
        backgroundColor: state.isSelected
          ? "#2563eb"
          : "#dbeafe",
      },
    }),

    noOptionsMessage: (base) => ({
      ...base,
      padding: 12,
      color: "#6b7280",
      fontSize: 14,
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
        value={
          options.find(
            (option) => option.value === input.value
          ) || null
        }
        onChange={(option) =>
          input.onChange(option ? option.value : null)
        }
        onBlur={() => input.onBlur(input.value)}
        isClearable
        isSearchable
        placeholder={rest.placeholder || "Pilih data..."}
        noOptionsMessage={() => "Data tidak ditemukan"}
        menuPosition="fixed"
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        menuPortalTarget={
          typeof document !== "undefined"
            ? document.body
            : null
        }
      />
    </FormField>
  );
}

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectField;