"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiX, FiSearch } from "react-icons/fi";

export default function DropdownFilter({
  label = "Pilih Data",
  placeholder = "Semua Data",
  options = [],
  value = "",
  onChange = () => {},
  icon: Icon = null,
  loading = false,
  valueKey = "value",
  labelKey = "label",
  className = "sm:w-64",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-focus input pencarian ketika dropdown dibuka & reset query saat ditutup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close dropdown saat click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedObj = options.find(
    (item) => String(item[valueKey]) === String(value)
  );

  // Filter opsi berdasarkan query pencarian (case-insensitive)
  const filteredOptions = options.filter((item) => {
    const labelValue = item[labelKey] ? String(item[labelKey]) : "";
    return labelValue.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`group flex h-11 w-full items-center justify-between rounded-xl border px-3.5 text-xs font-semibold transition-all duration-200 ${
          isOpen
            ? "border-brand bg-white ring-4 ring-brand/15 shadow-sm"
            : "border-slate-200/80 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
        } ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                value
                  ? "text-brand"
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
            />
          )}
          <span
            className={`truncate ${
              value ? "text-slate-900 font-bold" : "text-slate-500"
            }`}
          >
            {selectedObj ? selectedObj[labelKey] : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Reset Filter Button */}
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setIsOpen(false);
              }}
              className="rounded-md p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              title="Reset filter"
            >
              <FiX className="h-3.5 w-3.5" />
            </span>
          )}
          <FiChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu (Floating Popover) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* 💡 Input Search Box */}
          <div className="relative mb-1 px-1 pt-1">
            <div className="flex h-9 w-full items-center rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15">
              <FiSearch className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                >
                  <FiX className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="my-1 border-t border-slate-100" />

          {/* Scrollable Container untuk Options */}
          <div className="max-h-52 overflow-y-auto">
            {/* Option Default / Reset (hanya tampil jika tidak sedang mencari atau pencarian cocok) */}
            {!searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  !value
                    ? "bg-brand/10 text-brand"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{placeholder}</span>
                {!value && <FiCheck className="h-4 w-4 text-brand" />}
              </button>
            )}

            {/* List Options Terfilter */}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                Pencarian tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((item) => {
                const itemVal = item[valueKey];
                const itemLabel = item[labelKey];
                const isSelected = String(value) === String(itemVal);

                return (
                  <button
                    key={itemVal}
                    type="button"
                    onClick={() => {
                      onChange(itemVal);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-brand/10 text-brand font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{itemLabel}</span>
                    {isSelected && (
                      <FiCheck className="h-4 w-4 text-brand shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}