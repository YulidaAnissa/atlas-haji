"use client";

import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FaRegTrashAlt, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";

export default function FileField({
  input,
  meta,
  label,
  className = "",
  disabled = false,
  ...rest
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const file = input.value;
  const haveError = meta?.touched && meta?.error;
  const errorMessage = Array.isArray(meta?.error)
    ? meta.error[0]?.message
    : meta?.error;

  // Buat Object URL untuk preview jika file berupa File Object (file baru)
  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Bersihkan URL dari memori ketika file berubah/komponen unmount
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === "string") {
      setPreviewUrl(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleChange = (event) => {
    if (disabled) return;

    const selectedFile = event.target.files?.[0];
    input.onChange(selectedFile || null);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) input.onChange(droppedFile);
  };

  const handleBrowseClick = () => {
    if (disabled) return;

    fileInputRef.current?.click();
  };

  const handleRemove = (event) => {
    event.stopPropagation();

    if (disabled) return;

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
          className={clsx(
            "text-sm font-semibold tracking-wide",
            disabled ? "text-gray-400" : "text-gray-800"
          )}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={clsx(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center shadow-sm transition",
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-80"
            : haveError
              ? "border-red-300 bg-red-50/50"
              : isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
        )}
      >
        <span
          className={clsx(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
            disabled
              ? "bg-gray-100 text-gray-400"
              : haveError
                ? "bg-red-100 text-red-500"
                : "bg-blue-50 text-blue-600"
          )}
        >
          <FaCloudUploadAlt />
        </span>

        <span
          className={clsx(
            "text-sm font-semibold",
            disabled ? "text-gray-400" : "text-gray-800"
          )}
        >
          {disabled ? "File surat terkunci" : "Pilih file atau tarik ke sini"}
        </span>

        <span className="mt-1 text-xs text-gray-500">
          {disabled
            ? "File mengikuti surat tugas yang sudah dipilih"
            : "Mendukung PDF, PNG, JPG, DOC, dan DOCX"}
        </span>

        {!disabled && (
          <span className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600">
            Browse File
          </span>
        )}
      </button>

      <input
        type="file"
        id={input.name}
        name={input.name}
        ref={fileInputRef}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        {...rest}
      />

      {file && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FaFileAlt />
            </span>

            <div className="min-w-0">
              {previewUrl ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-semibold text-blue-600 hover:underline block"
                >
                  {typeof file === "string" ? "File lama - klik untuk lihat" : file.name}
                </a>
              ) : (
                <p className="truncate text-sm font-semibold text-gray-800">
                  {typeof file === "string" ? file : file.name}
                </p>
              )}

              {file instanceof File && (
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {file.type || "File terpilih"} • {(file.size / 1024).toFixed(1)} KB (Klik nama file untuk melihat)
                </p>
              )}
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Hapus file"
            >
              <FaRegTrashAlt className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="min-h-4">
        {haveError && (
          <p className="text-xs leading-5 text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

FileField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
};