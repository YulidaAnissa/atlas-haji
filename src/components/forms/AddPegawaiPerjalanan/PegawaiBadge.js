"use client";

import React from "react";
import { FiUsers } from "react-icons/fi";

export default function PegawaiBadge({ nip, nama, className = "" }) {
  if (!nip) return null;

  return (
    <div 
      className={`inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-xs transition hover:bg-slate-100/80 ${className}`}
    >
      {/* Avatar Icon Placeholder */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand font-bold text-xs">
        {nama ? nama.substring(0, 2).toUpperCase() : <FiUsers className="h-4 w-4" />}
      </div>

      {/* Info NIP & Nama */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-slate-900 select-all">
          {nama}
        </span>
        {nip && (
          <span className="truncate text-xs font-medium text-slate-500">
            {nip}
          </span>
        )}
      </div>
    </div>
  );
}