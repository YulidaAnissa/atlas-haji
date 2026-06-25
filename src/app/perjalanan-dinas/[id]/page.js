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
} from "@/hooks/useData";
import { calculateTripDuration, formatDate, formatRangeDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";

const EMPTY_SNACKBAR = {
  show: false,
  message: "",
  type: "",
};

const HEAD_CELLS = [
  { id: "nama", label: "Nama Pegawai", numeric: false },
  { id: "tujuan", label: "Tujuan", numeric: false },
  { id: "tanggal", label: "Tanggal", numeric: false },
  { id: "aksi", label: "", numeric: false, align: "right" },
];

export default function Component() {
  const { id } = useParams();
  const router = useRouter();

  const [profil, setProfil] = useState(null);
  const [deletedNip, setDeletedNip] = useState(null);
  const [showAddPegawai, setShowAddPegawai] = useState(false);
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
      });

      await fetchSuratTugas();
      setShowAddPegawai(false);
      showNotification("Pegawai berhasil ditambahkan", "success");
    } catch {
      showNotification("Gagal menambahkan pegawai", "error");
    }
  };

  const handleDelete = async () => {
    try {
      startLoading();

      const result = await deletePegawaiPerjalanan({
        idSurat: id,
        nip: deletedNip,
      });

      setDeletedNip(null);

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

  const formattedData = (suratTugas?.pegawai ?? []).map((item) => {
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
      aksi: (
        <div className="flex w-max gap-2">
          {isAdmin && item.status === "perjalanan" && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              onClick={() => setDeletedNip(item.nip)}
            >
              Hapus
            </button>
          )}

          <PrintButton
            data={{
              ...item,
              lama: calculateTripDuration(item.tglBerangkat, item.tglKembali),
              tglBerangkat: formatDate(item.tglBerangkat, "DD MMMM YYYY"),
              tglKembali: formatDate(item.tglKembali, "DD MMMM YYYY"),
              kabkota: item.tujuan,
              kegiatan: suratTugas?.surat?.kegiatan || "-",
              unit: suratTugas?.surat?.unit,
              jabatanPPT: suratTugas?.surat?.jabatan,
              nipPPT: suratTugas?.surat?.nip,
              namaPPT: suratTugas?.surat?.nama,
            }}
            format="/spd-format.docx"
            file={`spd-${item.nip}`}
            text="Lihat Surat Perjalanan Dinas"
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
        show={Boolean(deletedNip)}
        onConfirm={handleDelete}
        onCancel={() => setDeletedNip(null)}
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
