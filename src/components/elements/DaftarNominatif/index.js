"use client";
import { useEffect, useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { SERVICES } from "@/configs";
import { useLoading } from "@/hooks";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import { formatDate, calculateTripDuration } from "@/utils/date";
import { toUpperCase } from "@/utils/string";
import { calculateUangHarianPerHari } from "@/utils/calculatorsUh";

export default function SuratTugas({ 
  data,
  format = "/nominatif-format.docx",
  file = "daftar-nominatif",
  kabKota = [] // Berisi list master daerah beserta nominal uhPNS, uhPPPK, uhNonASN
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

  const totalCount = (uh, biayaTrans, biayaPeng, biayaRep = 0) => {
    const u = Number(uh) || 0;
    const t = Number(biayaTrans) || 0;
    const p = Number(biayaPeng) || 0;
    const r = Number(biayaRep) || 0;
    return u + t + p + r;
  };

  const formatTujuan = (tujuan) => {
    if (!tujuan) return "";
    if (tujuan.toLowerCase().startsWith("kabupaten ")) {
      const namaKab = tujuan.substring(10); 
      return `Kab. ${namaKab}`;
    }
    return tujuan;
  };

  useEffect(() => {
    if (data) {
      const formatOrDash = (value) => {
        const num = Number(value || 0);
        return num === 0 ? "Rp. -" : formatRupiah(num);
      };

      const tglKembaliTerakhir = data.pegawai.reduce((latest, current) => {
        if (!current.tglKembali) return latest;
        if (!latest) return current.tglKembali;
        
        return new Date(current.tglKembali).getTime() > new Date(latest).getTime()
          ? current.tglKembali
          : latest;
      }, null);

      const pegawaiData = data.pegawai.map((item, index) => {
        const uhPerHari = calculateUangHarianPerHari(item, data?.surat, kabKota);

        const isKhusus = item.typePerjalanan === "khusus";
        const uhType = isKhusus ? 0 : uhPerHari;
        
        const uhVal = uhCount(uhType, item.tglBerangkat, item.tglKembali);

        // Hitung Biaya Representatif (150rb/hari untuk "Kepala Kantor")
        let biayaRepVal = 0;
        const isKepalaKantor = item.jabatan?.toLowerCase().includes("kepala kantor");
        if (isKepalaKantor) {
          const durasiHari = calculateTripDuration(item.tglBerangkat, item.tglKembali, false, false);
          biayaRepVal = durasiHari * 150000;
        }

        const totalPegawai = totalCount(uhVal, item.biayaTrans, item.biayaPeng, biayaRepVal);

        const tujuanTeks = Array.isArray(item.tujuan) ? item.tujuan.join(', ') : item.tujuan;

        return {
          idx: index + 1,
          nama: item.nama,
          gol: item.gol || "-",
          jabatan: item.jabatan,
          tujuan: formatTujuan(tujuanTeks),
          tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
          tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
          uh: uhVal,
          biayaTrans: Number(item.biayaTrans) || 0,
          biayaPeng: Number(item.biayaPeng) || 0,
          biayaRepresentatif: biayaRepVal,
          jumlah: totalPegawai,
          
          uhFormat: formatOrDash(uhVal),
          biayaTransFormat: formatOrDash(item.biayaTrans),
          biayaPengFormat: formatOrDash(item.biayaPeng),
          biayaRepresentatifFormat: formatOrDash(biayaRepVal) || 0,
          jumlahFormat: formatOrDash(totalPegawai),
        };
      });

      const totals = pegawaiData.reduce(
        (acc, curr) => {
          acc.uhTotal += Number(curr.uh) || 0;
          acc.transTotal += Number(curr.biayaTrans) || 0;
          acc.pengTotal += Number(curr.biayaPeng) || 0;
          acc.repTotal += Number(curr.biayaRepresentatif) || 0;
          acc.jumlahAll += Number(curr.jumlah) || 0;
          return acc;
        },
        { uhTotal: 0, transTotal: 0, pengTotal: 0, repTotal: 0, jumlahAll: 0 }
      );

      setDataFile({
        noSurat: data.surat?.noSurat || "",
        tglSurat: formatDate(data.surat?.tglSurat, "DD MMMM YYYY") || "",
        kegiatan: data.surat?.kegiatan || "",
        pegawai: pegawaiData,
        
        uhTotal: formatOrDash(totals.uhTotal),
        transTotal: formatOrDash(totals.transTotal),
        pengTotal: formatOrDash(totals.pengTotal),
        repTotal: formatOrDash(totals.repTotal),
        jumlahAll: formatOrDash(totals.jumlahAll),
        
        nipPpk: data?.surat?.nipPpk || "",
          namaPpk: data?.surat?.namaPpk || "",
        tglKPPN: formatDate(data.surat?.tglKPPN, "DD MMMM YYYY") || "",
        tglKembaliTTD: tglKembaliTerakhir ? formatDate(tglKembaliTerakhir, "DD MMMM YYYY") : "",
        tahun: tglKembaliTerakhir ? formatDate(tglKembaliTerakhir, "YYYY") : "",
        namaKantor: data?.surat?.namaKantor || ""
      });
    }
  }, [data, kabKota]);

  const handleGenerate = async () => {
    try {
      startLoading();

      // 💡 LOGIKA PINDAH TEMPLATE: 
      // Deteksi apakah di dalam list pegawai ada yang menjabat sebagai "Kepala Kantor"
      const adaKepalaKantor = dataFile?.pegawai?.some((p) => 
        p.jabatan?.toLowerCase().includes("kepala kantor")
      );

      // Jika ada Kepala Kantor, gunakan template khusus kakanwil, jika tidak gunakan template default props "format"
      const templatePath = adaKepalaKantor 
        ? "/nominatif-format-kakanwil.docx" 
        : format;

      // 1. Ambil template docx dinamis
      const response = await fetch(templatePath);
      const content = await response.arrayBuffer();

      // 2. generate DOCX
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(dataFile);

      const docxBlob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 3. Kirim ke backend converter
      const formData = new FormData();
      formData.append("file", docxBlob, `${file}.docx`);

      const res = await fetch(SERVICES.CONVERT_PDF, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Convert failed");

      const pdfBlob = await res.blob();
      const url = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));

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
        Daftar Nominatif SPJ
      </span>
      <LoadingOverlay show={loading} />
    </>
  );
}