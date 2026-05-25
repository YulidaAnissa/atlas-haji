import React from "react";

export default function StatusBadge({ status, canVerify = false, onClick }) {
  const normalizedStatus = String(status ?? "").toLowerCase();

  const variants = {
    pengajuan: {
      label: "Pengajuan",
      dot: "bg-amber-500",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    pending: {
      label: "Pengajuan",
      dot: "bg-amber-500",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    verifikasi: {
      label: "Diverifikasi",
      dot: "bg-emerald-500",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    diverifikasi: {
      label: "Diverifikasi",
      dot: "bg-emerald-500",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    tolak: {
      label: "Ditolak",
      dot: "bg-red-500",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    ditolak: {
      label: "Ditolak",
      dot: "bg-red-500",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    default: {
      label: "Pengajuan",
      dot: "bg-slate-400",
      className: "border-slate-200 bg-slate-50 text-slate-700",
    },
  };

  const current = variants[normalizedStatus] || variants.default;
  const isClickable = canVerify && typeof onClick === "function";

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition
        ${current.className}
        ${
          isClickable
            ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            : "cursor-default"
        }`}
    >
      <span className={`h-2 w-2 rounded-full ${current.dot}`} />
      {current.label}
    </button>
  );
}