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
  FaBell,
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
import { formatDate } from "@/utils/date";

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

    setSelectedKantor(userProfile?.idKantor || "");
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
  
  const { data: perjalananData, total } = usePerjalananPegawai({
    params: { 
      status: "tolak",
      ...(targetKantor && { idKantor: targetKantor }),
      page: 1, 
      size: 3,
      ...(profil?.role !== "admin" && profil?.nip && { nip: profil.nip })
    },
});

  // Ambil data untuk pengingat perjalanan besok
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);
  const formattedTomorrowStr = `${String(tomorrowDate.getDate()).padStart(2, '0')} ${months[tomorrowDate.getMonth()]} ${tomorrowDate.getFullYear()}`;

  const { data: pengingatBesok } = usePerjalananPegawai({
    params: {
      ...(targetKantor && { idKantor: targetKantor }),
      page: 1, 
      size: 5
    },
  });

  const formattedTargetDate = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

  const filteredBesok = Array.isArray(pengingatBesok) 
    ? pengingatBesok.filter(item => {
        const formattedItemDate = formatDate(item.tglBerangkat, "YYYY-MM-DD");
        const isTomorrow = formattedItemDate === formattedTargetDate;
        const isForThisUser = profil?.nip ? item.nip === profil.nip : true;
        
        return isTomorrow && isForThisUser;
      })
    : [];

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

      {/* NOTIFIKASI PENGINGAT PERJALANAN BESOK KHUSUS AKUN PROFIL */}
      {filteredBesok.length > 0 && (
        <section className="mb-6 overflow-hidden rounded-2xl border border-amber-200/80 bg-linear-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-4">
            {/* Icon Container dengan efek pulse halus */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500"></span>
              </span>
              <FaBell className="text-lg animate-bounce" />
            </div>

            {/* Konten Teks & Informasi */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-bold tracking-wide text-amber-950">
                  Pengingat Jadwal Perjalanan Dinas
                </h2>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100/90 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/80 mt-1.5 sm:mt-0 shadow-2xs">
                  📅 Besok, {formattedTomorrowStr}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-amber-900/80 leading-relaxed">
                Halo <span className="font-bold text-amber-950">{profil?.nama || "Pegawai"}</span>, Anda memiliki agenda perjalanan dinas aktif untuk esok hari dengan detail berikut:
              </p>

              {/* Daftar Tujuan Perjalanan */}
              <div className="mt-4 flex flex-col gap-2.5">
                {filteredBesok.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-white/90 border border-amber-200/70 px-4.5 py-3 text-sm shadow-2xs transition-all hover:bg-white hover:border-amber-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-gray-900">
                        Tujuan: <span className="text-amber-800 font-bold">{item.tujuan}</span>
                      </span>
                    </div>

                    {item.catatan && (
                      <div className="flex items-center gap-2 text-gray-600 bg-amber-50/70 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                        <span className="font-semibold text-xs text-amber-900">Catatan:</span>
                        <span className="italic text-xs text-gray-700">{item.catatan}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

            {perjalananData?.length > 0 && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-red-200/80 bg-linear-to-r from-red-50/90 via-rose-50/40 to-red-50/90 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-4">
            {/* Icon Container dengan badge merah */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20">
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500"></span>
              </span>
              <span className="text-lg font-bold">!</span>
            </div>

            {/* Konten Teks & Informasi */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-bold tracking-wide text-red-950">
                  Pengajuan Ditolak
                </h2>
                
                <button
                  type="button"
                  onClick={() => router.push("/perjalanan-dinas/filter?status=tolak")}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-100/90 px-3 py-1 text-xs font-bold text-red-900 border border-red-200/80 mt-1.5 sm:mt-0 transition hover:bg-red-200"
                >
                  Lihat Semua &rarr;
                </button>
              </div>

              <p className="mt-1.5 text-sm text-red-900/80 leading-relaxed">
                Terdapat <span className="font-bold text-red-950">{total} perjalanan</span> yang memerlukan peninjauan kembali akibat pengajuan ditolak:
              </p>

              {/* Daftar Item Perjalanan Ditolak */}
              <div className="mt-4 flex flex-col gap-2.5">
                {perjalananData.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => router.push(`/laporan-perjalanan/${item.idSurat}`)}
                    className="group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-white/90 border border-red-200/70 px-4.5 py-3 text-sm shadow-2xs transition-all hover:bg-white hover:border-red-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      <span className="font-semibold text-gray-900">
                        {/* Menampilkan nama pegawai dan detail tujuannya */}
                        {item.namaPegawai || item.nama || "Pegawai"}: <span className="text-red-800 font-bold">{item.tujuan || item.kegiatan || "Detail Perjalanan"}</span>
                      </span>
                    </div>

                    <span className="text-xs font-medium text-red-600 group-hover:underline">
                      Tinjau Detail &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
                labelKey="unitKantor"
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