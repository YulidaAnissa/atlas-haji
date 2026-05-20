import React, { forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { useMergeRefs } from "../../../../hooks";

const sizeClass = {
  small: "min-h-24 text-sm",
  medium: "min-h-32 text-base",
  big: "min-h-40 text-base",
};

const Textarea = forwardRef(function Textarea(props, ref) {
  const {
    error,
    inputClassName,
    name,
    placeholder,
    endAdornment,
    size = "medium",
    disabled,
    ...inputProps
  } = props;

  const inputRef = useRef(null);
  const mergedRef = useMergeRefs([inputRef, ref]);

  return (
    <div className="relative w-full">
      <textarea
        className={clsx(
          "w-full resize-y rounded-xl border bg-white px-4 py-3 font-medium text-gray-900 shadow-sm outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-gray-400",
          sizeClass[size],
          disabled &&
            "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400",
          error
            ? "border-red-500 ring-1 ring-red-100"
            : "border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100",
          endAdornment && "pr-12",
          inputClassName
        )}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={mergedRef}
        rows={4}
        {...inputProps}
      />

      {React.isValidElement(endAdornment) && (
        <div className="pointer-events-none absolute right-3 top-3 text-gray-400">
          {endAdornment}
        </div>
      )}
    </div>
  );
});

Textarea.defaultProps = {
  clearOnError: false,
  disabled: false,
  endAdornment: null,
  error: false,
  inputClassName: "",
  label: "",
  name: "",
  onBlur: () => {},
  onClear: () => {},
  onClick: () => {},
  placeholder: "",
  size: "medium",
};

Textarea.propTypes = {
  clearOnError: PropTypes.bool,
  disabled: PropTypes.bool,
  endAdornment: PropTypes.element,
  error: PropTypes.bool,
  inputClassName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["big", "small", "medium"]),
};

export default Textarea;