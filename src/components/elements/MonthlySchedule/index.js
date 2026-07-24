import { formatDate } from "@/utils/date";
import React from "react";

export default function MonthlySchedule({ data = [], month, year }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const statusStyles = {
    perjalanan: {
      label: "Perjalanan",
      bar: "bg-blue-500 shadow-blue-500/20",
      dot: "bg-blue-500",
    },
    pengajuan: {
      label: "Pengajuan",
      bar: "bg-orange-500 shadow-orange-500/20",
      dot: "bg-orange-500",
    },
    verifikasi: {
      label: "Verifikasi",
      bar: "bg-amber-500 shadow-amber-500/20",
      dot: "bg-amber-500",
    },
    selesai: {
      label: "Selesai",
      bar: "bg-emerald-500 shadow-emerald-500/20",
      dot: "bg-emerald-500",
    },
  };

  const normalizeStatus = (status) => {
    if (status === "tolak") return "pengajuan";
    return status;
  };

  const parseDateOnly = (dateString) => {
    if (!dateString) return null;

    let cleanDateStr = dateString;

    if (cleanDateStr.includes("T")) {
      cleanDateStr = cleanDateStr.split("T")[0];
    }

    if (cleanDateStr.includes("-") || cleanDateStr.includes("/")) {
      const separator = cleanDateStr.includes("-") ? "-" : "/";
      const parts = cleanDateStr.split(separator);
      
      if (parts[0].length === 2 && parts[2]?.length === 4) {
        cleanDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const date = new Date(cleanDateStr);
    date.setHours(0, 0, 0, 0);
    return isNaN(date.getTime()) ? null : date;
  };

  const getAllTravelsByDay = (person, day) => {
    const current = new Date(year, month - 1, day);
    current.setHours(0, 0, 0, 0);

    if (!person.perjalanan) return [];

    return person.perjalanan.filter((item) => {
      const start = parseDateOnly(item.tglBerangkat);
      const end = parseDateOnly(item.tglKembali);

      if (!start || !end) return false;

      return current >= start && current <= end;
    });
  };

  const isWeekend = (day) => {
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();

    return weekday === 0 || weekday === 6;
  };

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round5" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-800">
          Belum ada jadwal perjalanan
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Data perjalanan untuk periode ini belum tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Legend Status yang Lebih Modern */}
      <div className="flex flex-wrap items-center gap-2.5">
        {Object.entries(statusStyles).map(([status, style]) => (
          <div
            key={status}
            className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-2xs"
          >
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <div className="min-w-175 sm:min-w-225">
            
            {/* Header Hari */}
            <div className="grid grid-cols-[150px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)] border-b border-gray-200 bg-gray-50/70 backdrop-blur-xs">
              <div className="sticky left-0 z-10 bg-gray-50/90 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)]">
                Pegawai
              </div>

              <div
                className="grid min-w-0"
                style={{
                  gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
                }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    className={`py-3.5 text-center text-[11px] font-medium tracking-tight ${
                      isWeekend(day) ? "text-rose-500 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Body / Daftar Pegawai */}
            <div className="divide-y divide-gray-100/80">
              {data.map((person, index) => (
                <div
                  key={`${person.nama}-${index}`}
                  className="grid grid-cols-[150px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)] transition-colors hover:bg-gray-50/50"
                >
                  {/* Kolom Nama Sticky */}
                  <div className="sticky left-0 z-10 flex min-h-13 min-w-0 items-center bg-white px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)] transition-colors group-hover:bg-gray-50/50">
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-medium text-gray-700">
                        {person.nama}
                      </p>
                    </div>
                  </div>

                  {/* Grid Status Per Hari */}
                  <div
                    className="grid min-w-0"
                    style={{
                      gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
                    }}
                  >
                    {days.map((day) => {
                      const activeTravels = getAllTravelsByDay(person, day);
                      const hasTravel = activeTravels.length > 0;
                      
                      const primaryTravel = activeTravels[0];
                      const status = normalizeStatus(primaryTravel?.status);
                      const style = statusStyles[status];

                      const tooltipText = hasTravel
                        ? activeTravels
                            .map((t, i) => {
                              const st = statusStyles[normalizeStatus(t.status)];
                              return `${i + 1}. ${st?.label ?? t.status} (${formatDate(t.tglBerangkat, "DD MMMM YYYY")} - ${formatDate(t.tglKembali, "DD MMMM YYYY")})`;
                            })
                            .join("\n")
                        : "";

                      return (
                        <div
                          key={day}
                          className={`relative flex min-h-13 items-center px-0.5 transition-colors ${
                            isWeekend(day) ? "bg-rose-50/30" : ""
                          }`}
                          title={`${person.nama}\n${tooltipText}`}
                        >
                          {hasTravel && (
                            <div className="relative w-full group/bar">
                              {/* Bar Utama dengan efek shadow halus */}
                              <div
                                className={`h-2.5 w-full rounded-full shadow-xs transition-transform duration-200 group-hover/bar:scale-y-125 ${style?.bar ?? "bg-blue-500"}`}
                              />
                              
                              {/* Badge Angka Konflik/Dobel yang Elegan */}
                              {activeTravels.length > 1 && (
                                <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[9px] font-semibold text-white shadow-sm ring-2 ring-white">
                                  {activeTravels.length}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}