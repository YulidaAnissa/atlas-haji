import validate from '../../../utils/validator';

export default function validation(values) {
  
  return {
    kegiatan: validate(values.kegiatan, [
      { rule: 'required' },
    ]),
    tujuan: validate(values.tujuan, [
      { rule: 'required' },
    ]),
    dateRange: validate(values.dateRange?.startDate && values.dateRange?.endDate, [
      { rule: 'required', message: 'Tanggal mulai dan selesai wajib dipilih' },
    ]),
  };
};
