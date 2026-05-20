import React from "react";

export default function MonthlySchedule({ data = [], month, year }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const statusStyles = {
    perjalanan: {
      label: "Perjalanan",
      bar: "bg-blue-500",
      dot: "bg-blue-500",
    },
    pengajuan: {
      label: "Pengajuan",
      bar: "bg-orange-500",
      dot: "bg-orange-500",
    },
    verifikasi: {
      label: "Verifikasi",
      bar: "bg-amber-500",
      dot: "bg-amber-500",
    },
    selesai: {
      label: "Selesai",
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
    },
  };

  const normalizeStatus = (status) => {
    if (status === "tolak") return "pengajuan";
    return status;
  };

  const getTravelByDay = (person, day) => {
    const current = new Date(year, month - 1, day);

    return person.perjalanan?.find((item) => {
      const start = new Date(item.tglBerangkat);
      const end = new Date(item.tglKembali);

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
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-semibold text-gray-800">
          Belum ada jadwal perjalanan
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Data perjalanan untuk periode ini belum tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(statusStyles).map(([status, style]) => (
          <div
            key={status}
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
            {style.label}
          </div>
        ))}
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-gray-200 bg-gray-50">
          <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                className={`py-4 text-center text-[10px] font-semibold ${
                  isWeekend(day) ? "text-red-500" : "text-gray-500"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.map((person, index) => (
            <div
              key={`${person.nama}-${index}`}
              className="grid grid-cols-[180px_minmax(0,1fr)] transition hover:bg-gray-50"
            >
              <div className="flex min-h-14 min-w-0 items-center px-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {person.nama}
                  </p>
                </div>
              </div>

              <div
                className="grid min-w-0"
                style={{
                  gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
                }}
              >
                {days.map((day) => {
                  const travel = getTravelByDay(person, day);
                  const status = normalizeStatus(travel?.status);
                  const style = statusStyles[status];

                  return (
                    <div
                      key={day}
                      className={`flex min-h-14 items-center px-px ${
                        isWeekend(day) ? "bg-red-50/40" : ""
                      }`}
                      title={
                        travel
                          ? `${person.nama} - ${style?.label ?? travel.status}`
                          : ""
                      }
                    >
                      {style && (
                        <div
                          className={`h-2.5 w-full rounded-full ${style.bar}`}
                        />
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
  );
}