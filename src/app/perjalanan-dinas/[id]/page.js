"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEdit, FaPlusCircle } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import {
  Breadcrumb,
  DataTables,
  FormModal,
  InfoModal,
  InfoPerjalanan,
  Snackbar,
} from "@/components/elements";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import PrintButton from "@/components/elements/PrintButton";
import AddPegawaiPerjalanan from "@/components/forms/AddPegawaiPerjalanan";
import UpdatePerjalanan from "@/components/forms/Perjalanan";
import { useLoading } from "@/hooks";
import {
  useAddPegawaiPerjalanan,
  useDeletePegawaiPerjalanan,
  useEditSuratTugas,
  useKabKota,
  usePegawai,
  useSuratTugas,
  useUpdatePegawaiPerjalanan,
} from "@/hooks/useData";
import { calculateTripDuration, formatDate, formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import { capitalize } from "@/utils/string";

const EMPTY_SNACKBAR = {
  show: false,
  message: "",
  type: "",
};

const HEAD_CELLS = [
  { id: "nama", label: "Nama Pegawai", numeric: false },
  { id: "tujuan", label: "Tujuan", numeric: false },
  { id: "tanggal", label: "Tanggal Pelaksanaan", numeric: false },
  { id: "aksi", label: "", numeric: false, align: "right" },
];

export default function Component() {
  const { id } = useParams();
  const router = useRouter();

  const [profil, setProfil] = useState(null);
  const [deletedPegawai, setDeletedPegawai] = useState(null);
  const [showAddPegawai, setShowAddPegawai] = useState(false);
  const [updatePerjalananPegawai, setUpdatePerjalananPegawai] = useState({ data: null, show: false });
  const [showUpdatePerjalanan, setShowUpdatePerjalanan] = useState(false);
  const [snackbar, setSnackbar] = useState(EMPTY_SNACKBAR);
  const [loading, startLoading, endLoading] = useLoading();

  const { data: pejabat } = usePegawai({ params: { status: "eselon" } });
  const { data: pegawai } = usePegawai();
  const { data: kabkota } = useKabKota();
  const { data: suratTugas, fetch: fetchSuratTugas } = useSuratTugas({
    urlParams: { id },
  });
  const { editSuratTugas } = useEditSuratTugas();
  const { postPegawai } = useAddPegawaiPerjalanan();
  const { deletePegawaiPerjalanan } = useDeletePegawaiPerjalanan();
  const { updatePegawai } = useUpdatePegawaiPerjalanan();
  useEffect(() => {
    setProfil(profileStorage.get());
  }, []);

  const isAdmin =
    String(profil?.role ?? "").trim().toLowerCase() === "admin";

  const showNotification = (message, type) => {
    setSnackbar({ show: true, message, type });
  };

  const pegawaiTanpaPerjalanan = (pegawai ?? []).filter(
    (item) =>
      !suratTugas?.pegawai?.some(
        (pegawaiPerjalanan) => pegawaiPerjalanan.nip === item.nip,
      ),
  );

  const handleUpdatePerjalanan = async (values, form) => {
    try {
      if (!values.idSurat) {
        throw new Error("ID surat tidak ditemukan");
      }

      const formData = new FormData();
      formData.append("nip", values.nip);
      formData.append("noSurat", values.noSurat);
      formData.append("tglSurat", formatDate(values.tglSurat, "YYYY-MM-DD"));
      formData.append("kegiatan", values.kegiatan ?? "");
      formData.append("type", values.type ?? ""); // Menambahkan field type ke Form Data
      if (values.fileSurat) {
        formData.append("fileSurat", values.fileSurat);
      }

      await editSuratTugas({
        idSurat: values.idSurat,
        values: formData,
      });

      form.restart();
      await fetchSuratTugas();

      setShowUpdatePerjalanan(false);
      showNotification("Perjalanan berhasil diperbarui", "success");
    } catch (error) {
      showNotification(
        error?.message || "Gagal memperbarui surat tugas",
        "error",
      );
    }
  };

  const handleAddPegawai = async (values) => {
    try {
      await postPegawai({
        pegawai: values.pegawai,
        idSurat: id,
        tglBerangkat: formatDate(
          values.dateRange?.formattedStart,
          "YYYY-MM-DD",
        ),
        tglKembali: formatDate(
          values.dateRange?.formattedEnd,
          "YYYY-MM-DD",
        ),
        tujuan: values.tujuan,
        status: "perjalanan",
        asal: values.idKabKota
      });

      await fetchSuratTugas();
      setShowAddPegawai(false);
      showNotification("Pegawai berhasil ditambahkan", "success");
    } catch {
      showNotification("Gagal menambahkan pegawai", "error");
    }
  };

  const handleUpdatePerjalananPegawai = async (values) => {
    try {
      // 1. Ambil ID dari data pegawai yang sedang diedit
      const idPerjalananPegawai = updatePerjalananPegawai?.data?.idPerjalananPegawai;

      if (!idPerjalananPegawai) {
        showNotification("ID Perjalanan tidak ditemukan", "error");
        return;
      }

      // 2. Jalankan fungsi update dengan memisahkan ID dan Payload Body
      await updatePegawai(idPerjalananPegawai, {
        idPerjalananPegawai, // Backend mendestruktur ini dari req.body
        tglBerangkat: formatDate(values.dateRange?.formattedStart, "YYYY-MM-DD"),
        tglKembali: formatDate(values.dateRange?.formattedEnd, "YYYY-MM-DD"),
        tujuan: values.tujuan,
        type: values.type,
        // Tambahkan ini agar pengecekan jadwal bentrok di backend tidak error/skip
        nip: updatePerjalananPegawai?.data?.nip, 
        idSurat: id 
      });

      // 3. Refresh data dan tutup modal/form
      await fetchSuratTugas();
      setShowAddPegawai(false);
      showNotification("Pegawai berhasil diperbarui", "success");
      setUpdatePerjalananPegawai({ data: null, show: false });
    } catch (error) {
      console.error("Error update:", error);
      showNotification("Gagal memperbarui pegawai", "error");
    }
  };
  const handleDelete = async () => {
    try {
      startLoading();

      // Kirim idPerjalananPegawai, idSurat, dan nip untuk mengakomodasi berbagai skenario backend
      const result = await deletePegawaiPerjalanan({
        idPerjalananPegawai: deletedPegawai?.idPerjalananPegawai,
      });

      setDeletedPegawai(null);

      if (result?.message?.includes("perjalanan otomatis terhapus")) {
        router.push("/perjalanan-dinas");
      } else {
        await fetchSuratTugas();
      }

      showNotification("Pegawai berhasil dihapus", "success");
    } catch {
      showNotification("Gagal menghapus pegawai", "error");
    } finally {
      endLoading();
    }
  };
  const getJabatanPPT = (pegawaiJabatan, suratJabatan) => {
    const jabatan = String(pegawaiJabatan ?? "").trim().toLowerCase();
    const jabatanSurat = String(suratJabatan ?? "").trim().toLowerCase();
    console.log("jabatan surat", jabatanSurat);
    console.log("jabatan", jabatan );
    if(jabatanSurat.includes("kepala kantor")) {
      if(jabatan.includes("kepala kantor")) {
        return {
          an: "An. ",
          pejabatMengetahui: "Sekretaris Jenderal Kementerian",
          jabatanPPT: capitalize(jabatanSurat),
        };
      } else {
        return {
          an: "",
          pejabatMengetahui: "",
          jabatanPPT: capitalize(jabatanSurat),
        };
      }
    }
    else {
      if(jabatan.includes("kepala")) {
        return {
          an: "An. ",
          pejabatMengetahui: profil?.idKantor === "1" ? "Kepala Kantor Wilayah" : "Kepala Kantor",
          jabatanPPT: capitalize(jabatanSurat),
        };
      }
      else {
        return {
          an: "",
          pejabatMengetahui: "",
          jabatanPPT: capitalize(jabatanSurat),
        };
      }
    }
  };

  const sortedPegawai = [...(suratTugas?.pegawai ?? [])].sort((a, b) => {
    return new Date(a.tglBerangkat).getTime() - new Date(b.tglBerangkat).getTime();
  });

  const formattedData = sortedPegawai.map((item) => {
    const isPerjalananKhusus =
      String(item?.typePerjalanan ?? "").trim().toLowerCase() === "khusus";
    
    const ppt = getJabatanPPT(item?.jabatan, suratTugas?.surat?.jabatan);
    const isDisabled = isAdmin && item.status === "perjalanan";
    console.log("item", item);
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
      aksi: (
        <div className="flex w-max gap-2">
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-xl border  px-3 py-2 text-sm font-semibold  ${!isDisabled ? "cursor-not-allowed opacity-50bg-gray-200 text-gray-400 border border-gray-300" : "border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"}`}
            onClick={() => setDeletedPegawai(item)}
            disabled={!isDisabled}
          >
            <TiDeleteOutline className="h-6 w-6" />
          </button>
          <button
              type="button"
              className={`inline-flex items-center justify-center rounded-xl border  px-3 py-2 text-sm font-semibold  ${!isDisabled ? "cursor-not-allowed opacity-50bg-gray-200 text-gray-400 border border-gray-300" : "border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"}`}
              onClick={() => setUpdatePerjalananPegawai({ data: item, show: true })}
              disabled={!isDisabled}
            >
              <TiEdit className="h-6 w-6" />
            </button>
          <PrintButton
            data={{
              ...item,
              lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
              tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
              tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
              kabkota: item.tujuan,
              kegiatan: suratTugas?.surat?.kegiatan || "-",
              unit: suratTugas?.surat?.unit,
              jabatanPPT : ppt.jabatanPPT,
              nipPPT: suratTugas?.surat?.nip,
              namaPPT: suratTugas?.surat?.nama,
              an: ppt.an,
              pejabatMengetahui: ppt.pejabatMengetahui,
              gol: item.gol || "-",
              nip: item.jenisPegawai === "PNS" || item.jenisPegawai === "PPPK" ? item.nip : "-",
              namaKantor: suratTugas?.surat?.namaKantor || "-",
              callCenter: suratTugas?.surat?.callCenter || "-",
              unitKantor: suratTugas?.surat?.unitKantor || " ",
              alamat: suratTugas?.surat?.alamat || "-",
              email: suratTugas?.surat?.email || "-",
              website: suratTugas?.surat?.website || "-",
              asal: item.kabkota
            }}
            format="/spd-format.docx"
            file={`spd-${item.nip}`}
          />
        </div>
      ),
    }
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas", href: "/perjalanan-dinas" },
    { label: suratTugas?.surat?.kegiatan || "Detail" },
  ];

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-8 mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Perjalanan Dinas
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Detail Perjalanan Dinas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola data perjalanan, surat tugas, dan daftar pegawai dalam satu
            halaman.
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={() => setShowUpdatePerjalanan(true)}
            >
              <FaEdit className="h-4 w-4" />
              Ubah Perjalanan
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              onClick={() => setShowAddPegawai(true)}
            >
              <FaPlusCircle className="h-4 w-4" />
              Tambah Pegawai
            </button>
          </div>
        )}
      </header>

      <InfoPerjalanan data={suratTugas?.surat} className="mb-8" />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pegawai
          </h2>
        </div>

        <DataTables headCells={HEAD_CELLS} data={formattedData} />
      </section>

      <InfoModal
        show={Boolean(deletedPegawai)}
        onConfirm={handleDelete}
        onCancel={() => setDeletedPegawai(null)}
      >
        {suratTugas?.pegawai?.length === 1 ? (
          <p>
            Pegawai ini adalah pegawai terakhir dalam perjalanan. Jika tetap
            dihapus, perjalanan otomatis akan terhapus. Apakah kamu yakin?
          </p>
        ) : (
          <p>Apakah kamu yakin ingin menghapus pegawai ini dari perjalanan?</p>
        )}
      </InfoModal>

      <FormModal
        className="w-4xl"
        icon={<FaEdit className="h-6 w-6 text-white" />}
        show={showUpdatePerjalanan}
      >
        <UpdatePerjalanan
          data={suratTugas?.surat}
          onSubmit={handleUpdatePerjalanan}
          onClose={() => setShowUpdatePerjalanan(false)}
          pejabat={pejabat}
        />
      </FormModal>

      <FormModal
        className="w-[95vw] max-w-6xl"
        icon={<FaPlusCircle className="h-6 w-6 text-white" />}
        show={showAddPegawai}
      >
        <AddPegawaiPerjalanan
          tglSurat={suratTugas?.surat?.tglSurat}
          onSubmit={handleAddPegawai}
          onClose={() => setShowAddPegawai(false)}
          pegawai={pegawaiTanpaPerjalanan}
          kabkota={kabkota}
          surat={suratTugas?.surat}
        />
      </FormModal>
      
      {/* Edit Perjalanan Pegawai */}
      <FormModal
        className="w-[95vw] max-w-6xl"
        icon={<TiEdit className="h-6 w-6 text-white" />}
        show={updatePerjalananPegawai?.show}
      >
        <AddPegawaiPerjalanan
          tglSurat={suratTugas?.surat?.tglSurat}
          onSubmit={handleUpdatePerjalananPegawai}
          onClose={() => setUpdatePerjalananPegawai({ data: null, show: false })}
          pegawai={pegawaiTanpaPerjalanan}
          kabkota={kabkota}
          type="edit"
          perjalananPegawai={updatePerjalananPegawai?.data}
        />
      </FormModal>

      <Snackbar
        show={snackbar.show}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar(EMPTY_SNACKBAR)}
      />

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}
