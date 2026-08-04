import validate from '../../../utils/validator';

export default function validation(values) {
  // Aturan dasar untuk biaya (wajib jika adaBiayaPerjalanan true, opsional jika false)
  const biayaRules = values.adaBiayaPerjalanan
    ? [{ rule: 'required' }, { rule: 'isNumber' }]
    : [{ rule: 'isNumber' }];

  return {
    pegawai: validate(values.pegawai.value || values.pegawai, [
      { rule: 'required' },
    ]),
    spd: validate(values.spd, [
      { rule: 'required' },
    ]),
    hasil: validate(values.hasil, [
      { rule: 'required' },
    ]),

    // Validasi biayaTrans berdasarkan kondisi adaBiayaPerjalanan
    biayaTrans: values.adaBiayaPerjalanan || values.biayaTrans 
      ? validate(values.biayaTrans, biayaRules) 
      : undefined,
      
    // Validasi biayaPeng berdasarkan kondisi adaBiayaPerjalanan
    biayaPeng: values.adaBiayaPerjalanan || values.biayaPeng 
      ? validate(values.biayaPeng, biayaRules) 
      : undefined,

    buktiTrans: values.adaBiayaPerjalanan || values.buktiTrans 
      ? validate(values.buktiTrans, [{ rule: 'required' }]) 
      : undefined,
      
    // Validasi buktiPeng berdasarkan kondisi adaBiayaPerjalanan
    buktiPeng: values.adaBiayaPerjalanan || values.buktiPeng 
      ? validate(values.buktiPeng, [{ rule: 'required' }]) 
      : undefined,
  };
};