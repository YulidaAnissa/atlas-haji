import PropTypes from "prop-types";
import { formatDate } from "@/utils/date";

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

  return (
    <section
      className={`mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm ${className}`}
    >
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Perjalanan
            </h2>
          </div>

          {data?.type === "khusus" && (
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Perjalanan Khusus
            </div>
          )}
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