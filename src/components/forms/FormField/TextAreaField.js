import React from 'react';
import FormField from './FormField';
import Textarea from '@/components/forms/FormField/TextArea';

function TextareaField(props) {
  return (
    <FormField {...props} className="p-2">
      <Textarea />
    </FormField>
  );
}

export default TextareaField;