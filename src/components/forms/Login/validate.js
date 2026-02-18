import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    username: validate(values.username, [
      { rule: 'required' },
      { rule: 'isNumber', message: 'NIP harus berupa angka' },
    ]),
    password: validate(values.password, [
      { rule: 'required' },
    ]),
  };
};
