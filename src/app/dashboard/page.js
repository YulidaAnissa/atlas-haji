"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaCar,
  FaCreditCard,
  FaCheckCircle,
  FaHome,
  FaCalendarAlt,
  FaBriefcase,
  FaFilter,
} from "react-icons/fa";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import DashboardPage from "@/components/pagebase";
import {
  StatCard,
  MonthlySchedule,
  NotificationDashboard,
  DropdownFilter,
} from "@/components/elements";
import {
  useDashboardFilter,
  useDashboardSummary,
  usePerjalananPegawai,
  useKantor,
} from "@/hooks/useData";
import { profileStorage } from "@/utils/storage";

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
  const [profil, setProfil] = useState(null);
  const [selectedKantor, setSelectedKantor] = useState("");

  // Ambil profil dan set default selectedKantor jika bukan admin (idKantor !== "1")
  useEffect(() => {
    const userProfile = profileStorage.get();
    setProfil(userProfile);

    setSelectedKantor(userProfile.idKantor);
  }, []);

  // Tentukan target kantor: admin (idKantor === "1") bisa bebas pilih, jika tidak dikunci ke profil user
  const targetKantor = profil?.idKantor === "1" 
    ? selectedKantor 
    : (selectedKantor || profil?.idKantor);

  // Hook Dashboard Filter dengan parameter bulan, tahun, dan kantor
  const { data, isLoading } = useDashboardFilter({
    params: { 
      month, 
      year,
      ...(targetKantor && { idKantor: targetKantor })
    },
  });

  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary({
    params: { 
      month, 
      year,
      ...(targetKantor && { idKantor: targetKantor }) 
    }
  });
  
  const { data: perjalananData } = usePerjalananPegawai({
    params: { 
      status: "tolak",
      ...(targetKantor && { idKantor: targetKantor })
    },
  });

  const { data: dataKantor, isLoading: loadingKantor } = useKantor();

  const handlePerjalananClick = (status) => {
    router.push(`/perjalanan-dinas/filter?status=${status}`);
  };

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
                  Pantau ringkasan perjalanan, status pengajuan pembayaran, dan jadwal perjalanan dinas.
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

      {/* FILTER BAR DI ATAS STAT CARD */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100 text-gray-600">
              <FaFilter className="text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Filter Data Dashboard</h2>
              <p className="text-xs text-gray-500">Sesuaikan periode dan kantor untuk melihat statistik</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {profil?.idKantor === "1" && (
              <DropdownFilter
                options={dataKantor ?? []}
                value={selectedKantor}
                onChange={setSelectedKantor}
                placeholder="Semua Kantor"
                valueKey="idKantor"
                labelKey="nama"
                icon={FaBriefcase}
                loading={loadingKantor}
                className="w-full sm:w-80"
              />
            )}

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
      </section>

      {perjalananData?.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <h2 className="text-base font-semibold text-gray-900">
                  Pengajuan Ditolak
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {perjalananData.length} perjalanan perlu ditinjau
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/perjalanan-dinas/filter?status=tolak")}
              className="text-sm font-medium text-gray-500 transition hover:text-red-600"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {perjalananData.map((item, index) => (
              <NotificationDashboard
                key={index}
                data={item}
                type="danger"
                onDetail={() =>
                  router.push(`/laporan-perjalanan/${item.idSurat}`)
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* STAT CARDS */}
      <section className="mb-10">
        {isSummaryLoading ? (
          <LoadingState label="Memuat ringkasan dashboard..." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Perjalanan"
            data={summary?.perjalanan ?? 0}
              count={summary?.perjalanan ?? 0}
              subtitle="Sedang berlangsung atau dijadwalkan"
              color="bg-gradient-to-br from-blue-500 to-blue-700"
              icon={<FaCar />}
              onClick={() => handlePerjalananClick("perjalanan")}
            />
            <StatCard
              title="Pengajuan"
              count={summary?.pengajuan ?? 0}
              subtitle="Menunggu verifikasi pembayaran"
              color="bg-gradient-to-br from-orange-400 to-orange-600"
              icon={<FaCreditCard />}
              onClick={() => handlePerjalananClick("pengajuan")}
            />
            <StatCard
              title="Verifikasi"
              count={summary?.verifikasi_pembayaran ?? 0}
              subtitle="Terverifikasi, menunggu pembayaran"
              color="bg-gradient-to-br from-yellow-400 to-amber-600"
              icon={<FaCreditCard />}
              onClick={() => handlePerjalananClick("verifikasi")}
            />
            <StatCard
              title="Selesai"
              count={summary?.selesai ?? 0}
              subtitle="Telah dibayarkan dan selesai"
              color="bg-gradient-to-br from-green-500 to-emerald-700"
              icon={<FaCheckCircle />}
              onClick={() => handlePerjalananClick("selesai")}
            />
          </div>
        )}
      </section>

      {/* JADWAL BULANAN */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Jadwal Bulanan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Daftar perjalanan dinas berdasarkan filter periode dan kantor yang dipilih.
          </p>
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