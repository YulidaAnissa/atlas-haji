"use client";

import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({
  value = "",
  onChange = () => {},
  placeholder = "Cari data...",
  className = "",
  id = "search",
  name = "search",
}) {
  return (
    <div
      className={`flex h-11 w-full sm:w-72 md:w-80 shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 md:max-w-sm ${className}`}
    >
      <FiSearch className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

      <input
        type="text"
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
      />

      {value && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          className="ml-2 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          onClick={() => onChange({ target: { value: "" } })}
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}