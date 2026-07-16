import validate from '../../../utils/validator';

export default function validation(values) {
  return {
    kabkota: validate(values.kabkota, [
      { rule: 'required' },
    ]),
    uhPNS: validate(values.uhPNS, [
      { rule: 'required' },
      { rule: 'isNumber' },
    ]),
    uhPPPK: validate(values.uhPPPK, [
      { rule: 'required' },
      { rule: 'isNumber' },
    ]),
    uhNonASN: validate(values.uhNonASN, [
      { rule: 'required' },
      { rule: 'isNumber' },
    ]),
  };
}