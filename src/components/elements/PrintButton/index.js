"use client";
import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { FiPrinter } from "react-icons/fi";

export default function SuratTugas({ 
  data,
  format,
  file,
  text
}) {
  const [loading, startLoading, endLoading] = useLoading();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleGenerate = async () => {
    try {
      startLoading();
      
      // 1. ambil template
      const response = await fetch(format);
      const content = await response.arrayBuffer();

      // 2. generate DOCX
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      const docxBlob = doc.getZip().generate({ type: "blob" });

      const formData = new FormData();
      formData.append("file", docxBlob, `${file}.docx`);

      

      const res = await fetch(SERVICES.CONVERT_PDF, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Convert failed");
      // const pdfBlob = await res.blob();
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(pdfBlob);
      // link.download = `${file}.pdf`;
      // link.click();
      // 4. tampilkan PDF
      const pdfBlob = await res.blob();
      const url = URL.createObjectURL(pdfBlob);
      
      window.open(url, "_blank");

    } catch (err) {
      console.error("Error:", err);
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
      <FiPrinter className="h-4 w-4 transition group-hover:-translate-y-0.5" />
      <span>{loading ? "Memproses..." : text || "Cetak"}</span>
    </button>

    <LoadingOverlay show={loading} />
  </>
);
}