import clsx from "clsx";
import React from "react";
import { IoClose } from "react-icons/io5";

export default function FormModal({ 
  show = false, 
  icon = <IoClose className="text-white w-6 h-6"/>,
  title,
  children ,
  className = "w-xl"
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={clsx("bg-white rounded-lg shadow-lg p-6 text-center relative", className)}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brand -mt-11">
            {icon}
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {children}
      </div>
    </div>

  );
}