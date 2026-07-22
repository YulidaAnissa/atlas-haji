import validate from '../../../utils/validator';

export default function validation(values) {
  return {
    nama: validate(values.nama, [
      { rule: 'required' },
    ]),
    alamat: validate(values.alamat, [
      { rule: 'required' },
    ]),
    callCenter: validate(values.callCenter, [
      { rule: 'required' },
      // Catatan: Jika validator Anda mendukung pengecekan format telepon khusus, Anda bisa menambahkannya di sini.
      // Saya tidak menyertakan 'isNumber' karena nomor telepon seringkali diinput menggunakan tanda hubung (contoh: 021-12345678) atau kode negara (+62).
      // Jika Anda mewajibkan hanya angka, Anda bisa membuka komentar di bawah ini:
      // { rule: 'isNumber' }, 
    ]),
  };
}