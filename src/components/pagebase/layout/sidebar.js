"use client";
import { RxDashboard } from "react-icons/rx";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ sidebarOpen }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  console.log(openDropdown);

  const handleMenuClick = (name, path) => {
    router.push(path);
    localStorage.setItem("activeMenu", name);
    setActiveMenu(name);
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    if (savedMenu) {
      setActiveMenu(savedMenu);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
    { name: "Perjalanan Dinas", icon: <RxDashboard />, path: "/perjalanan-dinas" },
    { name: "Laporan Perjalanan Dinas", icon: <RxDashboard />, path: "/laporan-perjalanan" },
    { name: "Daftar Nominatif", icon: <RxDashboard />, path: "/daftar-nominatif" },
    {
      name: "Data Master",
      icon: <RxDashboard />,
      children: [
        { name: "Pegawai", path: "/pegawai" },
        { name: "Kabupaten / Kota", path: "/kabupaten-kota" },
      ],
    },

  ];

  return (
    <aside
      className={`fixed top-18 left-0 h-full w-64 bg-brand shadow-md flex flex-col
      transform transition-all duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
    >
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.name ? null : item.name)
                  }
                  className={`flex items-center justify-between w-full p-4 hover:bg-gray-50 transition
                    ${activeMenu === item.name ? "bg-gray-100 shadow-lg" : ""}`}
                >
                  <div className="flex items-center gap-x-3">
                    {item.icon}
                    {item.name}
                  </div>
                  <span>{openDropdown === item.name ? "▲" : "▼"}</span>
                </button>
                {(openDropdown === item.name 
                  || activeMenu === "Pegawai" 
                  || activeMenu === "Kabupaten / Kota") && (
                  <div className="ml-8 mt-2">
                    {item.children.map((child) => (
                      <button
                        key={child.name}
                        onClick={() => handleMenuClick(child.name, child.path)}
                        className={`block w-full text-left p-4 hover:bg-gray-50 transition
                          ${activeMenu === child.name ? "bg-gray-100" : ""}`}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleMenuClick(item.name, item.path)}
                className={`flex items-center gap-x-3 w-full px-4 py-4 hover:bg-gray-50 transition
                  ${activeMenu === item.name ? "bg-gray-100 shadow-lg" : ""}`}
              >
                {item.icon}
                {item.name}
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}