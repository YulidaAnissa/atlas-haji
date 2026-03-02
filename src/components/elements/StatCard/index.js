// components/StatusCard.jsx


export default function StatusCard({ label, count, color, iconBg, icon }) {
  return (
    <div
      className={`flex items-center p-6 rounded-xl shadow-md hover:shadow-lg ${color} transition-transform transform hover:scale-105`}
    >
      {/* Ikon dengan lingkaran background */}
      <div className={`flex items-center justify-center h-14 w-14 rounded-full ${iconBg} shadow-md mr-4`}>
        <div className="text-3xl text-white">{icon}</div>
      </div>

      {/* Konten teks */}
      <div>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}
