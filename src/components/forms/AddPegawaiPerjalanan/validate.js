import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    pegawai: validate(values.pegawai, [
      { rule: 'required' },
    ]),
  };
};
