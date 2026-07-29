import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    pegawai: validate(values.pegawai.values, [
      { rule: 'required' },
    ]),
    spd: validate(values.spd, [
      { rule: 'required' },
    ]),
    hasil: validate(values.hasil, [
      { rule: 'required' },
    ]),
    // Validasi isNumber hanya berjalan jika field diisi (opsional)
    biayaTrans: values.biayaTrans 
      ? validate(values.biayaTrans, [{ rule: 'isNumber' }]) 
      : undefined,
      
    biayaPeng: values.biayaPeng 
      ? validate(values.biayaPeng, [{ rule: 'isNumber' }]) 
      : undefined,
  };
};
