import {
  FaExclamationTriangle,
} from "react-icons/fa";

export default function NotificationCard({
  onDetail,
  data
}) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-l-4 border-red-500 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FaExclamationTriangle className="text-lg" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Pengajuan Ditolak
              </p>

              <h3 className="mt-1 text-base font-semibold text-gray-900">
                {data?.nama}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onDetail}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}