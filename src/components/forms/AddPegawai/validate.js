import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    nama: validate(values.nama, [
      { rule: 'required' },
    ]),
    nip: validate(values.nip, [
      { rule: 'required' },
    ]),
    pangkat: validate(values.pangkat, [
      { rule: 'required' },
    ]),
    gol: validate(values.gol, [
      { rule: 'required' },
    ]),
    jabatan: validate(values.jabatan, [
      { rule: 'required' },
    ]),
  };
};
