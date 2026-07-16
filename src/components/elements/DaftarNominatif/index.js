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

  const totalCount = (uh, biayaTrans, biayaPeng) => {
    const u = Number(uh) || 0;
    const t = Number(biayaTrans) || 0;
    const p = Number(biayaPeng) || 0;
    return u + t + p;
  };

  const formatTujuan = (tujuan) => {
    if (!tujuan) return "";
    if (tujuan.toLowerCase().startsWith("kabupaten ")) {
      const namaKab = tujuan.substring(10); 
      return `Kab. ${namaKab}`;
    }
    return tujuan;
  };

  console.log('data daftar nominatif', data);

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
        let uhPerHari = 0;
        const tipeSurat = data.surat?.type;

        // 1. Cek tipe surat terlebih dahulu
        if (tipeSurat === "half_day") {
          uhPerHari = 90000;
        } else if (tipeSurat === "full_board") {
          uhPerHari = 130000;
        } else if (tipeSurat === "full_day") {
          // 2. Jika full_day, cari UH terbesar berdasarkan array tujuan (bisa lebih dari satu daerah)
          // Asumsi: item.tujuan bisa berupa array daerah, atau string yang dipisah koma. 
          // Di sini kita handle jika bentuknya string dipisah koma, atau jadikan array jika tunggal.
          const daftarTujuan = Array.isArray(item.tujuan) 
            ? item.tujuan 
            : (item.tujuan ? item.tujuan.split(',').map(t => t.trim()) : []);

          let maxUhDaerah = 0;

          daftarTujuan.forEach((tujuanPegawai) => {
            // Cari data kabupaten/kota yang cocok di master data kabKota
            const matchKabKota = kabKota.find(
              (kab) => kab.nama?.toLowerCase() === tujuanPegawai.toLowerCase()
            );

            if (matchKabKota) {
              // Tentukan key rate berdasarkan jenisPegawai
              let rate = 0;
              if (item.jenisPegawai === "PNS") {
                rate = Number(matchKabKota.uhPNS) || 0;
              } else if (item.jenisPegawai === "PPPK") {
                rate = Number(matchKabKota.uhPPPK) || 0;
              } else {
                // Non ASN / selain PNS & PPPK
                rate = Number(matchKabKota.uhNonASN) || 0;
              }

              // Ambil yang terbesar
              if (rate > maxUhDaerah) {
                maxUhDaerah = rate;
              }
            }
          });

          // Jika tidak ditemukan kecocokan sama sekali di kabKota, pasang default rate lama
          if (maxUhDaerah === 0) {
            maxUhDaerah = item?.jenisPegawai === "ASN" || item?.jenisPegawai === "PNS" ? 430000 : 250000;
          }

          uhPerHari = maxUhDaerah;
        } else {
          // Default fallback jika type surat tidak terdefinisi
          uhPerHari = item?.jenisPegawai === "ASN" || item?.jenisPegawai === "PNS" ? 430000 : 250000;
        }

        const isKhusus = item.typePerjalanan === "khusus";
        const uhType = isKhusus ? 0 : uhPerHari;
        
        // Hitung total akumulasi UH berdasarkan durasi hari
        const uhVal = uhCount(uhType, item.tglBerangkat, item.tglKembali);
        const totalPegawai = totalCount(uhVal, item.biayaTrans, item.biayaPeng);

        // Gabungkan teks tujuan untuk tampilan jika inputnya berupa array
        const tujuanTeks = Array.isArray(item.tujuan) ? item.tujuan.join(', ') : item.tujuan;

        return {
          idx: index + 1,
          nama: item.nama,
          gol: item.gol,
          jabatan: item.jabatan,
          tujuan: formatTujuan(tujuanTeks),
          tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
          tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
          uh: uhVal,
          biayaTrans: Number(item.biayaTrans) || 0,
          biayaPeng: Number(item.biayaPeng) || 0,
          jumlah: totalPegawai,
          
          uhFormat: formatOrDash(uhVal),
          biayaTransFormat: formatOrDash(item.biayaTrans),
          biayaPengFormat: formatOrDash(item.biayaPeng),
          jumlahFormat: formatOrDash(totalPegawai),
          
          nipPPK: item?.nipPPK,
          namaPPK: item?.namaPPK,
          unitPPK: item?.unitPPK,
        };
      });

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
        
        uhTotal: formatOrDash(totals.uhTotal),
        transTotal: formatOrDash(totals.transTotal),
        pengTotal: formatOrDash(totals.pengTotal),
        jumlahAll: formatOrDash(totals.jumlahAll),
        
        nipPPK: data.surat?.nip || "",
        namaPPK: data.surat?.nama || "",
        unitPPK: toUpperCase(data.surat?.unit) || "",
        tglKPPN: formatDate(data.surat?.tglKPPN, "DD MMMM YYYY") || "",
        tglKembaliTTD: tglKembaliTerakhir ? formatDate(tglKembaliTerakhir, "DD MMMM YYYY") : ""
      });
    }
  }, [data, kabKota]); // Tambahkan kabKota ke dependency array

  const handleGenerate = async () => {
    try {
      startLoading();
      const response = await fetch(format);
      const content = await response.arrayBuffer();

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
        Daftar Nominatif
      </span>
      <LoadingOverlay show={loading} />
    </>
  );
}