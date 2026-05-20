"use client";

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FaRegTrashAlt, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";

export default function FileField({ input, meta, label, className = "", ...rest }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const file = input.value;
  const haveError = meta?.touched && meta?.error;
  const errorMessage = Array.isArray(meta?.error)
    ? meta.error[0]?.message
    : meta?.error;

  const handleChange = (event) => {
    const selectedFile = event.target.files?.[0];
    input.onChange(selectedFile || null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) input.onChange(droppedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    input.onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={clsx("flex w-full flex-col gap-1.5 text-left", className)}>
      {label && (
        <label
          htmlFor={input.name}
          className="text-sm font-semibold tracking-wide text-gray-800"
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={clsx(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white px-6 py-8 text-center shadow-sm transition",
          haveError
            ? "border-red-300 bg-red-50/50"
            : isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        )}
      >
        <span
          className={clsx(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
            haveError
              ? "bg-red-100 text-red-500"
              : "bg-blue-50 text-blue-600"
          )}
        >
          <FaCloudUploadAlt />
        </span>

        <span className="text-sm font-semibold text-gray-800">
          Pilih file atau tarik ke sini
        </span>

        <span className="mt-1 text-xs text-gray-500">
          Mendukung PDF, PNG, JPG, DOC, dan DOCX
        </span>

        <span className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600">
          Browse File
        </span>
      </button>

      <input
        type="file"
        id={input.name}
        name={input.name}
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        {...rest}
      />

      {file && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FaFileAlt />
            </span>

            {typeof file === "string" ? (
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-semibold text-blue-600 hover:underline"
              >
                File lama - klik untuk lihat
              </a>
            ) : (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {file.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {file.type || "File terpilih"}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Hapus file"
          >
            <FaRegTrashAlt className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="min-h-4">
        {haveError && (
          <p className="text-xs leading-5 text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

FileField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
};