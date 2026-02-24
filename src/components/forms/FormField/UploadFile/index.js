// components/forms/FormField/FileField.js
"use client";
import React, { useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FaRegTrashAlt } from "react-icons/fa";

export default function FileField({ input, meta, label, ...rest }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    input.onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) input.onChange(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    input.onChange(null); // hapus file dari state form
    fileInputRef.current.value = ""; // reset input
  };

  const haveError = meta.touched && meta.error;
  const file = input.value;

  return (
    <div className="flex flex-col text-left p-2">
      {label && (
        <label
          htmlFor={input.name}
          className="text-sm md:text-base font-semibold mb-1"
        >
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={clsx(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition",
          haveError ? "border-danger" : "border-gray-400 hover:border-blue-500"
        )}
        onClick={handleBrowseClick}
      >
        {/* Icon upload */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>

        <p className="text-gray-600 text-sm">
          Select your file or drag and drop
        </p>
        <p className="text-gray-400 text-xs mb-3">
          png, pdf, jpg, docx accepted
        </p>

        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
        >
          Browse
        </button>
      </div>

      <input
        type="file"
        id={input.name}
        name={input.name}
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        {...rest}
      />

      {/* Tampilkan nama file + tombol hapus */}
      {file && (
        <div className="flex items-center justify-between mt-2 p-2 border rounded bg-gray-50">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{file.name}</span>
            <span className="ml-2 text-gray-400 text-xs">
              {file.webkitRelativePath || file.type}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      )}

      <div className="mt-1 min-h-1">
        {meta.touched && meta.error && (
          <span className="text-red-500 text-xs">
            {typeof meta.error === "string"
              ? meta.error
              : meta.error[0]?.message}
          </span>
        )}
      </div>
    </div>
  );
}

FileField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
};