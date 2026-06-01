"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaEdit, FaPlusCircle } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import {
  DataTables,
  Breadcrumb,
  InfoModal,
  FormModal,
  Snackbar,
} from "@/components/elements";
import PrintButton from "@/components/elements/PrintButton";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

import AddPegawaiPerjalanan from "@/components/forms/AddPegawaiPerjalanan";
import UpdatePerjalanan from "@/components/forms/UpdatePerjalanan";

import {
  usePegawai,
  useUpdatePerjalanan,
  useKabKota,
  usePerjalanan,
  useDeletePerjalananPegawai,
  useAddPegawaiPerjalanan,
  useSuratTugas,
} from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { calculateTripDuration, formatDate } from "@/utils/date";
import { profileStorage } from "@/utils/storage";

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

export default function Component() {
  const { id } = useParams();
  const router = useRouter();

  const [deleted, setDeleted] = useState(null);
  const [showAddPegawai, setShowAddPegawai] = useState(false);
  const [showUpdatePerjalanan, setShowUpdatePerjalanan] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [loading, startLoading, endLoading] = useLoading();

  const { data, isLoading, fetch } = usePerjalanan({ urlParams: { id } });
  const { data: pejabat } = usePegawai({ params: { status: "pejabat" } });
  const { data: pegawai } = usePegawai();
  const { data: kabkota } = useKabKota();
  const { data: suratTugas } = useSuratTugas();

  const { postPegawai } = useAddPegawaiPerjalanan();
  const { deletePerjalananPegawai } = useDeletePerjalananPegawai();
  const { updatePerjalanan } = useUpdatePerjalanan();
  const [profil, setProfil] = useState(null);
  
  useEffect(() => {
    setProfil(profileStorage.get());
  }, []);

  const isAdmin =
    String(profil?.role || "").trim().toLowerCase() === "admin";

  const perjalanan = data?.perjalanan;

  const pegawaiTanpaPerjalanan = pegawai?.filter(
    (p) => !data?.pegawai?.some((pp) => pp.nip === p.nip)
  );

  const handleUpdatePerjalanan = async (values) => {
    try {
      startLoading();
      console.log('update values', values);

      const formData = new FormData();

      if (values.nip) formData.append("nip", values.nip?.value);
      if (values.dateRange?.formattedStart) {
        formData.append("tglBerangkat", formatDate(values.dateRange.formattedStart, "YYYY-MM-DD"));

      }
      if (values.dateRange?.formattedEnd) {
        formData.append("tglKembali", formatDate(values.dateRange.formattedEnd, "YYYY-MM-DD"));
      }
      if (values.tujuan) formData.append("idKabKota", values.tujuan?.value);
      if (values.idSurat) formData.append("idSurat", values.idSurat?.value);
      if (values.noSurat) formData.append("noSurat", values.noSurat);
      if (values.tglSurat) {
        formData.append("tglSurat", formatDate(values.tglSurat, "YYYY-MM-DD"));
      }
      if (values.kegiatan) formData.append("kegiatan", values.kegiatan);
      if (values.file) formData.append("file", values.file);

      await updatePerjalanan(id, formData);
      await fetch();

      setShowUpdatePerjalanan(false);
      setShowSnackbar({
        show: true,
        message: "Perjalanan berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: `Gagal disimpan${err?.message ? `: ${err.message}` : ""}`,
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleAddPegawai = async (values) => {
    try {
      startLoading();

      await postPegawai({
        pegawai: [values.pegawai.value],
        idPerjalanan: id,
      });

      await fetch();
      setShowAddPegawai(false);
      setShowSnackbar({
        show: true,
        message: "Pegawai berhasil ditambahkan",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menambahkan pegawai",
        type: "error",
      });
      return err;
    } finally {
      endLoading();
    }
  };

  const handleDelete = async () => {
    try {
      startLoading();

      const result = await deletePerjalananPegawai({
        idPerjalanan: id,
        nip: deleted,
      });

      setDeleted(null);

      if (result?.message?.includes("perjalanan otomatis terhapus")) {
        router.push("/perjalanan-dinas");
      } else {
        await fetch();
      }

      setShowSnackbar({
        show: true,
        message: "Pegawai berhasil dihapus",
        type: "success",
      });
    } catch (err) {
      setShowSnackbar({
        show: true,
        message: "Gagal menghapus pegawai",
        type: "error",
      });
    } finally {
      endLoading();
    }
  };

  const headCells = [
    { id: "nip", label: "NIP", numeric: false },
    { id: "nama", label: "Nama Pegawai", numeric: false },
    { id: "gol", label: "Gol", numeric: false },
    { id: "jabatan", label: "Jabatan", numeric: false },
    { id: "aksi", label: "", numeric: false, align: "right" },
  ];

  const formattedData = (data?.pegawai ?? []).map((item) => ({
    ...item,
    aksi: (
      <div className="flex w-max gap-2">
        {isAdmin && item.status === "perjalanan" && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            onClick={() => setDeleted(item.nip)}
          >
            Hapus
          </button>
        )}

        <PrintButton
          data={{
            ...item,
            lama: calculateTripDuration(
              perjalanan?.tglBerangkat,
              perjalanan?.tglKembali
            ),
            tglBerangkat: formatDate(perjalanan?.tglBerangkat, "DD MMMM YYYY"),
            tglKembali: formatDate(perjalanan?.tglKembali, "DD MMMM YYYY"),
            kabkota: perjalanan?.kabkota,
            kegiatan: perjalanan?.kegiatan,
            unit: perjalanan?.unit,
            jabatanPPK: perjalanan?.jabatan,
            nipPPK: perjalanan?.nip,
            namaPPK: perjalanan?.nama,
          }}
          format="/spd-format.docx"
          file={`spd-${item.nip}`}
          text="Cetak SPD"
        />
      </div>
    ),
  }));

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas", href: "/perjalanan-dinas" },
    { label: perjalanan?.kegiatan || "Detail" },
  ];

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItem} />

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

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {perjalanan?.file && (
            <a
              href={perjalanan.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <IoDocumentTextOutline className="h-4 w-4" />
              Lihat Surat Tugas
            </a>
          )}
          {isAdmin && (
            <>
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
            </>
          )}
        </div>
      </header>

      <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Perjalanan
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Ringkasan tanggal, tujuan, kegiatan, dan surat tugas.
              </p>
            </div>

            {perjalanan?.type === "khusus" && (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Perjalanan Khusus
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            label="Tanggal Berangkat"
            value={formatDate(perjalanan?.tglBerangkat)}
          />
          <DetailItem
            label="Tanggal Kembali"
            value={formatDate(perjalanan?.tglKembali)}
          />
          <DetailItem label="Tujuan" value={perjalanan?.kabkota} />
          <DetailItem label="Kegiatan" value={perjalanan?.kegiatan} />
          <DetailItem label="No Surat" value={perjalanan?.noSurat} />
          <DetailItem
            label="Tanggal Surat"
            value={
              perjalanan?.tglSurat ? formatDate(perjalanan.tglSurat) : "-"
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pegawai
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Cetak SPD atau hapus pegawai dari perjalanan jika masih dalam status
            perjalanan.
          </p>
        </div>

        <DataTables
          headCells={headCells}
          data={formattedData}
          loading={isLoading}
        />
      </section>

      <InfoModal
        show={!!deleted}
        onConfirm={handleDelete}
        onCancel={() => setDeleted(null)}
      >
        {data?.pegawai?.length === 1 ? (
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
          data={perjalanan}
          kabkota={kabkota}
          onSubmit={handleUpdatePerjalanan}
          onClose={() => setShowUpdatePerjalanan(false)}
          st={suratTugas}
          pejabat={pejabat}
        />
      </FormModal>

      <FormModal
        icon={<FaPlusCircle className="h-6 w-6 text-white" />}
        show={showAddPegawai}
      >
        <AddPegawaiPerjalanan
          onSubmit={handleAddPegawai}
          onClose={() => setShowAddPegawai(false)}
          pegawai={pegawaiTanpaPerjalanan}
        />
      </FormModal>

      <Snackbar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.message}
        onClose={() => setShowSnackbar({ show: false, message: "", type: "" })}
      />

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}