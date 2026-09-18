"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { FiChevronDown, FiLogOut, FiUser, FiBell, FiCompass } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { accessTokenStorage, profileStorage } from "@/utils/storage";
import { formatDate, getDistance } from "@/utils/date";

function removeStorage() {
  accessTokenStorage.remove();
  profileStorage.remove();
  localStorage.clear();
}

export default function HeaderPage({ sidebarOpen, setSidebarOpen, data, handleIsRead, handleIsReadOne }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [profil, setProfil] = useState(null);

  // Perhitungan unread disesuaikan dengan properti isRead dari backend
  const unreadCount = data?.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    if (typeof handleIsRead === "function") {
      handleIsRead();
    }
  };

  const handleItemClick = (item) => {
    // Jika belum dibaca dan fungsi handleIsReadOne tersedia, panggil untuk update status baca per item
    if (!item.isRead && typeof handleIsReadOne === "function") {
      handleIsReadOne(item.idPerjalananPegawai);
    }

    router.push(`/perjalanan-dinas/${item.idSurat}`);
  };

  const handleViewAll = () => {
    setOpenNotif(false);
    router.push("/perjalanan-dinas/filter");
  };

  const handleLogout = () => {
    removeStorage();
    router.push("/login");
  };

  useEffect(() => {
    const storedProfile = profileStorage.get();
    setProfil(storedProfile);
  }, []);

  const datePerjalanan = (tglBerangkat, tglKembali) => {
    const berangkat = formatDate(tglBerangkat, "DD MMMM YYYY");
    const kembali = formatDate(tglKembali, "DD MMMM YYYY");
    if (berangkat === kembali) {
      return berangkat;
    } else {
      return (
        <>
          {berangkat} s/d. {kembali}
        </>
      );
    }
  };

  return (
    <header className="fixed left-0 top-0 z-50 flex h-18 w-full items-center justify-between border-b border-[#e7d9af] bg-white/95 px-3 shadow-sm backdrop-blur-md sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          onClick={() => setSidebarOpen((value) => !value)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-[#f8f1df] hover:text-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
        >
          <GiHamburgerMenu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 sm:h-11 sm:w-11">
            <Image
              src="/logo.png"
              alt="Logo Perjalanan"
              width={36}
              height={36}
              priority
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </div>

          <div className="min-w-0 leading-none">
            <p className="truncate text-xl font-black tracking-wide text-slate-950 sm:text-2xl">
              ATLAS
            </p>
            <p className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-brand xs:block sm:block">
              Aplikasi Tata Kelola Administrasi Perjalanan Dinas
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Kanan Header (Notifikasi & Profil) */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* --- DROPDOWN NOTIFIKASI TRAVEL --- */}
        <div className="relative">
          <button
            type="button"
            aria-label="Buka notifikasi perjalanan"
            onClick={() => {
              setOpenNotif((value) => !value);
              setOpenMenu(false);
            }}
            className="relative grid h-10 w-10 place-items-center rounded-2xl border border-transparent text-slate-700 transition hover:border-[#eadfbe] hover:bg-[#fbf7ec] focus:outline-none focus:ring-4 focus:ring-brand/20"
          >
            <FiBell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/75 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <p className="text-base font-bold text-slate-900">Jadwal Perjalanan</p>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-sm font-semibold text-brand transition-colors hover:text-brand/85 hover:underline"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              {/* Content List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {data?.length > 0 ? (
                  data?.map((item, keys) => (
                    <div
                      key={item.idPerjalananPegawai ?? keys}
                      onClick={() => handleItemClick(item)}
                      className={`group flex cursor-pointer gap-4 px-5 py-4 transition-all hover:bg-slate-50/80 ${
                        !item.isRead ? "bg-brand/4" : ""
                      }`}
                    >
                      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand shadow-sm transition-transform group-hover:scale-105">
                        <FiCompass className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {datePerjalanan(item.tglBerangkat, item.tglKembali)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed font-medium">
                          {item.tujuan}
                        </p>
                        <p className="mt-1.5 text-xs font-medium text-slate-400">
                          {getDistance(item.updateAt)}
                        </p>
                      </div>
                      {!item.isRead && (
                        <span className="h-2.5 w-2.5 shrink-0 self-center rounded-full bg-brand shadow-sm shadow-brand/50"></span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm font-medium text-slate-400">
                    Tidak ada jadwal perjalanan saat ini.
                  </div>
                )}
              </div>

              {/* Footer / Tombol Lihat Semua */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-center">
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="w-full rounded-2xl py-2.5 text-sm font-bold text-brand transition-all hover:bg-brand/10 active:scale-[0.98]"
                >
                  Lihat Semua Perjalanan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- DROPDOWN PROFIL --- */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpenMenu((value) => !value);
              setOpenNotif(false);
            }}
            className="flex items-center gap-2 rounded-2xl border border-transparent px-2 py-2 text-slate-700 transition hover:border-[#eadfbe] hover:bg-[#fbf7ec] focus:outline-none focus:ring-4 focus:ring-brand/20 sm:gap-3 sm:px-3"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white shadow-sm">
              <FiUser className="h-4 w-4" />
            </div>

            <div className="hidden max-w-40 text-left md:block">
              <p className="truncate text-sm font-bold text-slate-800">
                {profil?.nama ?? " "}
              </p>
              <p className="truncate text-xs text-slate-400">
                {profil?.jabatan ?? " "}
              </p>
            </div>

            <FiChevronDown
              className={`h-4 w-4 text-slate-400 transition ${
                openMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-1.5rem)] max-w-64 overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:w-64">
              <div className="bg-[#fbf7ec] px-4 py-4">
                <p className="truncate text-sm font-bold text-slate-900">
                  {profil?.nama ?? " "}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {profil?.jabatan ?? " "}
                </p>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <FiLogOut className="h-4 w-4" />
                  Keluar Akun
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}