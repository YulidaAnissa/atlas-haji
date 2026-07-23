import validate from '../../../utils/validator';

// Contoh validate.js yang benar:
export default function validation(values) {
  return {
    jenisPegawai: validate(values.jenisPegawai, [
      { rule: 'required' },
    ]),
    nip: validate(values.nip, [
      { rule: 'required' },
      { rule: 'isNumber' },
    ]),
    nama: validate(values.nama, [
      { rule: 'required' },
    ]),
  };
}