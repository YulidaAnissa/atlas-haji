"use client";

import React from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { FaDownload } from "react-icons/fa";

export default function PrintButton({
  data,
  format,
  file = "surat-tugas",
  text,
}) {
  const [loading, startLoading, endLoading] = useLoading();

  const handleGenerate = async () => {
    try {
      startLoading();

      // 1. Ambil template DOCX dari public folder
      const response = await fetch(format);

      if (!response.ok) {
        throw new Error("Template DOCX tidak ditemukan");
      }

      const content = await response.arrayBuffer();

      // 2. Isi template DOCX
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      // 3. Generate DOCX Blob
      const docxBlob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 4. Kirim DOCX ke backend untuk convert PDF
      const formData = new FormData();

      formData.append("file", docxBlob, `${file}.docx`);

      const res = await fetch(SERVICES.CONVERT_PDF, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Convert PDF gagal");
      }

      // 5. Terima PDF dari backend
      const pdfBlob = await res.blob();

      const pdfUrl = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      // 6. Buka PDF di tab baru
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Error generate surat:", err);
      alert("Gagal membuat PDF");
    } finally {
      endLoading();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#eadfbe] bg-white px-4 text-sm font-bold text-brand shadow-sm transition hover:border-brand hover:bg-brand hover:text-white focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <FaDownload className="h-4 w-4 transition group-hover:-translate-y-0.5" />
        {/* <span>{loading ? "Memproses..." : text}</span> */}
      </button>

      <LoadingOverlay show={loading} />
    </>
  );
}