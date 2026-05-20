"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { accessTokenStorage, profileStorage } from "@/utils/storage";

function removeStorage() {
  accessTokenStorage.remove();
  profileStorage.remove();
  localStorage.clear();
}

export default function HeaderPage({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [profil, setProfil] = useState(null);

  const handleLogout = () => {
    removeStorage();
    router.push("/login");
  };

  useEffect(() => {
    const storedProfile = profileStorage.get();
    setProfil(storedProfile);
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 flex h-18 w-full items-center justify-between border-b border-[#e7d9af] bg-white/95 px-3 shadow-sm backdrop-blur-md sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          onClick={() => setSidebarOpen((value) => !value)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-[#f8f1df] hover:text-brand focus:outline-none focus:ring-4 focus:ring-[#c9a961]/20"
        >
          <GiHamburgerMenu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 sm:h-11 sm:w-11">
            <Image
              src="/logo.png"
              alt="Garuda Emblem"
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
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpenMenu((value) => !value)}
          className="flex items-center gap-2 rounded-2xl border border-transparent px-2 py-2 text-slate-700 transition hover:border-[#eadfbe] hover:bg-[#fbf7ec] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/20 sm:gap-3 sm:px-3"
        >
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white shadow-sm">
            <FiUser className="h-4 w-4" />
          </div>

          <div className="hidden max-w-40 text-left md:block">
            <p className="truncate text-sm font-bold text-slate-800">
              {profil?.nama ?? "Pengguna"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {profil?.jabatan ?? "Akun aktif"}
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
                {profil?.nama ?? "Pengguna"}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {profil?.jabatan ?? "Akun aktif"}
              </p>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}