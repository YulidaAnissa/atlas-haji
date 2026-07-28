import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import FormField from './FormField';
import InputBase from './InputBase';
import React from 'react';

function InputField(props) {
  const form = useForm();

  const handleClearFieldState = () => {
    if (form && props?.input?.name) {
      form.resetFieldState(props.input.name);
      props.input.onChange('');
    }
  };

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