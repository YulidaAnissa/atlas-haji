"use client";
import { useState } from "react";
import DashboardPage from "@/components/pagebase";
import { StatCard, MonthlySchedule } from "@/components/elements";
import { FaCalendarAlt, FaPlayCircle, FaCheckCircle, FaHome } from "react-icons/fa";
import { useDashboardFilter, useDashboardSummary } from "@/hooks/useData";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function PerjalananDinasPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // getMonth() mulai dari 0
  const [year, setYear] = useState(today.getFullYear());

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  const years = [2025, 2026, 2027];
  const { data, isLoading } = useDashboardFilter({ urlParams: { month, year }});
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();

  return (
    <DashboardPage className="p-16 mx-auto">
      <div className="flex items-center gap-3 mb-6">
        {/* Ikon dalam lingkaran */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand text-white transition-colors shadow-md">
          <FaHome className="text-xl" />
        </div>
        {/* Teks */}
        <h1 className="text-lg font-semibold tracking-wide">
          Dashboard
        </h1>
      </div>

    {/* </button> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isSummaryLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, my: 'auto' }}>Loading summary...</Typography>
          </Box>
        ) : (
          <>
            <StatCard
              label="Dijadwalkan"
              count={summary?.dijadwalkan ?? 0}
              color="bg-gradient-to-r from-blue-100 to-indigo-200"
              iconBg="bg-blue-400"
              icon={<FaCalendarAlt />}
            />
            <StatCard
              label="Berlangsung"
              count={summary?.berlangsung ?? 0}
              color="bg-gradient-to-r from-yellow-100 to-orange-200"
              iconBg="bg-orange-400"
              icon={<FaPlayCircle />}
            />
            <StatCard
              label="Selesai"
              count={summary?.selesai ?? 0}
              color="bg-gradient-to-r from-green-100 to-teal-200"
              iconBg="bg-green-400"
              icon={<FaCheckCircle />}
            />
          </>
        )}
      </div>
      <div className="space-y-6 mt-10">
        {/* Dropdown filter bulan */}
        <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Bulan:</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Tahun:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel jadwal */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, my: 'auto' }}>Loading data...</Typography>
          </Box>
        ) : (
          <MonthlySchedule data={data} month={month} year={year} />
        )}
      </div>


    </DashboardPage>
  );
}
