import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

export default function NotificationCard({
  onDetail,
  message,
  note,
  type = "danger",
}) {
  const variants = {
    danger: {
      title: "Pengajuan Pembiayaan Ditolak",
      icon: <FaExclamationTriangle />,
      wrapper: "border-red-200 bg-red-50 text-red-900",
      iconBox: "bg-red-100 text-red-600",
      button: "border-red-200 bg-white text-red-700 hover:bg-red-100",
      note: "border-red-100 bg-white/70 text-red-700",
    },
    success: {
      title: "Diterima",
      icon: <FaCheckCircle />,
      wrapper: "border-green-200 bg-green-50 text-green-900",
      iconBox: "bg-green-100 text-green-600",
      button: "border-green-200 bg-white text-green-700 hover:bg-green-100",
      note: "border-green-100 bg-white/70 text-green-700",
    },
    info: {
      title: "Info",
      icon: <FaInfoCircle />,
      wrapper: "border-blue-200 bg-blue-50 text-blue-900",
      iconBox: "bg-blue-100 text-blue-600",
      button: "border-blue-200 bg-white text-blue-700 hover:bg-blue-100",
      note: "border-blue-100 bg-white/70 text-blue-700",
    },
  };

  const current = variants[type] ?? variants.info;

  return (
    <div
      className={`mb-4 rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${current.wrapper}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${current.iconBox}`}
          >
            {current.icon}
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide">
              {current.title}
            </h3>

            <p className="mt-1 text-sm leading-6 opacity-90">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDetail}
          className={`inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition ${current.button}`}
        >
          Lihat Detail
        </button>
      </div>

      {note && (
        <div className={`mt-4 rounded-xl border px-4 py-3 ${current.note}`}>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
            Catatan
          </p>
          <p className="mt-1 text-sm leading-6">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}