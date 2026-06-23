import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    pegawai: validate(values.pegawai, [
      { rule: 'required' },
    ]),
    dateRange: validate(values.dateRange, [
      { rule: 'required' },
    ]),
    tujuan: validate(values.tujuan, [
      { rule: 'required' },
    ]),
  };
};
