import validate from '../../../utils/validator';

export default function validation(values) {
  return {
    nama: validate(values.nama, [
      { rule: 'required' },
    ]),
    alamat: validate(values.alamat, [
      { rule: 'required' },
    ]),
    callCenter: validate(values.callCenter, [
      { rule: 'required' },
    ]),
    kodeSurat: validate(values.kodeSurat, [
      { rule: 'required' },
    ]),
    ppk: validate(values.ppk, [
      { rule: 'required' },
    ]),
    pkoh: validate(values.pkoh, [
      { rule: 'required' },
    ]),
    dipa: validate(values.dipa, [
      { rule: 'required' },
    ]),
  };
}