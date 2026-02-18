import React from "react";

export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-6 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-6 border-t-transparent border-purple-500 animate-spin-slow"></div>
        <span className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold animate-pulse">
        Loading...
        </span>
      </div>
    </div>
  );
}