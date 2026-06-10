"use client";
import { useEffect, useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { toUpperCase } from "@/utils/string";

export default function SuratTugas({ 
  data,
  format = "/nominatif-format.docx",
  file = "daftar-nominatif"
}) {
  const [loading, startLoading, endLoading] = useLoading();
  const [dataFile, setDataFile] = useState();

  const formatRupiah = (angka) => {
    if (!angka) return "Rp. 0";
    return "Rp. " + Number(angka).toLocaleString("id-ID");
  };
  
  const uhCount = (uh, berangkat, kembali) => {
    const duration = calculateTripDuration(berangkat, kembali, false, false);
    return duration * uh;
  };

  const totalCount = (uh, biayaTrans, biayaPeng) => {
    // pastikan semuanya angka
    const u = Number(uh) || 0;
    const t = Number(biayaTrans) || 0;
    const p = Number(biayaPeng) || 0;

    return u + t + p;
  };

  const formatTujuan = (tujuan) => {
    if (!tujuan) return "";
    // cek apakah diawali dengan "Kabupaten"
    if (tujuan.toLowerCase().startsWith("kabupaten ")) {
      // ambil kata setelah "Kabupaten"
      const namaKab = tujuan.substring(10); // 10 = panjang kata "Kabupaten "
      return `Kab. ${namaKab}`;
    }
    return tujuan;
  };

  useEffect(() => {
    if (data) {
      const pegawaiData = data.pegawai.map((item, index) => {
        const isKhusus = item.type === "khusus";
        const uhType = isKhusus ? 0 : item.uh;
        const uhVal = uhCount(uhType, item.tglBerangkat, item.tglKembali);
        return {
          idx: index + 1,
          nama: item.nama,
          gol: item.gol,
          jabatan: item.jabatan,
          tujuan: formatTujuan(item.kabkota),
          tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
          tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
          uh: uhVal,
          biayaTrans: Number(item.biayaTrans) || 0,
          biayaPeng: Number(item.biayaPeng) || 0,
          jumlah: totalCount(uhVal, item.biayaTrans, item.biayaPeng),
          uhFormat: formatRupiah(uhVal),
          biayaTransFormat: formatRupiah(item.biayaTrans) || "",
          biayaPengFormat: formatRupiah(item.biayaPeng) || "",
          jumlahFormat: formatRupiah(totalCount(uhVal, item.biayaTrans, item.biayaPeng)),
          nipPPK: item?.nipPPK,
          namaPPK: item?.namaPPK,
          unitPPK: item?.unitPPK,
        };
      });

      // Hitung total dari semua pegawai
      const totals = pegawaiData.reduce(
        (acc, curr) => {
          acc.uhTotal += Number(curr.uh) || 0;
          acc.transTotal += Number(curr.biayaTrans) || 0;
          acc.pengTotal += Number(curr.biayaPeng) || 0;
          acc.jumlahAll += Number(curr.jumlah) || 0;
          return acc;
        },
        { uhTotal: 0, transTotal: 0, pengTotal: 0, jumlahAll: 0 }
      );

      setDataFile({
        noSurat: data.surat?.noSurat || "",
        tglSurat: formatDate(data.surat?.tglSurat, "DD MMMM YYYY") || "",
        kegiatan: data.surat?.kegiatan || "",
        pegawai: pegawaiData,
        uhTotal: formatRupiah(totals.uhTotal),
        transTotal: formatRupiah(totals.transTotal),
        pengTotal: formatRupiah(totals.pengTotal),
        jumlahAll: formatRupiah(totals.jumlahAll),
        nipPPK: data.surat?.nip || "",
        namaPPK: data.surat?.nama || "",
        unitPPK: toUpperCase(data.surat?.unit) || "",
      });
    }
  }, [data]);
  
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

    doc.render(dataFile);

    // 3. Generate DOCX Blob
    const docxBlob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 3. kirim ke backend
    const formData = new FormData();
    formData.append("file", docxBlob, `${file}.docx`);

    const res = await fetch(SERVICES.CONVERT_PDF, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Convert failed");

    // 4. tampilkan PDF
    const pdfBlob = await res.blob();
    const url = URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );

    window.open(url, "_blank");

  } catch (err) {
    console.error("Error:", err);
    alert("Gagal membuat PDF");
  } finally {
    endLoading();
  }
};

  return (
    <>
      <span
        tabIndex={0}
        onClick={handleGenerate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleGenerate();
          }
        }}
        className="inline-flex cursor-pointer items-center justify-center text-sm font-semibold"
      >
        Daftar Nominatif
      </span>

      <LoadingOverlay show={loading} />
    </>
  );
}