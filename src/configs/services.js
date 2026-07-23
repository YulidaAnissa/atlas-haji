const SERVICE_BASE =
  process.env.NEXT_PUBLIC_SERVICE_BASE ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:4321'
    : 'https://atlas-haji-service.cloud');

const services = {
  SERVICE_BASE,
  LOGIN: `${SERVICE_BASE}/login`,
  KABKOTA: `${SERVICE_BASE}/location`,
  PEGAWAI: `${SERVICE_BASE}/users`,
  ADD_PERJALANAN: `${SERVICE_BASE}/perjalanan`,
  PERJALANAN_PEGAWAI: `${SERVICE_BASE}/perjalanan-pegawai`,
  PERJALANAN: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/perjalanan/${id}` : `${SERVICE_BASE}/perjalanan`;
  },
  LAPORAN: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/laporan/${id}` : `${SERVICE_BASE}/laporan`;
  },
  CONVERT_PDF: `${SERVICE_BASE}/convertPDF`,
  SURAT_TUGAS: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/surat/${id}` : `${SERVICE_BASE}/surat`;
  },
  DASHBOARD_FILTER: `${SERVICE_BASE}/perjalanan/dashboard/filter`,
  DASHBOARD_SUMMARY: `${SERVICE_BASE}/perjalanan/dashboard/summary`,
  NOTIFICATIONS: ({ id } = {}) => `${SERVICE_BASE}/users/notif/${id}`,
  KANTOR: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/kantor/${id}` : `${SERVICE_BASE}/kantor`;
  },
  NOMINATIF_AJUAN: ({ id } = {}) => {
    return id ? `${SERVICE_BASE}/laporan/nominatif-ajuan/${id}` : `${SERVICE_BASE}/nominatif-ajuan`;
  },
};

export default services;