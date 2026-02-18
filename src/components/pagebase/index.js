"use client";
import React, { useState } from "react";
import { Header, Sidebar } from "./layout";
import clsx from "clsx";

/**
 * DashboardPage adalah layout utama aplikasi.
 * Membungkus header, sidebar, dan konten halaman.
 */
export default function DashboardPage({ children, className = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Body */}
      <div className="flex relative flex-1">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main
          className={clsx(
            "flex-1 overflow-y-auto transition-all duration-300 pt-28",
            className,
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
