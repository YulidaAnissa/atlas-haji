"use client";

import React, { useEffect, useState } from "react";
import { Header, Sidebar } from "./layout";
import clsx from "clsx";

export default function DashboardPage({ children, className = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      setSidebarOpen(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex min-h-screen pt-20">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Tutup sidebar"
            className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <main
          className={clsx(
            "min-w-0 flex-1 transition-all duration-300 ease-out",
            "px-4 py-5 sm:px-6 lg:px-8 lg:py-6",
            sidebarOpen ? "lg:ml-64" : "lg:ml-0",
            className
          )}
        >
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}