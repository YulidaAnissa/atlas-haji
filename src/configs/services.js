const SERVICE_BASE = process.env.NEXT_PUBLIC_SERVICE_BASE || 'atlas-haji.vercel.app';

const services = {
  SERVICE_BASE,
  LOGIN: `${SERVICE_BASE}/login`,
  KABKOTA: `${SERVICE_BASE}/location`,
  PEGAWAI: `${SERVICE_BASE}/users`,
  ADD_PERJALANAN: `${SERVICE_BASE}/perjalanan`,
  PERJALANAN: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/perjalanan/${id}` : `${SERVICE_BASE}/perjalanan`;
  },
  LAPORAN: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/laporan/${id}` : `${SERVICE_BASE}/laporan`;
  },
  PERJALANAN_PEGAWAI: `${SERVICE_BASE}/perjalanan/pegawai`,
  CONVERT_PDF: `${SERVICE_BASE}/convertPDF`,
  SURAT_TUGAS: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/surat/${id}` : `${SERVICE_BASE}/surat`;
  },
};

export default services;