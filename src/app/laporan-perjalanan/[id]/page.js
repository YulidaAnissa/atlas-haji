"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  FormModal,
  Snackbar,
  StatusBadge,
  VerifBiayaPerjalanan,
  InfoPerjalanan,
  SearchBar
} from "@/components/elements";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import LaporanPerjalanan from "@/components/forms/LaporanPerjalanan";
import UpdateLaporanPerjalanan from "@/components/forms/UpdateLaporan";

import { useUpdateLaporan, useSuratTugas, usePegawai } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";

export default function Component() {
  const params = useParams();
  const { id } = params;
  const EMPTY_MODAL = {
    show: false,
    data: null,
    surat: null
  };
  const [search, setSearch] = useState("");
  const [showLaporan, setShowLaporan] = useState(EMPTY_MODAL);
  const [showAddLaporan, setShowAddLaporan] = useState(false);
  const [showUpdateLaporan, setShowUpdateLaporan] = useState(EMPTY_MODAL);
  const [laporan, setLaporan] = useState({});
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [profil, setProfil] = useState(null);
  useEffect(() => {
    const userProfile = profileStorage.get();
    setProfil(userProfile);
  }, []);
  const [loading, startLoading, endLoading] = useLoading();

  const { data, isLoading, fetch } = useSuratTugas({
    urlParams: { id },
    params: {
      search,
      ...(profil?.role !== "admin" && profil?.nip && { nip: profil.nip })
    }
  });

  const { data: pegawai } = usePegawai({
    params: {
      idKantor: profil?.idKantor
    }
  })

  const { updateLaporan } = useUpdateLaporan();

  const handleLaporanPerjalanan = async (values) => {
    const idPerjalananPegawai = values?.pegawai?.value;
    try {
      startLoading();

      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng);
      formData.append("biayaTrans", values?.biayaTrans);
      formData.append("buktiPeng", values?.buktiPeng); // file object
      formData.append("buktiTrans", values?.buktiTrans); // file object
      formData.append("spd", values?.spd); // file object
      formData.append("status", "pengajuan");
      formData.append("hasil", values?.hasil);
      formData.append("isRead", TRUE);
      formData.append("tfBiayaPeng", values?.tfBiayaPeng?.value || values?.pegawai?.id);
      formData.append("tfBiayaTrans", values?.tfBiayaTrans?.value || values?.pegawai?.id);
      await updateLaporan(idPerjalananPegawai, formData);
      await fetch();
      setShowAddLaporan(false);
      setShowSnackbar({
        show: true,
        message: "Laporan berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      // 💡 Menangkap pesan error spesifik dari backend (misal: "Ukuran file terlalu besar...")
      const errorMessage = err?.message || "Gagal menyimpan laporan";

      setShowSnackbar({
        show: true,
        message: errorMessage,
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleFormLaporan = (type) => {
    setShowAddLaporan(true);
    setLaporan(type);
  };

  const handleUpdateLaporan = async (values) => {
    const idPerjalananPegawai = values?.idPerjalananPegawai;
    try {
      startLoading();

      const formData = new FormData();
      formData.append("biayaPeng", values?.biayaPeng);
      formData.append("biayaTrans", values?.biayaTrans);
      formData.append("buktiPeng", values?.buktiPeng); // file object
      formData.append("buktiTrans", values?.buktiTrans); // file object
      formData.append("spd", values?.spd); // file object
      formData.append("status", "pengajuan");
      formData.append("hasil", values?.hasil);
      formData.append("tfBiayaPeng", values?.tfBiayaPeng?.value || values?.pegawai?.id);
      formData.append("tfBiayaTrans", values?.tfBiayaTrans?.value || values?.pegawai?.id);
      await updateLaporan(idPerjalananPegawai, formData);

      await fetch();
      setShowUpdateLaporan(EMPTY_MODAL);
      setShowSnackbar({
        show: true,
        message: "Laporan berhasil diperbarui",
        type: "success",
      });
    } catch (err) {
      // 💡 Menangkap pesan error spesifik dari backend
      const errorMessage = err?.message || "Gagal memperbarui laporan";

      setShowSnackbar({
        show: true,
        message: errorMessage,
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const headCells = [
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "tujuan", label: "Tujuan", numeric: false },
    { id: "tanggal", label: "Tanggal", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "aksi", label: "", numeric: false },
  ];

  // 1. Urutkan data pegawai berdasarkan tglBerangkat secara ascending (menaik)
  const sortedPegawai = [...(data?.pegawai ?? [])].sort((a, b) => {
    return new Date(a.tglBerangkat).getTime() - new Date(b.tglBerangkat).getTime();
  });

  // 2. Map data yang sudah berurutan untuk ditampilkan di tabel
  const formattedData = sortedPegawai.map((item) => {
    const isPerjalananKhusus =
      String(item?.typePerjalanan ?? "").trim().toLowerCase() === "khusus";

    return {
      ...item,
      nama: (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-900">{item.nama}</span>
          {item.nip && (
            <span className="text-xs text-gray-500">{item.nip}</span>
          )}
          {isPerjalananKhusus && (
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Perjalanan Khusus
            </span>
          )}
        </div>
      ),
      tanggal: formatRangeDate(
        item.tglBerangkat,
        item.tglKembali,
        "DD MMM YYYY",
      ),
      status: (
        <StatusBadge
          className="justify-center"
          status={item.status}
        />
      ),
      aksi: (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              item.status === "tolak"
                ? setShowUpdateLaporan({
                    show: true,
                    data: item,
                  })
                : setShowLaporan({
                    show: true,
                    data: item,
                    surat: data?.surat
                  })
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 ${
              item.status === "tolak"
                ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 focus:ring-red-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand/30 hover:bg-[#fbf7ec] hover:text-brand focus:ring-brand/30"
            }`}
          >
            <FiEye className="h-4 w-4" />
            {item.status === "tolak" ? "Perbaiki" : "Lihat"}
          </button>
        </div>
      ),
    };
  });

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Laporan Perjalanan Dinas", href: "/laporan-perjalanan" },
    { label: data?.surat?.kegiatan || "Detail" },
  ];

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItem} />

      <header className="mb-8 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Laporan Perjalanan
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Detail Laporan Perjalanan Dinas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola laporan perjalanan, cetak dokumen, dan pantau detail surat
            tugas dalam satu halaman.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={() => handleFormLaporan("add")}
        >
          <FaPlusCircle className="h-4 w-4" />
          Buat Laporan
        </button>
      </header>

      <InfoPerjalanan data={data?.surat} className="mb-8" />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center justify-between w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Pegawai
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Cetak laporan perjalanan berdasarkan pegawai.
              </p>
            </div>
            
            <div>
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Pegawai..."
              />
            </div>
          </div>
        </div>

        <DataTables
          headCells={headCells}
          data={formattedData}
          loading={isLoading}
        />
      </section>

      <FormModal
        className="w-3xl"
        icon={<FaPlusCircle className="h-6 w-6 text-white" />}
        show={showAddLaporan}
      >
        <LaporanPerjalanan
          data={data?.pegawai}
          pegawai={data?.pegawai}
          onSubmit={handleLaporanPerjalanan}
          onClose={() => setShowAddLaporan(false)}
          type={laporan}
          pegawaiTf={pegawai}
        />
      </FormModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showUpdateLaporan.show}
      >
        <UpdateLaporanPerjalanan
          data={showUpdateLaporan.data}
          onSubmit={handleUpdateLaporan}
          onClose={() => setShowUpdateLaporan(EMPTY_MODAL)}
          pegawai={data?.pegawai}
          pegawaiTf={pegawai}
        />
      </FormModal>

      <FormModal
        className="w-3xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showLaporan?.show}
      >
        <VerifBiayaPerjalanan
          data={showLaporan?.data}
          onClose={() =>
            setShowLaporan(EMPTY_MODAL)
          }
          type="laporan"
          surat={showLaporan?.surat}
        />
      </FormModal>

      <Snackbar
        show={showSnackbar?.show}
        type={showSnackbar?.type}
        message={showSnackbar?.message}
        onClose={() =>
          setShowSnackbar({ show: false, message: "", type: "" })
        }
      />

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}