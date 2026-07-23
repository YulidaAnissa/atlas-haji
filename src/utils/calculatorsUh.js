/**
 * Menghitung nilai uang harian per hari berdasarkan tipe surat, tujuan, dan master data daerah.
 * 
 * @param {Object} item - Data pegawai (berisi kabkota, jenisPegawai, tujuan, dll)
 * @param {Object} suratData - Data surat (berisi tipe / type)
 * @param {Array} dataKabKota - Master data tarif kabupaten/kota
 * @returns {number} - Nilai uang harian per hari (uhPerHari)
 */
export function calculateUangHarianPerHari(item, suratData, dataKabKota) {
  const tipeSurat = suratData?.type;

  if (tipeSurat === "full_board") {
    return 130000;
  }

  if (tipeSurat === "reguler") {
    const daftarTujuan = Array.isArray(item.tujuan) 
      ? item.tujuan 
      : (item.tujuan ? item.tujuan.split(',').map(t => t.trim()) : []);

    let maxUhDaerah = 0;

    daftarTujuan.forEach((tujuanPegawai) => {
      let rate = 0;

      // Cek jika kabkota asal sama dengan tujuan, maka rate = 170000
      if (
        item.kabkota && 
        tujuanPegawai && 
        item.kabkota.toLowerCase() === tujuanPegawai.toLowerCase()
      ) {
        rate = 170000;
      } else {
        // Jika berbeda, cari data rate dari master kabupaten/kota berdasarkan jenis pegawai
        const matchKabKota = dataKabKota?.find(
          (kab) => kab.kabkota?.toLowerCase() === tujuanPegawai.toLowerCase()
        );

        if (matchKabKota) {
          if (item.jenisPegawai === "PNS") {
            rate = Number(matchKabKota.uhPNS) || 0;
          } else if (item.jenisPegawai === "PPPK") {
            rate = Number(matchKabKota.uhPPPK) || 0;
          } else {
            rate = Number(matchKabKota.uhNonASN) || 0;
          }
        }
      }

      if (rate > maxUhDaerah) {
        maxUhDaerah = rate;
      }
    });

    return maxUhDaerah;
  }

  return 0;
}