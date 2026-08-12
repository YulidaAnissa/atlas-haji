"use client";

import React, { useState } from "react";
import { DaftarNominatifAjuan } from "@/components/elements";
import { formatRangeDate } from "@/utils/date";
import { 
  FileText, 
  CheckSquare, 
  Square, 
  Users, 
  Calendar, 
  MapPin, 
  X, 
  Printer, 
  AlertCircle 
} from "lucide-react";

export default function ListNominatifAjuan({ data, surat, kabKota, dataPegawai }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]); // Menyimpan array key tim yang dicentang

  // 1. Kelompokkan pegawai berdasarkan kombinasi: tglBerangkat, tglKembali, dan tujuan
  const groupedTeams = (data || []).reduce((acc, item) => {
    const key = `${item.tglBerangkat}_${item.tglKembali}_${JSON.stringify(item.tujuan)}`;
    
    if (!acc[key]) {
      acc[key] = {
        tglBerangkat: item.tglBerangkat,
        tglKembali: item.tglKembali,
        tujuan: item.tujuan,
        pegawaiList: []
      };
    }

    const uniqueId = item.nip || item.id || item.nama;

    const existingPegawai = acc[key].pegawaiList.find(
      (p) => (p.nip || p.id || p.nama) === uniqueId
    );

    if (existingPegawai) {
      Object.keys(item).forEach((prop) => {
        if (prop.startsWith("biayaPeng") || prop.startsWith("biayaTrans")) {
          existingPegawai[prop] = (Number(existingPegawai[prop]) || 0) + (Number(item[prop]) || 0);
        }
      });
    } else {
      acc[key].pegawaiList.push({ ...item });
    }

    return acc;
  }, {});

  const groupKeys = Object.keys(groupedTeams);

  // 2. Handle Checkbox Toggle
  const handleToggleAll = (e) => {
    if (e.target.checked) {
      setSelectedKeys(groupKeys);
    } else {
      setSelectedKeys([]);
    }
  };

  const handleToggleOne = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((item) => item !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  // 3. Gabungkan data pegawai dari semua tim yang dicentang
  const getFilteredPegawai = () => {
    if (selectedKeys.length === 0) return [];
    
    let combinedPegawai = [];
    selectedKeys.forEach((key) => {
      if (groupedTeams[key]) {
        combinedPegawai = [...combinedPegawai, ...groupedTeams[key].pegawaiList];
      }
    });
    return combinedPegawai;
  };

  const filteredData = getFilteredPegawai();
  const isAllSelected = groupKeys.length > 0 && selectedKeys.length === groupKeys.length;
  
  return (
    <>
      {/* Tombol Pemicu Modal */}
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        // className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 active:scale-95"
      >
        {/* <FileText className="w-4 h-4" /> */}
        Nominatif Ajuan
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          {/* Modal Container: Full width on mobile, max-width on desktop */}
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    Pilih Tim / Kelompok Perjalanan
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    Pilih satu atau beberapa tim untuk dicetak
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / List Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              
              {/* Opsi Pilih Semua */}
              {groupKeys.length > 0 ? (
                <label className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                  isAllSelected 
                    ? "bg-blue-50/60 border-blue-200 text-blue-900" 
                    : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-800"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleAll}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600 cursor-pointer shrink-0"
                    />
                    <span className="font-semibold text-xs sm:text-sm">Pilih Semua Tim</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm shrink-0">
                    {groupKeys.length} Tim
                  </span>
                </label>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm font-medium">Tidak ada data tim perjalanan ditemukan.</p>
                </div>
              )}

              {/* Loop Daftar Tim */}
              <div className="space-y-2.5 pt-1">
                {groupKeys.map((key, index) => {
                  const group = groupedTeams[key];
                  const tujuanStr = Array.isArray(group.tujuan) 
                    ? group.tujuan.join(", ") 
                    : group.tujuan;
                  const isChecked = selectedKeys.includes(key);

                  return (
                    <label 
                      key={key} 
                      className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        isChecked 
                          ? "bg-blue-50/40 border-blue-300 shadow-sm ring-1 ring-blue-300/50" 
                          : "bg-white hover:bg-slate-50/80 border-slate-200/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleOne(key)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            Tim {index + 1}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md shrink-0">
                            {group.pegawaiList.length} Pegawai
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-slate-500">
                          <p className="flex items-start sm:items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                            <span className="line-clamp-2 sm:truncate">Tujuan: <strong className="text-slate-700">{tujuanStr}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{formatRangeDate(group.tglBerangkat, group.tglKembali, "DD MMM YYYY")}</span>
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Info Pegawai Terpilih */}
              <div className="text-xs text-slate-600 text-center sm:text-left">
                Terpilih: <strong className="text-slate-900 font-semibold">{filteredData.length}</strong> pegawai dari <strong className="text-slate-900 font-semibold">{selectedKeys.length}</strong> tim
              </div>

              {/* Container Tombol: Grid 1 Kolom (Menumpuk/Dua Baris) di HP, Sejajar di Tablet+ */}
              <div className="grid grid-cols-1 sm:flex sm:items-center gap-2.5">
                
                {/* Tombol Cetak / Aksi (Dipindah ke baris pertama di HP agar lebih utama) */}
                <div className={`w-full sm:w-auto ${filteredData.length === 0 ? "opacity-40 pointer-events-none" : ""}`}>
                  <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer">
                    <Printer className="w-3.5 h-3.5 shrink-0" />
                    <DaftarNominatifAjuan data={filteredData} dataPegawai={dataPegawai} surat={surat} kabKota={kabKota} />
                  </div>
                </div>

                {/* Tombol Batal (Di baris kedua di HP) */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all shadow-sm text-center"
                >
                  Batal
                </button>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}