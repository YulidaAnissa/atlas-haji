export default function NotificationCard({ onDetail, message, note, type = "danger"}) {
  const typeStyles = {
    danger: "bg-red-500/20 border border-red-400 text-red-800",
    success: "bg-green-500/60 border border-green-400/40 text-white",
    info: "bg-blue-500/60 border border-blue-400/40 text-white",
  };

  const icons = { danger: "❌", success: "✅", info: "ℹ️" };
  const titles = { danger: "Pengajuan Pembiayaan Ditolak", success: "Diterima", info: "Info" };

  return (
    <div className={`rounded-xl shadow-sm p-4 mb-4 ${typeStyles[type]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">{icons[type]}</span>
          <span className="font-semibold">{titles[type]}</span>
        </div>
        {/* Tombol kanan atas */}
        <button
          onClick={onDetail}
          className="p-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lihat Detail
        </button>
      </div>
      <p className="text-sm leading-relaxed">{message}</p>
      {note && <p className="mt-2 text-xs italic text-gray-500">Catatan: {note}</p>}
    </div>
  );

}

