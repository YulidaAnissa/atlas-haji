"use client";
import { RxDashboard } from "react-icons/rx";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({ sidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (name, path) => {
    router.push(path);
    localStorage.setItem("activeMenu", name);
    setActiveMenu(name);
  };
 
  // Ambil nilai dari localStorage saat pertama kali render
  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    if (savedMenu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveMenu(savedMenu);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
    { name: "Perjalanan Dinas", icon: <RxDashboard />, path: "/perjalanan-dinas" },
    { name: "Laporan Perjalanan Dinas", icon: <RxDashboard />, path: "/laporan-perjalanan" },
  ];

  return (
    <aside
      className={`fixed top-18 left-0 h-full w-64 bg-brand shadow-md flex flex-col
      transform transition-all duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
    >
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleMenuClick(item.name, item.path)}
            className={`flex items-center gap-x-3 w-full px-4 py-4 hover:bg-gray-50 transition
              ${activeMenu === item.name ? "bg-gray-100 shadow-lg" : ""}`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}