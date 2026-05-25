import React, { forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { useMergeRefs } from "../../../../hooks";

const sizeClass = {
  small: "min-h-24 text-sm",
  medium: "min-h-32 text-sm",
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
          "w-full resize-y rounded-xl border px-4 py-3 font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-slate-400",
          "bg-white",
          sizeClass[size],
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-200 hover:border-[#d8c58b] focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15",
          error &&
            "border-red-400 bg-red-50/40 text-slate-900 focus:border-red-500 focus:ring-red-100",
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
        <div className="pointer-events-none absolute right-3 top-3 text-slate-400">
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