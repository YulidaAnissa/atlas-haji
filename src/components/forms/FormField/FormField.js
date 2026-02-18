import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TooltipInfo from '../../elements/TooltipInfo';
import cloneChildren from '@/utils/cloneChildern';
import { AlertDangerIcon, ErrorOutlineIcon, InfoTriangleIcon, VerificationCheckIcon } from '../../elements/Icons';

function FormField(props) {
  const { 
    label, 
    // meta : { touched, error, submitError: metaSubmitError, dirtySinceLastSubmit },
    meta: {
      touched,
      error,
      submitError: metaSubmitError,
      dirtySinceLastSubmit
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

  const submitError = (!dirtySinceLastSubmit ? metaSubmitError : null);
  const errors = submitError || error || [];
  const haveErrors = !!errors?.length || submitError

  const childrenProps = {
    ...input,
    ...inputProps,
    label,
    errors,
    errorposition: errorPosition,
    error: !!(touched && haveErrors)
  };

  const renderTooltipInfo = (content) => (
    <TooltipInfo 
      className="mr-2"
      content={content}
      contentClassName="max-w-full"
      error
    />
  );

  const renderVerified = (verified) => {

    if (verified) {
      return (
        <div className="text-2xs leading-4 border-[#BBDEFF] rounded-full border px-1 ml-2 flex items-center justify-center"> 
          <VerificationCheckIcon/> 
          <p className="px-1 pt-0.5">Sudah diverifikasi</p> 
        </div>
      );
    } else {
      return (
        <div className="text-2xs leading-4 border-[#FDA29B] rounded-full border px-1 ml-2 flex items-center justify-center bg-[#FFEFEB]"> 
          <AlertDangerIcon/> 
          <p className="px-1 pt-0.5">Belum diverifikasi</p> 
        </div>
      );
    }
  
  };


  return (
    <div className={clsx('flex flex-col', className)}>
      { !noLabel &&
        <label 
          className={clsx(
            'mb-1 text-xs sm:text-base tracking-wide text-gray-800 font-semibold flex',
            { 'sr-only': hideLabel }
          )}
          htmlFor={input.name}
        >
          {label}
          {primary && <p className="text-red-600">*</p>}
          {withVerification && renderVerified(isVerified)}
        </label>
      }
      {errorPosition === 'top' && (
        <div className="mt-1 min-h-5 mb-3">
          {(helperText && (!haveErrors || !touched)) && <p className="text-gray-400 text-xs leading-5">{helperText}</p>}
          {renderError && renderError({ errors, touched, value: input.value })}
          {(!renderError && touched && haveErrors) && 
            <p className="text-danger text-sm font-medium leading-5 flex items-center">
              <ErrorOutlineIcon className="mr-2" />
              {Array.isArray(errors) && errors[0].info && renderTooltipInfo(errors[0].info) }
              {Array.isArray(errors) ? errors[0].message : errors }
            </p>
          }  
        </div>
      )}
      <div>
        {cloneChildren(
          children, 
          { ...childrenProps }
        )}
      </div>
      {errorPosition === 'bottom' && (
        <div className="mt-1 min-h-1">
          {(helperText && (!haveErrors || !touched)) && <p className="text-gray-400 text-xs leading-5">{helperText}</p>}
          {renderError && renderError({ errors, touched, value: input.value })}
          {(!renderError && touched && haveErrors) && 
            <p className="text-danger text-xs leading-5 flex items-center">
              {showErrorIcon && <InfoTriangleIcon className="mr-2" fill="currentColor" />}
              {Array.isArray(errors) && errors[0].info && renderTooltipInfo(errors[0].info) }
              {Array.isArray(errors) ? errors[0].message : errors }
            </p>
          }  
        </div>
      )}
    </div>
  );
}

FormField.defaultProps = {
  className: '',
  errorPosition: "bottom",
  helperText: '',
  hideLabel: false,
  input: {},
  isVerified: false,
  label: '',
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
  errorPosition: PropTypes.oneOf(['bottom', 'top', 'inside']),
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
