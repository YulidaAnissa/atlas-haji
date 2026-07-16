import PropTypes from "prop-types";
import { formatDate } from "@/utils/date";
import { FaInfoCircle } from "react-icons/fa";

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

function formatTipePerjalanan(type) {
  if (!type) return null;
  // Mencegah konflik jika type bernilai "khusus"
  if (type === "khusus") return null; 
  
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export default function InformasiPerjalanan({
  data,
  className = "",
}) {
  const fileSurat =
    data?.file || data?.fileSurat || null;

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
      value: data?.kegiatan,
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

          {/* Sisi Kanan: Badges / Tags */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {tipeDinas && (
              <span className="inline-flex items-center rounded-full bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10 backdrop-blur-sm transition-all hover:bg-blue-100/70">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                {tipeDinas}
              </span>
            )}
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

    tglSurat: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    className: PropTypes.string,
    type: PropTypes.string,
  }),
};