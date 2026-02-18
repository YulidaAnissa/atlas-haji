import React from "react";
import { IoClose } from "react-icons/io5";

export default function InfoModal({ 
  show = false, 
  onCancel, 
  onConfirm,
  icon = <IoClose className="text-white w-6 h-6"/>,
  title,
  children 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center relative">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brand -mt-11">
            {icon}
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {children}

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4 text-white">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 bg-primary rounded hover:bg-primary-200 cursor-pointer"
            >
              Lanjutkan
            </button>
          )}
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-danger rounded cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

  );
}