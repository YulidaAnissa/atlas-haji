import React, { useState, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import useMergeRefs from "../../../../hooks/useMergeRefs";
import { CloseIcon } from "../../../elements/Icons";

const InputBase = forwardRef(function InputBase(props, ref) {
  const {
    autoComplete,
    className,
    error,
    inputClassName,
    name,
    noBorder,
    onBlur,
    onClear,
    onClick,
    placeholder,
    startAdornment,
    endAdornment,
    size = "small",
    succes,
    clearOnError,
    disabled,
    ...inputProps
  } = props;

  const [focused, setFocused] = useState(false);

  const inputRef = useRef(null);
  const mergedRef = useMergeRefs([inputRef, ref]);

  const hasValue =
    inputProps.value !== undefined &&
    inputProps.value !== null &&
    inputProps.value !== "";

  const isShowClearIcon = clearOnError ? error || hasValue : hasValue;

  const handleInputBlur = (event) => {
    event.stopPropagation();
    setFocused(false);
    onBlur(event);
  };

  const handleInputClick = (event) => {
    event.stopPropagation();
    onClick?.(event);
  };

  const handleWrapperClick = (event) => {
    event.stopPropagation();

    if (disabled) return;

    inputRef.current?.focus();
    inputRef.current?.click();
  };

  const handleClear = (event) => {
    event.stopPropagation();

    if (typeof onClear === "function") {
      onClear(event);
    }

    inputRef.current?.focus();
  };

  return (
    <div
      className={clsx(
        "group flex w-full items-stretch overflow-hidden rounded-lg bg-white transition",
        {
          "min-h-10": size === "small",
          "min-h-12": size === "medium",
          "min-h-14": size === "big",

          border: !noBorder,

          "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400":
            disabled,

          "border-red-500 ring-1 ring-red-100": error && !disabled,

          "border-success ring-1 ring-success/10":
            !error && succes && !disabled,

          "border-brand ring-4 ring-[#c9a961]/20":
            focused && !error && !disabled,

          "border-gray-300 bg-white hover:border-[#c9a961]":
            !focused && !error && !succes && !disabled,
        },
        className
      )}
      onClick={handleWrapperClick}
    >
      {React.isValidElement(startAdornment) && (
        <div
          className={clsx(
            "flex shrink-0 items-center pl-3 text-gray-400",
            focused && !error && !disabled && "text-brand"
          )}
        >
          {startAdornment}
        </div>
      )}

      <input
        autoComplete={autoComplete}
        className={clsx(
          "min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-gray-900 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400",
          {
            "min-h-10": size === "small",
            "min-h-12 text-base": size === "medium",
            "min-h-14 text-base": size === "big",
            "pl-4": !startAdornment,
            "pr-3": true,
          },
          inputClassName
        )}
        disabled={disabled}
        id={name}
        name={name}
        onBlur={handleInputBlur}
        onClick={handleInputClick}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        ref={mergedRef}
        {...inputProps}
      />

      {isShowClearIcon && (
        <button
          type="button"
          className="flex w-10 shrink-0 items-center justify-center text-gray-400 transition hover:bg-gray-50 hover:text-red-500 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={handleClear}
        >
          <CloseIcon />
        </button>
      )}

      {React.isValidElement(endAdornment) && (
        <div
          className={clsx(
            "flex w-11 shrink-0 items-center justify-center border-l border-gray-200 text-gray-400 transition",
            focused && !error && !disabled && "text-brand",
            disabled && "text-gray-300"
          )}
        >
          {endAdornment}
        </div>
      )}
    </div>
  );
});

InputBase.defaultProps = {
  autoComplete: "",
  className: "",
  clearOnError: false,
  disabled: false,
  endAdornment: null,
  error: false,
  inputClassName: "",
  label: "",
  name: "",
  noBorder: false,
  onBlur: () => {},
  onClear: () => {},
  onClick: () => {},
  placeholder: "",
  size: "medium",
  startAdornment: null,
  succes: false,
};

InputBase.propTypes = {
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  clearOnError: PropTypes.bool,
  disabled: PropTypes.bool,
  endAdornment: PropTypes.element,
  error: PropTypes.bool,
  inputClassName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  noBorder: PropTypes.bool,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["big", "small", "medium"]),
  startAdornment: PropTypes.element,
  succes: PropTypes.bool,
};

export default InputBase;