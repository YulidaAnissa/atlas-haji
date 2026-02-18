const validate = (value, rules) => {
  let errors = [];
  let pattern = /[0-9]/;
  let symbol = /[$-/:-?{-~!"^_`[]/;
  let haveNumberString = /^[a-zA-Z0-9]*$/;
  let urlRegEx =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
  rules.forEach(rule => {
    switch (rule.rule) {
      case 'required':
        if (!value && (!value || value.length === 0)) {
          errors.push({
            message: 'Masukkan data terlebih dahulu',
            ...rule
          });
        }
        break;
      case 'requiredFileArray':
        if (value && !value.length) {
          errors.push({
            message: 'Masukkan file terlebih dahulu',
            ...rule
          });
        }
        break;
      case 'required@':
        if (value && value.indexOf('@') < 0) {
          errors.push({
            message: 'Format email yang dimasukkan tidak memiliki “@”',
            ...rule
          });
        }
        break;
      case 'length':
        if (value && value.length !== rule.lengthValue) {
          errors.push({
            message: `Jumlah karakter harus ${rule.lengthValue}`,
            ...rule
          });
        }
        break;
      case 'email':
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          errors.push({
            message: `Format email tidak valid`,
            ...rule
          });
        }
        break;
      case 'minLength':
        if (value && value.length < rule.lengthValue) {
          errors.push({
            message: `Minimum ${rule.lengthValue} karakter`,
            ...rule
          });
        }
        break;
      case 'maxLength':
        if (value && value.length >= rule.lengthValue) {
          errors.push({
            message: `Maksimum ${rule.lengthValue} karakter`,
            ...rule
          });
        }
        break;
      case 'nikFormat':
        if (value && value.length !== 16) {
          errors.push({
            message: 'Format NIK tidak valid',
            ...rule
          });
        }
        break;
      case 'isNumber':
        if (value && !value.match(/^[0-9]+$/)) {
          errors.push({
            message: `Format harus berupa angka`,
            ...rule
          });
        }
        break;
      case 'haveNumber':
        if (value && !pattern.test(value)) {
          errors.push({
            message: `Memiliki Angka`,
            ...rule
          });
        }
        break;
      case 'notNumber':
        if (value && pattern.test(value)) {
          errors.push({
            message: `Format nama lengkap tidak bisa memiliki angka`,
            ...rule
          });
        }
        break;
      case 'notSymbol':
        if (value && symbol.test(value)) {
          errors.push({
            message: `Format nama lengkap tidak bisa memiliki symbol`,
            ...rule
          });
        }
        break;
      case 'mobilePhoneStartFrom0':
        if (value && value.slice(0,1) === '0') {
          errors.push({
            message: `Format nomor tidak bisa diawali dengan “0”`,
            ...rule
          });
        }
        break;
      case 'mobilePhoneStartFrom62':
        if (value && value.slice(0,2) === '62') {
          errors.push({
            message: `Format nomor tidak bisa diawali dengan “62”`,
            ...rule
          });
        }
        break;
      case 'matchValue':
        if (value !== rule.param) {
          errors.push({
            message: `Tidak Sama`,
            ...rule
          });
        }
        break;
      case 'url':
        if (value && !value.match(urlRegEx)) {
          errors.push({
            message: `Format penulisan URL salah`,
            ...rule,
          });
        }
        break;
    //   case 'image':
    //     if (value && value.filter((item) => !isTypeImage(item.path)).length) {
    //       let fileName = value?.map(x => x.path).join(', ');
    //       errors.push({
    //         message: `Format gambar "${fileName}" tidak sesuai ketentuan`,
    //         ...rule,
    //       });
    //     }
    //     break;
    //   case 'pdf':
    //     if (value && value.filter((item) => !isTypePDF(item.path)).length) {
    //       let fileName = value?.map(x => x.path).join(', ');
    //       errors.push({
    //         message: `Format file "${fileName}" tidak sesuai ketentuan`,
    //         ...rule,
    //       });
    //     }
    //     break;
      case 'ratio':
        if (rule.rejected?.length > 0) {
          let fileName = value?.map(x => x.path).join(', ');
          errors.push({
            message: `ratio gambar "${fileName}" tidak sesuai ketentuan`,
            ...rule,
          });
        }
        break;
      case 'size':
        if (value && value.filter((item) => item.size > rule.max).length) {
          let fileName = value?.map(x => x.path).join(', ');
          errors.push({
            message: `Ukuran file "${fileName}" melebihi 5MB`,
            ...rule,
          });
        }
        break;
      case 'numberString':
        if (value && !haveNumberString.test(value)) {
          errors.push({
            message: `have number string`,
            ...rule
          });
        }
        break;
      case 'minThreeWords': {
        const wordCount = (value?.trim().match(/\b\w+\b/g) || []).length;
        if (wordCount < 3) {
          errors.push({
            message: 'masukan minimal 3 kata',
            ...rule
          });
        }
        break;
      }
      default:
        return null;
    }
  });

  if(errors.length) return errors;
  return;
  
};

export default validate;
