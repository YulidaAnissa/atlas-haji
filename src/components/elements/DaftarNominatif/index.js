"use client";
import { useEffect, useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { formatDate, calculateTripDuration } from "@/utils/date";

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
        const uhVal = uhCount(item.uh, item.tglBerangkat, item.tglKembali);
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
          jumlahFormat: formatRupiah(totalCount(uhVal, item.biayaTrans, item.biayaPeng))
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
        jumlahAll: formatRupiah(totals.jumlahAll)
      });
    }
  }, [data]);
  
  const handleGenerate = async () => {
    try {
      startLoading();
      const response = await fetch(format);
      const content = await response.arrayBuffer();
      
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.render(dataFile);

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
       Download Daftar Nominatif
      </button>
      <LoadingOverlay show={loading}/>
    </div>
  );
}