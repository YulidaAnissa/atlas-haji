"use client";

import React, { useEffect, useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { FaExternalLinkAlt, FaEye } from "react-icons/fa";

export default function SuratTugas({
  data,
  format,
  file = "surat-tugas",
  title = "Surat Tugas",
  text = "Lihat Laporan",
}) {
  const [loading, startLoading, endLoading] = useLoading();
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const generatePdf = async () => {
    const response = await fetch(format);

    if (!response.ok) {
      throw new Error("Template DOCX tidak ditemukan");
    }

    const content = await response.arrayBuffer();

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(data);

    const docxBlob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const formData = new FormData();
    formData.append("file", docxBlob, `${file}.docx`);

    const res = await fetch(SERVICES.CONVERT_PDF, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Convert PDF gagal");
    }

    const pdfBlob = await res.blob();

    return URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );
  };

  const handlePreview = async () => {
    try {
      setShowPreview(true);

      if (pdfUrl) {
        return;
      }

      startLoading();

      const url = await generatePdf();
      setPdfUrl(url);
    } catch (err) {
      console.error("Error generate surat:", err);
      alert("Gagal membuat PDF");
      setShowPreview(false);
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <>
      <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <p className="min-w-0 truncate text-sm font-semibold text-gray-800">
            {title}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaEye className="h-3 w-3" />
              {loading ? "Memuat..." : text}
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Buka
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {showPreview && (
          <div className="min-w-0 overflow-hidden bg-gray-50">
            {loading && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">Memuat preview...</p>
              </div>
            )}

            {!loading && pdfUrl && (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={title}
                className="block h-130 w-full max-w-full border-0"
              />
            )}

            {!loading && !pdfUrl && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">
                  Preview belum tersedia
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <LoadingOverlay show={loading} />
    </>
  );
}