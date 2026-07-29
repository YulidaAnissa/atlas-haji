import PropTypes from "prop-types";
import { formatDate } from "@/utils/date";
import { formatTipePerjalanan } from "@/utils/string";

function DetailItem({ label, value, className }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="mt-2 text-sm font-semibold leading-6 text-gray-900">
        {value || "-"}
      </div>
    </div>
  );
}

export default function InformasiPerjalanan({
  data,
  className = "",
}) {
  const fileSurat = data?.file || data?.fileSurat || null;
  const namaKantor = data?.namaKantor || "-";

  const details = [
    {
      label: "No Surat",
      value: data?.noSurat,
    },
    {
      label: "Tanggal Surat",
      value: data?.tglSurat
        ? formatDate(data.tglSurat, "DD MMMM YYYY")
        : "-",
    },
    {
      label: "Kegiatan",
      value: data?.ringKegiatan || data?.kegiatan,
    },
    {
      label: "File Surat Tugas",
      value: fileSurat ? (
        <a
          href={fileSurat}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand transition hover:underline"
        >
          Lihat surat tugas
          <span aria-hidden="true">↗</span>
        </a>
      ) : (
        "-"
      ),
    },
    {
      label: "Pejabat Pemberi Tugas",
      className: "md:col-span-2",
      value: 
        data?.nama || data?.jabatan ? (
          <div>
            <p className="font-semibold text-gray-900">
              {data?.nama || "-"}
            </p>

            {data?.jabatan && (
              <p className="mt-1 text-sm font-normal leading-5 text-gray-500">
                {data.jabatan}
              </p>
            )}
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const tipeDinas = formatTipePerjalanan(data?.type);

  return (
    <section
      className={`mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm ${className}`}
    >
      <div className="relative border-b border-slate-100 bg-linear-to-r from-white via-slate-50/30 to-white px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Sisi Kiri: Judul & Sub-deskripsi */}
          <div className="flex items-center gap-3.5">
            {/* Aksen Garis Vertikal Brand */}
            <div className="h-8 w-1 rounded-full bg-brand" />
            
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Informasi Perjalanan
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 font-medium">
                Manajemen berkas dan tipe penugasan dinas
              </p>
            </div>
          </div>

          <div className="flex items-center self-start sm:self-auto">
            <div className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/90 p-1 text-xs shadow-xs backdrop-blur-sm">
              {/* Segment 1: Tipe Dinas */}
              {tipeDinas && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 font-medium text-white shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {tipeDinas}
                </span>
              )}

              {/* Segment 2: Nama Kantor */}
              {namaKantor && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 font-medium text-slate-600">
                  <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {namaKantor}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {details.map((detail) => (
          <DetailItem
            key={detail.label}
            label={detail.label}
            value={detail.value}
            className={detail.className}
          />
        ))}
      </div>
    </section>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  className: PropTypes.string,
};

InformasiPerjalanan.propTypes = {
  className: PropTypes.string,

  data: PropTypes.shape({
    nama: PropTypes.string,
    jabatan: PropTypes.string,
    noSurat: PropTypes.string,
    kegiatan: PropTypes.string,
    file: PropTypes.string,
    fileSurat: PropTypes.string,
    namaKantor: PropTypes.string,
    kantor: PropTypes.string,

    tglSurat: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    className: PropTypes.string,
    type: PropTypes.string,
  }),
};