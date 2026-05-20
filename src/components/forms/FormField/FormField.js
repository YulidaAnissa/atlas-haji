import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import TooltipInfo from "../../elements/TooltipInfo";
import cloneChildren from "@/utils/cloneChildern";
import {
  AlertDangerIcon,
  ErrorOutlineIcon,
  InfoTriangleIcon,
  VerificationCheckIcon,
} from "../../elements/Icons";

function VerificationBadge({ verified }) {
  return (
    <span
      className={clsx(
        "ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium leading-4",
        verified
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {verified ? <VerificationCheckIcon /> : <AlertDangerIcon />}
      {verified ? "Sudah diverifikasi" : "Belum diverifikasi"}
    </span>
  );
}

function FieldMessage({
  helperText,
  errors,
  touched,
  haveErrors,
  renderError,
  value,
  showErrorIcon,
  errorPosition,
}) {
  const errorItem = Array.isArray(errors) ? errors[0] : errors;
  const errorMessage = Array.isArray(errors) ? errors[0]?.message : errors;
  const errorInfo = Array.isArray(errors) ? errors[0]?.info : null;

  if (renderError) {
    return renderError({ errors, touched, value });
  }

  if (touched && haveErrors) {
    return (
      <p
        className={clsx(
          "flex items-center text-danger",
          errorPosition === "top"
            ? "text-sm font-medium leading-5"
            : "text-xs leading-5"
        )}
      >
        {errorPosition === "top" && <ErrorOutlineIcon className="mr-2" />}
        {errorPosition === "bottom" && showErrorIcon && (
          <InfoTriangleIcon className="mr-2" fill="currentColor" />
        )}

        {errorInfo && (
          <TooltipInfo
            className="mr-2"
            content={errorInfo}
            contentClassName="max-w-full"
            error
          />
        )}

        {errorMessage || errorItem}
      </p>
    );
  }

  if (helperText) {
    return <p className="text-xs leading-5 text-gray-400">{helperText}</p>;
  }

  return null;
}

function FormField(props) {
  const {
    label,
    meta: {
      touched,
      error,
      submitError: metaSubmitError,
      dirtySinceLastSubmit,
    } = {},
    helperText,
    children,
    noLabel,
    hideLabel,
    input = {},
    className,
    renderError,
    primary,
    errorPosition = "bottom",
    showErrorIcon,
    withVerification,
    isVerified,
    ...inputProps
  } = props;

  const submitError = !dirtySinceLastSubmit ? metaSubmitError : null;
  const errors = submitError || error || [];
  const haveErrors = Array.isArray(errors) ? errors.length > 0 : !!errors;
  const showError = touched && haveErrors;

  const childrenProps = {
    ...input,
    ...inputProps,
    label,
    errors,
    errorposition: errorPosition,
    error: showError,
  };

  const messageProps = {
    helperText,
    errors,
    touched,
    haveErrors,
    renderError,
    value: input.value,
    showErrorIcon,
    errorPosition,
  };

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {!noLabel && (
        <label
          htmlFor={input.name}
          className={clsx(
            "flex items-center text-sm font-semibold tracking-wide text-gray-800",
            { "sr-only": hideLabel }
          )}
        >
          <span>{label}</span>

          {primary && <span className="ml-1 text-red-600">*</span>}

          {withVerification && <VerificationBadge verified={isVerified} />}
        </label>
      )}

      {errorPosition === "top" && (
        <div className="min-h-5">
          <FieldMessage {...messageProps} />
        </div>
      )}

      <div
        className={clsx(
          "relative",
          showError && "rounded-lg ring-1 ring-danger/20"
        )}
      >
        {cloneChildren(children, childrenProps)}
      </div>

      {errorPosition === "bottom" && (
        <div className="min-h-4">
          <FieldMessage {...messageProps} />
        </div>
      )}
    </div>
  );
}

VerificationBadge.propTypes = {
  verified: PropTypes.bool,
};

FieldMessage.propTypes = {
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  errorPosition: PropTypes.oneOf(["bottom", "top", "inside"]),
  haveErrors: PropTypes.bool,
  helperText: PropTypes.string,
  renderError: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  showErrorIcon: PropTypes.bool,
  touched: PropTypes.bool,
  value: PropTypes.any,
};

FormField.defaultProps = {
  className: "",
  errorPosition: "bottom",
  helperText: "",
  hideLabel: false,
  input: {},
  isVerified: false,
  label: "",
  meta: {},
  noLabel: false,
  primary: false,
  renderError: null,
  showErrorIcon: false,
  withVerification: false,
};

FormField.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  errorPosition: PropTypes.oneOf(["bottom", "top", "inside"]),
  helperText: PropTypes.string,
  hideLabel: PropTypes.bool,
  input: PropTypes.object,
  isVerified: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  meta: PropTypes.object,
  noLabel: PropTypes.bool,
  primary: PropTypes.bool,
  renderError: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  showErrorIcon: PropTypes.bool,
  withVerification: PropTypes.bool,
};

export default FormField;