import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import Select from "react-select";
import FormField from "./FormField"; // komponen wrapper label+error
import { useForm } from 'react-final-form';

// Komponen SelectField
function SelectField({ input, options, ...rest }) {
  const form = useForm();
  const handleClearFieldState = () => {
    form.resetFieldState(input?.name);
    input?.onChange('');
  };
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      borderRadius: "0.5rem", // rounded-lg
      height: state.selectProps.size === "small" ? "h-6" : "h-10", // h-9 / h-12
      border: state.isFocused
        ? "1px solid #2563eb" // border-blue-600
        : state.selectProps.error
        ? "1px solid #dc2626" // border-danger
        : "1px solid #000000", // default border
      backgroundColor: state.selectProps.disabled
        ? "#e5e7eb" // bg-black-200
        : "#fff",
      color: state.selectProps.disabled ? "#9ca3af" : "#1f2937", // text-black-400 / text-gray-800
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#2563eb" : "#000000",
      },
      paddingLeft: "0.5rem", // px-4
      fontSize: state.selectProps.size === "small" ? "0.875rem" : "1rem", // text-xs / text-base
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af", // placeholder-gray-400
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1f2937", // text-gray-800
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingRight: "0.75rem",
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingRight: "0.75rem",
    }),
    menu: (base, state) => ({
      ...base,
      fontSize: state.selectProps.size === "small" ? "0.875rem" : "1rem",
    })
  };

  return (
    <FormField onClear={handleClearFieldState} {...rest} className="p-2">
      <Select
        {...rest}
        styles={customSelectStyles}
        options={options}
        size="small"
        value={options.find(opt => opt.value === input.value) || null}
        onChange={opt => input.onChange(opt ? opt.value : null)}
        onBlur={() => input.onBlur(input.value)}
        isClearable
        isSearchable
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