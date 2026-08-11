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

  // 1. Kelompokkan pegawai berdasarkan kombinasi: tglBerangkat, tglKembali, dan tujuan (sekaligus handle double & sum biayaPeng/biayaTrans)
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

    // Tentukan pengenal unik pegawai (misal: nip, id, atau nama)
    const uniqueId = item.nip || item.id || item.nama;

    // Cek apakah pegawai dengan NIP tersebut sudah ada di pegawaiList pada tim ini
    const existingPegawai = acc[key].pegawaiList.find(
      (p) => (p.nip || p.id || p.nama) === uniqueId
    );

    if (existingPegawai) {
      // Jika sudah ada, loop semua properti untuk menjumlahkan apa pun yang berawalan "biayaPeng" atau "biayaTrans"
      Object.keys(item).forEach((prop) => {
        if (prop.startsWith("biayaPeng") || prop.startsWith("biayaTrans")) {
          existingPegawai[prop] = (Number(existingPegawai[prop]) || 0) + (Number(item[prop]) || 0);
        }
      });
    } else {
      // Jika belum ada, masukkan sebagai data baru (gunakan spread agar tidak mengubah referensi asli)
      acc[key].pegawaiList.push({ ...item });
    }

    return acc;
  }, {});

  console.log("groupedTeams", groupedTeams);

  const groupKeys = Object.keys(groupedTeams);

  // 2. Handle Checkbox Toggle (Pilih semua atau satuan)
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
        Daftar Nominatif Ajuan
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilih Tim / Kelompok Perjalanan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih satu atau beberapa tim untuk dicetak daftar nominatifnya
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / List Content */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              
              {/* Opsi Pilih Semua */}
              {groupKeys.length > 0 ? (
                <label className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isAllSelected 
                    ? "bg-blue-50/60 border-blue-200 text-blue-900" 
                    : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-800"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleAll}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span className="font-semibold text-sm">Pilih Semua Tim</span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                    {groupKeys.length} Tim Tersedia
                  </span>
                </label>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Tidak ada data tim perjalanan ditemukan.</p>
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
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isChecked 
                          ? "bg-blue-50/40 border-blue-300 shadow-sm ring-1 ring-blue-300/50" 
                          : "bg-white hover:bg-slate-50/80 border-slate-200/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleOne(key)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-sm">
                            Tim {index + 1}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            {group.pegawaiList.length} Pegawai
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-slate-500">
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Tujuan: <strong className="text-slate-700">{tujuanStr}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatRangeDate(group.tglBerangkat, group.tglKembali, "DD MMM YYYY")}</span>
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Terpilih: <strong className="text-slate-900 font-semibold">{filteredData.length}</strong> pegawai dari <strong className="text-slate-900 font-semibold">{selectedKeys.length}</strong> tim
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
                >
                  Batal
                </button>
                
                {/* Tombol Cetak / Aksi */}
                <div className={`${filteredData.length === 0 ? "opacity-40 pointer-events-none" : ""}`}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer">
                    <Printer className="w-3.5 h-3.5" />
                    <DaftarNominatifAjuan data={filteredData} dataPegawai={dataPegawai} surat={surat} kabKota={kabKota} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}