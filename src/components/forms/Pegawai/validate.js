import validate from '../../../utils/validator';

export default function validation(values) {
  // Fungsi helper untuk mengekstrak string pesan saja dari validator bawaan Anda
  const getErrorString = (value, rules) => {
    const result = validate(value, rules);
    return result && typeof result === 'object' ? result.message : result;
  };

  const errors = {
    jenisPegawai: getErrorString(values.jenisPegawai, [
      { rule: 'required', message: 'Jenis pegawai harus dipilih' },
    ]),
    nama: getErrorString(values.nama, [
      { rule: 'required' },
    ]),
    nip: getErrorString(values.nip, [
      { rule: 'required' },
    ]),
    jabatan: getErrorString(values.jabatan, [
      { rule: 'required' },
    ]),
  };

  if (values.jenisPegawai === 'PNS' && values.isPejabat) {
    errors.unit = getErrorString(values.unit, [
      { rule: 'required', message: 'Unit Kerja wajib diisi untuk pejabat' },
    ]);
  }

  return errors;
}