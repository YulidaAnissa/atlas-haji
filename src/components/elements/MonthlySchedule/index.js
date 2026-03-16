// components/MonthlySchedule.jsx
import React from "react";

export default function MonthlySchedule({ data, month, year }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  console.log("Data untuk MonthlySchedule:", data); // Debug: cek data yang diterima oleh MonthlySchedule

  const statusColors = {
    perjalanan: "bg-blue-500",
    pengajuan: "bg-orange-500",
    verifikasi: "bg-yellow-500",
    selesai: "bg-green-500",
  };


  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-gray-700">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`h-4 w-4 ${color} rounded-sm shadow-sm border border-gray-300`}></div>
            <span className="capitalize">{status}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white border border-gray-300 rounded-sm"></div>
          <span>Tidak ada perjalanan</span>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-left w-28 font-semibold text-gray-700">
                Nama
              </th>
              {days.map((d) => (
                <th
                  key={d}
                  className="border px-1 py-2 text-center w-8 font-semibold text-gray-600"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((person, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="border px-2 py-2 font-medium text-gray-800 bg-gray-100">
                  {person.nama}
                </td>
                {days.map((d) => {
                  const travel = person.perjalanan.find((p) => {
                    const start = new Date(p.tglBerangkat);
                    const end = new Date(p.tglKembali);
                    const current = new Date(year, month - 1, d);
                    return current >= start && current <= end;
                  });

                  // ambil warna sesuai status
                  const colorClass = travel ? statusColors[travel.status] : "bg-white";
                  console.log('travel', travel); // Debug: cek warna yang diterapkan
                  return (
                    <td
                      key={d}
                      className={`border px-1 py-2 text-center w-8 ${colorClass}`}
                    >
                      {/* Kosong, hanya warna */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}