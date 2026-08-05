import validate from '../../../utils/validator';

export default function validation(values) {
  // Aturan dasar untuk biaya (wajib jika adaBiayaTrans true, opsional jika false)
  const biayaTransRules = values.adaBiayaTrans
    ? [{ rule: 'required' }, { rule: 'isNumber' }]
    : [{ rule: 'isNumber' }];

  const biayaPengRules = values.adaBiayaTrans
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

    biayaTrans: values.adaBiayaTrans || values.biayaTrans 
      ? validate(values.biayaTrans, biayaTransRules) 
      : undefined,

    buktiTrans: values.adaBiayaTrans || values.buktiTrans 
      ? validate(values.buktiTrans, [{ rule: 'required' }]) 
      : undefined,
      
    biayaPeng: values.adaBiayaPeng || values.biayaPeng 
      ? validate(values.biayaPeng, biayaPengRules) 
      : undefined,

    buktiPeng: values.adaBiayaPeng || values.buktiPeng 
      ? validate(values.buktiPeng, [{ rule: 'required' }]) 
      : undefined,
  };
};