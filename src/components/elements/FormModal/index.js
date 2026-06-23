import clsx from "clsx";
import React from "react";
import { IoClose } from "react-icons/io5";

export default function FormModal({
  show = false,
  icon = <IoClose className="h-6 w-6 text-white" />,
  title,
  children,
  className = "w-full max-w-xl",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className={clsx(
          "relative flex max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl",
          className
        )}
      >
        <div className="absolute left-1/2 top-0 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/25">
          {icon}
        </div>

        <div className="overflow-y-auto p-6 pt-10">
          {title && (
            <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
              {title}
            </h2>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}