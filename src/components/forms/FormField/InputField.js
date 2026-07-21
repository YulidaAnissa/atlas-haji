
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import FormField from './FormField';
import InputBase from './InputBase';

import React, { useState, useEffect } from 'react';

function InputField(props) {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClearFieldState = () => {
    form.resetFieldState(props?.input?.name);
    props?.input?.onChange('');
  };

  // Render standard fallback on server & initial hydration pass
  if (!isMounted) {
    return (
      <FormField {...props}>
        <InputBase />
      </FormField>
    );
  }

  return (
    <FormField {...props} onClear={handleClearFieldState}> 
      <InputBase />
    </FormField>
  );
}

InputField.propTypes = {
  input: PropTypes.object.isRequired
};

export default InputField;