import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    nip: validate(values.nip, [
      // { message: 'pilih tujuan '},
      { rule: 'required' },
    ]),
    noSurat: validate(values.noSurat, [
      // { message: 'pilih tujuan '},
      { rule: 'required' },
    ]),
    tglSurat: validate(values.tglSurat, [
      // { message: 'pilih tujuan '},
      { rule: 'required' },
    ]),
  };
};
