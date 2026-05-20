"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCar,
  FaCreditCard,
  FaCheckCircle,
  FaHome,
  FaCalendarAlt,
} from "react-icons/fa";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import DashboardPage from "@/components/pagebase";
import {
  StatCard,
  MonthlySchedule,
  NotificationDashboard,
} from "@/components/elements";
import {
  useDashboardFilter,
  useDashboardSummary,
  useNotifPegawai,
} from "@/hooks/useData";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const years = [2025, 2026, 2027];

function LoadingState({ label = "Memuat data..." }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress size={26} />
        <Typography sx={{ ml: 2, color: "#6b7280", fontSize: 14 }}>
          {label}
        </Typography>
      </Box>
    </div>
  );
}

export default function PerjalananDinasPage() {
  const router = useRouter();
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const { data, isLoading } = useDashboardFilter({
    urlParams: { month, year },
  });

  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();

  const { data: notifications } = useNotifPegawai({
    params: { status: "tolak" },
  });

  return (
    <DashboardPage className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <header className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-gray-50 via-white to-blue-50 px-6 py-7 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                <FaHome className="text-xl" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Dashboard
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  Perjalanan Dinas
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Pantau ringkasan perjalanan, status pengajuan pembayaran, dan
                  jadwal perjalanan dinas berdasarkan bulan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-xs text-gray-500">Periode aktif</p>
                <p className="text-sm font-semibold text-gray-900">
                  {months[month - 1]} {year}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {notifications?.length > 0 && (
        <section className="mb-8 space-y-3">
          {notifications.map((notif) => (
            <NotificationDashboard
              key={notif.idSurat}
              message="Pembiayaan perjalanan dinas anda ditolak."
              note={notif.catatan}
              type="danger"
              onDetail={() => router.push(`/daftar-nominatif/${notif.idSurat}`)}
            />
          ))}
        </section>
      )}

      <section className="mb-10">
        {isSummaryLoading ? (
          <LoadingState label="Memuat ringkasan dashboard..." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Perjalanan"
              count={summary?.perjalanan ?? 0}
              subtitle="Sedang berlangsung atau dijadwalkan"
              color="bg-gradient-to-br from-blue-500 to-blue-700"
              icon={<FaCar />}
            />
            <StatCard
              title="Pengajuan"
              count={summary?.pengajuan ?? 0}
              subtitle="Menunggu verifikasi pembayaran"
              color="bg-gradient-to-br from-orange-400 to-orange-600"
              icon={<FaCreditCard />}
            />
            <StatCard
              title="Verifikasi"
              count={summary?.verifikasi_pembayaran ?? 0}
              subtitle="Terverifikasi, menunggu pembayaran"
              color="bg-gradient-to-br from-yellow-400 to-amber-600"
              icon={<FaCreditCard />}
            />
            <StatCard
              title="Selesai"
              count={summary?.selesai ?? 0}
              subtitle="Telah dibayarkan dan selesai"
              color="bg-gradient-to-br from-green-500 to-emerald-700"
              icon={<FaCheckCircle />}
            />
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-gray-200 bg-gray-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Jadwal Bulanan
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pilih bulan dan tahun untuk melihat daftar perjalanan dinas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Bulan</span>
              <select
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                {months.map((monthName, index) => (
                  <option key={monthName} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Tahun</span>
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                {years.map((yearItem) => (
                  <option key={yearItem} value={yearItem}>
                    {yearItem}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <LoadingState label="Memuat jadwal perjalanan..." />
          ) : (
            <MonthlySchedule data={data} month={month} year={year} />
          )}
        </div>
      </section>
    </DashboardPage>
  );
}