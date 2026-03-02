import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useMergeRefs } from '../../../../hooks';

const Textarea = forwardRef(function Input(props, ref) {
  const {
    error,
    inputClassName,
    name,
    placeholder,
    endAdornment,
    size,
    clearOnError,
    disabled,
    ...inputProps
  } = props;

  const inputRef = useRef();
  const mergedRef = useMergeRefs([inputRef, ref]);

  const isShowClearIcon = (error && clearOnError);

  return (
    <>
      <textarea
        className={clsx(
          'w-full px-3 py-2 placeholder-black-500 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent',
          {
            'text-xs md:text-sm': size === 'small',
            'border border-danger bg-opacity-5': error,
          },
          inputClassName
        )}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={mergedRef}
        rows="4"
        {...inputProps}
      />
      {!isShowClearIcon && React.isValidElement(endAdornment) ? (
        <div className="h-full ml-3 flex items-center">
          {endAdornment}
        </div>
      ): null }

    </>
  );
});

Textarea.defaultProps = {
  clearOnError: false,
  disabled: false,
  endAdornment: null,
  error: false,
  inputClassName: '',
  label: '',
  name: '',
  onBlur: () => {},
  onClear: () => {},
  onClick: () => {},
  placeholder: '',
  size: 'medium',
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
  size: PropTypes.oneOf(['big', 'small', 'medium']),
};

export default Textarea;
