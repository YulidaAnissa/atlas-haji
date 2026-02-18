import { base64EncArr, strToUTF8Arr, UTF8ArrToStr, base64DecToArr } from './base64';

export const encrypt = (str = '') => {
  try {
    const stringArray = str.split('');
    const obfuscated = stringArray.map((i, idx) => {
      return String.fromCharCode(i.charCodeAt(0) + ((idx % 10) + (str.length % 10)));
    }).join('');
    const result = base64EncArr(strToUTF8Arr(obfuscated));

    return result;

  } catch(_) {
    return '';
  }
};

export const decrypt = (str = '') => {
  try {
    const decoded = UTF8ArrToStr(base64DecToArr(str));
    const stringArray = decoded.split('');
    const result = stringArray.map((i, idx) => {
      return String.fromCharCode(i.charCodeAt(0) - ((idx % 10) + (decoded.length % 10)));
    }).join('');
    return result;
  } catch(_) {
    return '';
  }
};