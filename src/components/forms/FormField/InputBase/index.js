import React, { useState, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useMergeRefs from '../../../../hooks/useMergeRefs';
import { CloseIcon } from '../../../elements/Icons';

const InputBase = forwardRef(function Input(props, ref) {
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
    size = 'small',
    succes,
    clearOnError,
    disabled,
    ...inputProps
  } = props;
  const [ focused, setFocused ] = useState(false);

  const inputRef = useRef();
  const mergedRef = useMergeRefs([inputRef, ref]);

  const isShowClearIcon = (error && clearOnError);

  const handleInputBlur = (e) => {
    e.stopPropagation();
    setFocused(false);
    onBlur(e);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    setFocused(true);
    onClick?.(e);
  };

  const handleWapperClick = (e) => {
    e.stopPropagation();
    inputRef.current.click();
    inputRef.current.focus();
  };

  return (
    <div 
      className={clsx(
        'flex items-center rounded-lg overflow-hidden',
        { 
          'h-12': size === 'medium',
          'h-9': size === 'small',
          'border border-blue-600': !error && focused,
          'border': !noBorder,
          'border border-danger bg-danger bg-opacity-5': error,
          'border border-success bg-success bg-opacity-5': !error && succes,
          'border bg-black-200 text-black-400': !inputClassName?.includes('bg-') && disabled,
        },
        className
      )}
      onClick={handleWapperClick}
    >

      {React.isValidElement(startAdornment) ? (
        <div className="h-full mr-3 -ml-1 flex items-center">
          {startAdornment}
        </div>
      ): null } 

      <input 
        autoComplete={autoComplete}
        className={clsx(
          'w-full h-10 px-4 text-base text-gray-800 placeholder-gray-400 bg-white rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400',
          {
            'text-xs md:text-sm': size === 'small',
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

      {isShowClearIcon ? (
        <div className="h-full ml-3 flex items-center p-1.5">
          <button onClick={onClear} type="button">
            <CloseIcon />
          </button>
        </div>
      ): null }

      {!isShowClearIcon && React.isValidElement(endAdornment) ? (
        <div className="h-full ml-3 flex items-center">
          {endAdornment}
        </div>
      ): null }

    </div>
  );
});

InputBase.defaultProps = {
  autoComplete: '',
  className: '',
  clearOnError: false,
  disabled: false,
  endAdornment: null,
  error: false,
  inputClassName: '',
  label: '',
  name: '',
  noBorder: false,
  onBlur: () => {},
  onClear: () => {},
  onClick: () => {},
  placeholder: '',
  size: 'medium',
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
  size: PropTypes.oneOf(['big', 'small', 'medium']),
  startAdornment: PropTypes.element,
  succes: PropTypes.bool,
};

export default InputBase;
