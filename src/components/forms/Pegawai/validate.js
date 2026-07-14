import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    nama: validate(values.nama, [
      { rule: 'required' },
    ]),
    nip: validate(values.nip, [
      { rule: 'required' },
    ]),
    jabatan: validate(values.jabatan, [
      { rule: 'required' },
    ]),
  };
};
