const patternAngka = /[0-9]/;
const patternUppercase = /[A-Z]/;

export const formatTipePerjalanan = (type) => {
  if (!type) return null;
  // Mencegah konflik jika type bernilai "khusus"
  if (type === "khusus") return null; 
  
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const checkPasswordStrength = (password) => {
  if(password.length >= 15 && patternAngka.test(password) || patternUppercase.test(password)){
    return 'Kuat';
  } else if(password.length >= 10 && patternAngka.test(password)){
    return 'Sedang';
  } else {
    return 'Lemah';
  }
};

export function toLowerCase(text = '') {
  return text?.toLowerCase();
}

export function toUpperCase(text = '') {
  return text?.toUpperCase();
}

export function capitalizeFirst(string) {
  if (typeof string !== 'string') {
    throw new Error('capitalize(string) expects a string argument.');
  }

  return string.charAt(0)?.toUpperCase() + string.slice(1);
}

export function capitalize(string) {
  let splitStr = string.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0)?.toUpperCase() + splitStr[i].substring(1);     
  }
  
  return splitStr.join(' '); 
}

export function unslug(string) {
  return string?.split('-').map(capitalize).join(' ');
}

export function decimalSeparator(number, separator = '.') {
  let numberWithSeparator = new Number(number).toString();
  numberWithSeparator = numberWithSeparator.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  if (separator === ',') numberWithSeparator = numberWithSeparator.replace('.', ',');

  return numberWithSeparator;
}

export function rp(value) {
  let roundedValue = Math.round(value);
  if(roundedValue < 0) {
    roundedValue = 0;
  }
  return `Rp${decimalSeparator(roundedValue)}`;
}

export function roundFloat(value, fixed =  1) {
  return Math.round(parseFloat(value).toFixed(fixed)*100)/100;
}

export function isTypeImage(file) {
  let imageType = ['JPG', 'PNG', 'JPEG'];
  if (!imageType.includes(toUpperCase(getExtension(file)))) {

    return false;
  }

  return true;
}

export function isTypePDF(file) {
  if (toUpperCase(getExtension(file)) !== 'PDF') {
    return false;
  }
  return true;
}

export function isTypeVideo(content) {

  if(content.mimetype?.toLowerCase().includes('video')) return true;
  
  const type = content.filename?.split('.').pop();

  const videoTypes = ['m4v', 'mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'];
  if(videoTypes.includes(type.toString().toLowerCase())) {
    return true;
  }

  return false;
}

export const getCourseContentDuration = (duration) => {
  if(typeof duration !== 'string') return '';
  
  const durationSplited = duration.split(':');
  if(durationSplited.length < 3) return '';

  const [hours, minutes, seconds] = durationSplited;

  const hoursInMinutes = parseInt(hours, 10) * 60;
  const secondsInMinutes = parseInt(seconds, 10) / 60;

  const durationInMinutes = Math.floor(hoursInMinutes + parseInt(minutes, 10) + secondsInMinutes);

  return `${durationInMinutes} Menit`;

};

export const getCourseContentType = (contents) => {
  if(!contents) return '';

  const contentDuration = getCourseContentDuration(contents[0].duration);
  if(contentDuration) return contentDuration;

  if(isTypeVideo(contents[0])) return 'Video';

  return 'PDF';
};

export const getInitials = (string) => {
  let names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();
  
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export function getExtension(text) {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(text)[1];
}
