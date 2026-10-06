"use client";

import { useEffect, useRef, useState } from "react";
import PrintButton from "@/components/elements/PrintButton";
import { usePerjalananPegawai } from "@/hooks/useData";
import { calculateTripDuration, formatDate } from "@/utils/date";
import { capitalize, toUpperCase } from "@/utils/string";

export default function PrintPegawaiButton({ item, suratTugas, ppt, idSurat }) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const printBtnRef = useRef(null);

  // Hook dipanggil hanya saat shouldFetch = true
  const { data: detailPrintData, isLoading } = usePerjalananPegawai({
    params: {
      followersId: item?.idPerjalananPegawai,
      idSurat: idSurat,
    },
    skip: !shouldFetch,
  });

  // Handler saat user mengeklik area tombol/pemicu
  const handleTriggerFetch = (e) => {
    // Jika data belum di-fetch, cegah propagasi klik ke PrintButton
    if (!shouldFetch || !isDataReady) {
      e.preventDefault();
      e.stopPropagation();
      setShouldFetch(true);
    }
  };

  // Efek memantau hingga fetching data SWR selesai
  useEffect(() => {
    if (shouldFetch && !isLoading && detailPrintData !== undefined) {
      setIsDataReady(true);
    }
  }, [shouldFetch, isLoading, detailPrintData]);

  // Efek terpisah untuk memicu auto-click hanya SEKALI saat data sudah siap
  useEffect(() => {
    if (isDataReady && printBtnRef.current) {
      const timer = setTimeout(() => {
        const innerBtn =
          printBtnRef.current.querySelector("button") || printBtnRef.current;
        
        // Panggil fungsi click native tanpa memicu bubbling handler kita lagi
        if (innerBtn && typeof innerBtn.click === "function") {
          innerBtn.click();
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isDataReady]);

  // Format array followers dari data hasil fetch
  const followers = (detailPrintData || []).map((value, index) => ({
    idx: index + 1,
    namafollowers: value.nama,
    jabatanfollowers: value.jabatan || "-",
  }));

  const payloadData = {
    ...item,
    jabatan: item?.jabatan || "-",
    lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
    tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
    tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
    kabkota: item.tujuan,
    kegiatan: suratTugas?.surat?.kegiatan || "-",
    unit: suratTugas?.surat?.unit,
    jabatanPPT: ppt.jabatanPPT,
    nipPPT: suratTugas?.surat?.nip,
    namaPPT: suratTugas?.surat?.nama,
    an: ppt.an,
    pejabatMengetahui: ppt.pejabatMengetahui,
    gol: item.gol || "-",
    nip:
      item.jenisPegawai === "PNS" || item.jenisPegawai === "PPPK"
        ? item.nip
        : "-",
    namaKantor: capitalize(suratTugas?.surat?.namaKantor || "-"),
    namaKantorUpper: toUpperCase(suratTugas?.surat?.namaKantor || "-"),
    callCenter: suratTugas?.surat?.callCenter || "-",
    unitKantor: suratTugas?.surat?.unitKantor || " ",
    alamat: suratTugas?.surat?.alamat || "-",
    email: suratTugas?.surat?.email || "-",
    website: suratTugas?.surat?.website || "-",
    asal: item.kabkota,
    namaPpk: suratTugas?.surat?.namaPpk,
    nipPpk: suratTugas?.surat?.nipPpk,
    followers: followers,
  };

  return (
    <div
      ref={printBtnRef}
      onClickCapture={handleTriggerFetch}
      className="inline-block"
    >
      <PrintButton
        data={payloadData}
        format="/spd-format.docx"
        file={`spd-${item.nip}`}
        disabled={shouldFetch && isLoading}
      />
    </div>
  );
}