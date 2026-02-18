import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    tujuan: validate(values.tujuan, [
      // { message: 'pilih tujuan '},
      { rule: 'required' },
    ]),
    pegawai: !values.pegawai || values.pegawai.length === 0
      ? ['Minimal 1 pegawai wajib dipilih']
      : values.pegawai.map((p, i) =>
          validate(p, [{ rule: 'required', message: `Pegawai ke-${i+1} wajib dipilih` }])
        ),
    dateRange: validate(values.dateRange?.startDate && values.dateRange?.endDate, [
      { rule: 'required', message: 'Tanggal mulai dan selesai wajib dipilih' },
    ]),
  };
};
