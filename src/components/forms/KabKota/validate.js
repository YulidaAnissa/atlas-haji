import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    kabkota: validate(values.kabkota, [
      { rule: 'required' },
    ]),
    uh: validate(values.uh, [
      { rule: 'required' },
      { rule: 'number' },
    ]),
    alamat: validate(values.alamat, [
      { rule: 'required' },
    ]),
  };
};
