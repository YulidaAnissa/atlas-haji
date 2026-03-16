"use client";
import React, { useState } from "react";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  onVerifikasi, onTolak
}) {
  const [showAlasan, setShowAlasan] = useState(false);
  const [alasan, setAlasan] = useState("");

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Verifikasi Pembiayaan
      </h2>
      <div className="min-w-3/4 grid grid-cols-2 bg-gray-50 rounded-xl shadow-lg px-6 py-4 text-left mb-4">
        <ol className="relative border-l border-indigo-300 space-y-6">
          <li className="ml-6">
            <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
            <h3 className="font-semibold text-gray-900">Nama</h3>
            <p className="text-sm text-gray-600">{data?.nama}</p>
          </li>
        </ol>
        <ol className="relative border-l border-indigo-300 space-y-6">
          <li className="ml-6">
            <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-1.5 border border-white"></div>
            <h3 className="font-semibold text-gray-900">NIP</h3>
            <p className="text-sm text-gray-600">{data?.nip}</p>
          </li>
        </ol>
      </div>
      <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md">
        {/* Biaya Transportasi */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Biaya Transportasi</h3>
          <p className="text-gray-600">Rp {data?.biayaTrans?.toLocaleString() || 0}</p>
          {data.buktiTrans && (
            <img
              src={data.buktiTrans}
              alt="Bukti Transportasi"
              className="w-full max-w-sm border rounded-md mx-auto"
            />
          )}
        </div>

        {/* Biaya Penginapan */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Biaya Penginapan</h3>
          <p className="text-gray-600">Rp {data?.biayaPeng?.toLocaleString() || 0}</p>
          {data.buktiPeng && (
            <img
              src={data.buktiPeng}
              alt="Bukti Penginapan"
              className="w-full max-w-sm border rounded-md mx-auto"
            />
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Verifikasi
            </button>
            <button
              onClick={() => setShowAlasan(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Tolak
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Keluar
          </button>
        </div>

        {/* Field Alasan jika ditolak */}
        {showAlasan && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Alasan Penolakan
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 focus:ring focus:ring-red-300"
              placeholder="Tuliskan alasan penolakan..."
            />
            <button
              onClick={() => onReject(data, alasan)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Kirim Penolakan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}