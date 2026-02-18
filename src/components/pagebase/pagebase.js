"use client"
import React, { useState } from "react";
import { Header, Sidebar } from "./layout";
import clsx from "clsx";

export default function DashboardPage({ children, className = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex relative">
        <Sidebar sidebarOpen={sidebarOpen}/>
        <main
          className={clsx("flex-1 overflow-y-auto transition-all duration-300 pt-28", className, sidebarOpen ? "ml-64" : "ml-0")}>
          {children}
        </main>
      </div>
    </div>
  );
}