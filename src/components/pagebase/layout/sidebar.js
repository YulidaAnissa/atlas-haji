"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RxDashboard } from "react-icons/rx";
import {
  FiBriefcase,
  FiChevronDown,
  FiDatabase,
  FiFileText,
  FiMapPin,
  FiUsers,
  FiDollarSign
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
    {
      name: "Perjalanan Dinas",
      icon: <FiBriefcase />,
      path: "/perjalanan-dinas",
    },
    {
      name: "Laporan Perjalanan Dinas",
      icon: <FiFileText />,
      path: "/laporan-perjalanan",
    },
    {
      name: "Biaya Perjalanan",
      icon: <FiDollarSign />,
      path: "/daftar-nominatif",
    },
    {
      name: "Data Master",
      icon: <FiDatabase />,
      children: [
        { name: "Pegawai", icon: <FiUsers />, path: "/pegawai" },
        { name: "Kabupaten / Kota", icon: <FiMapPin />, path: "/kabupaten-kota" },
      ],
    },
  ];

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen?.(false);
    }
  };

  const handleMenuClick = (name, path) => {
    router.push(path);
    localStorage.setItem("activeMenu", name);
    setActiveMenu(name);
    closeSidebarOnMobile();
  };

  const handleDropdownClick = (name) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");

    if (savedMenu) {
      setActiveMenu(savedMenu);

      const parentMenu = menuItems.find((item) =>
        item.children?.some((child) => child.name === savedMenu)
      );

      if (parentMenu) {
        setOpenDropdown(parentMenu.name);
      }
    }
  }, []);

  return (
    <aside
      className={`fixed left-0 top-18 z-40 h-[calc(100vh-4.5rem)] w-[min(18rem,calc(100vw-2rem))] border-r border-[#e7d9af] bg-white shadow-xl shadow-slate-950/10 transition-all duration-300 ease-out lg:w-64 lg:shadow-sm
      ${
        sidebarOpen
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
      }`}
    >
      <nav className="flex h-full flex-col px-3 py-5">
        <div className="mb-4 px-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Main Menu
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isParentActive = item.children?.some(
              (child) => child.name === activeMenu
            );
            const isOpen = openDropdown === item.name;

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleDropdownClick(item.name)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition
                      ${
                        isParentActive || isOpen
                          ? "bg-[#fbf7ec] text-brand"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </span>

                    <FiChevronDown
                      className={`h-4 w-4 shrink-0 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-1 space-y-1 pl-3">
                      {item.children.map((child) => (
                        <button
                          type="button"
                          key={child.name}
                          onClick={() => handleMenuClick(child.name, child.path)}
                          className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition
                            ${
                              activeMenu === child.name
                                ? "bg-brand text-white shadow-sm shadow-[#c9a961]/25"
                                : "text-slate-500 hover:bg-[#fbf7ec] hover:text-brand"
                            }`}
                        >
                          <span className="text-base">{child.icon}</span>
                          <span className="truncate">{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => handleMenuClick(item.name, item.path)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition
                  ${
                    activeMenu === item.name
                      ? "bg-brand text-white shadow-sm shadow-[#c9a961]/25"
                      : "text-slate-600 hover:bg-[#fbf7ec] hover:text-brand"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-[#fbf7ec] px-4 py-3">
          <p className="text-xs font-bold text-slate-700">ATLAS</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Sistem administrasi perjalanan dinas.
          </p>
        </div>
      </nav>
    </aside>
  );
}