"use client";

import PropTypes from "prop-types";
import Select from "react-select";
import clsx from "clsx";

export default function MultiSelectTextField({
  input,
  meta,
  label,
  options = [],
  placeholder = "Pilih kabupaten/kota",
  className = "",
}) {
  const selectedNames = String(input.value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const selectedOptions = options.filter((option) =>
    selectedNames.includes(
      String(option.label).trim().toLowerCase()
    )
  );

  const handleChange = (selected) => {
    const textValue = Array.isArray(selected)
      ? selected
          .map((option) => option.label)
          .join(", ")
      : "";

    input.onChange(textValue);
  };

  const hasError = Boolean(
    (meta.touched || meta.submitFailed) && meta.error
  );

  return (
    <div className={clsx("flex flex-col py-1.5", className)}>
      {label && (
        <label className="mb-2 block text-left text-sm font-semibold text-slate-800">
          {label}
        </label>
      )}

      <Select
        isMulti
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions
        name={input.name}
        value={selectedOptions}
        options={options}
        onChange={handleChange}
        onBlur={input.onBlur}
        placeholder={placeholder}
        noOptionsMessage={() => "Kabupaten/kota tidak tersedia"}
        classNamePrefix="multi-select"
        menuPosition="fixed"
        menuPortalTarget={
          typeof document !== "undefined"
            ? document.body
            : null
        }
        size="small"
        styles={{
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
          menu: (base) => ({
            ...base,
            zIndex: 9999,
            marginTop: 6,
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 16px 40px rgba(15, 23, 42, 0.18)",
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
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
          multiValue: (base) => ({
            ...base,
            borderRadius: 7,
            backgroundColor: "#ecfdf5",
            fontSize: 14,
            fontWeight: 700,
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#047857",
            fontSize: 12,
            fontWeight: 700,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#047857",
            borderRadius: "0 8px 8px 0",
            ":hover": {
              color: "#b91c1c",
              backgroundColor: "#fee2e2",
            },
          }),
        }}
      />
      {hasError && (
        <div className="min-h-5">
            <p className="mt-1 text-xs text-danger">
              {Array.isArray(meta.error)
                ? meta.error[0]?.message
                : meta.error}
            </p>
        </div>
      )}
    </div>
  );
}

MultiSelectTextField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};