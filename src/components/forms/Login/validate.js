import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    username: validate(values.username, [
      { rule: 'required' },
    ]),
    password: validate(values.password, [
      { rule: 'required' },
    ]),
  };
};
