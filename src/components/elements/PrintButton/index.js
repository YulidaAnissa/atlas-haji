"use client";
import { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function SuratTugas({ 
  data,
  format,
  file
}) {
  const [loading, startLoading, endLoading] = useLoading();
  const handleGenerate = async () => {
    try {
      startLoading();
      const response = await fetch(format);
      const content = await response.arrayBuffer();
      
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.render(data);

      const out = doc.getZip().generate({ type: "blob" });

      const formData = new FormData();
      formData.append("file", out, `${file}.docx`);

      

      const res = await fetch(SERVICES.CONVERT_PDF, {
        method: "POST",
        body: formData,
      });

      const pdfBlob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${file}.pdf`;
      link.click();
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      endLoading();
    }
  };

  return (
    <div>
      <button
        className="rounded cursor-pointer text-white bg-black p-2"
        onClick={handleGenerate}
      >
       Download
      </button>
      <LoadingOverlay show={loading}/>
    </div>
  );
}