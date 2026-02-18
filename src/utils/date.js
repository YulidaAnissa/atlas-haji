import dayjsModule from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import updateLocale from 'dayjs/plugin/updateLocale';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
dayjsModule.extend(customParseFormat);
dayjsModule.extend(isToday);
dayjsModule.extend(isSameOrAfter);
dayjsModule.extend(isBetween);
dayjsModule.extend(isTomorrow);
dayjsModule.extend(relativeTime);
dayjsModule.locale('id');
dayjsModule.extend(updateLocale);
dayjsModule.updateLocale('id', {
  relativeTime: {
    s: 'beberapa detik yang lalu',
    m: '1 menit yang lalu',
    mm: '%d menit yang lalu',
    h: 'sejam yang lalu',
    hh: '%d jam yang lalu',
    d: '1 hari yang lalu',
    dd: '%d hari yang lalu',
    M: 'date',
    MM: 'date',
    y: 'date',
    yy: 'date'
  }
});
export const dayjs = dayjsModule;
export const formatDate = (date, format = 'DD-MM-YYYY') => dayjsModule(new Date(date)).format(format);
export const formatRangeDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if(startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate, 'DD MMMM YYYY');
  }

  let startDateFormated = '';
  const endDateFormated = formatDate(endDate, 'DD MMMM YYYY');

  if(startDate.getMonth() === endDate.getMonth() && startDate.getYear() === endDate.getYear()) {
    startDateFormated = startDate.getDate();
  } else if(startDate.getMonth() !== endDate.getMonth() && 
    startDate.getYear() === endDate.getYear()) {
    startDateFormated = formatDate(startDate, 'DD MMMM');
  } else {
    startDateFormated = formatDate(startDate, 'DD MMMM YYYY');
  }

  return `${startDateFormated} - ${endDateFormated}`;

};
export const dateIsToday = (date) => dayjsModule(new Date(date)).isToday();
export const dateIsTomorrow = (date) => dayjsModule(new Date(date)).isTomorrow();
export const getDistance = (date, format = 'D MMMM YYYY') => {
  const times = dayjs(new Date(date)).fromNow(true);
  const daysAgo = parseInt(times.split(' ')[0]);
  if(daysAgo && daysAgo <= 7) return '1 minggu yang lalu';
  if(daysAgo && daysAgo >= 8 && daysAgo <= 14) return '2 minggu yang lalu';
  return formatDate(date, format);
};

export const dateIsAfter = (date) => {
  return dayjsModule().isAfter(date);
};

export { default as ms } from 'ms';

// SOURCE: parse-ms
export function parseMs(milliseconds) {
  if (typeof milliseconds !== 'number') {
    throw new TypeError('Expected a number');
  }

  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

  return {
    days: roundTowardsZero(milliseconds / 86400000),
    hours: roundTowardsZero(milliseconds / 3600000) % 24,
    minutes: roundTowardsZero(milliseconds / 60000) % 60,
    seconds: roundTowardsZero(milliseconds / 1000) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1000,
  };
}

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for(let i=currentYear-100; i<=currentYear; i++) {
    years.push(i);
  }
  return years;
};

export const getDateOptions = (isLeapYear) => ({
  0: 31,
  1: isLeapYear ? 29 : 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31
});

export const getMonthOptions = () => ({
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11
});

export const numberToWordsID = (num) => {
  const words = [
    "nol", "satu", "dua", "tiga", "empat",
    "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas"
  ];

  if (num < words.length) return words[num];

  if (num < 20) return words[num - 10] + " belas";
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return words[tens] + " puluh" + (ones ? " " + words[ones] : "");
  }

  return num.toString(); // fallback untuk angka besar
};


export const calculateTripDuration = (startDate, endDate, includeStartEndDays = false) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Selisih dalam milidetik
  const diffTime = Math.abs(end - start);

  // Konversi ke hari
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Kalau mau termasuk hari berangkat & kembali, tambahkan 1
  if (includeStartEndDays) {
    diffDays += 1;
  }

  return `${diffDays + 1} (${numberToWordsID(diffDays + 1)})`;
}

