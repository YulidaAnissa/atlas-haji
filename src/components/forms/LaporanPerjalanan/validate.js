import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    pegawai: validate(values.pegawai, [
      { rule: 'required' },
    ]),
    spd: validate(values.spd, [
      { rule: 'required' },
    ]),
    hasil: validate(values.hasil, [
      { rule: 'required' },
    ]),
    biayaTrans: validate(values.biayaTrans, [
      { rule: 'isNumber' },
    ]),
    biayaPeng: validate(values.biayaPeng, [
      { rule: 'isNumber' },
    ]),
  };
};
