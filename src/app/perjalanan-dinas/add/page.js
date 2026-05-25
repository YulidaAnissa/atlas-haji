"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { IoAlert } from "react-icons/io5";

import PageBase from "@/components/pagebase";
import AddPerjalananForm from "@/components/forms/AddPerjalanan";
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

import { useKabKota, usePegawai, useSuratTugas } from "@/hooks/useData";
import { useLoading } from "@/hooks";
import { formatDate } from "@/utils/date";
import { postPerjalanan } from "./actions";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Daftar Perjalanan Dinas", href: "/perjalanan-dinas" },
  { label: "Tambah" },
];

function buildPerjalananFormData(values, type) {
  const formData = new FormData();

  const pegawai = Array.isArray(values.pegawai)
    ? values.pegawai.map((item) => item.value)
    : [];

  formData.append("pegawai", JSON.stringify(pegawai));
  formData.append("nip", values.nip?.value);
  formData.append("tglBerangkat", values.dateRange.formattedStart);
  formData.append("tglKembali", values.dateRange.formattedEnd);
  formData.append("idKabKota", values.tujuan?.value);
  formData.append("status", "perjalanan");

  if (type) formData.append("type", type);

  if (values.idSurat) formData.append("idSurat", values.idSurat);
  if (values.noSurat) formData.append("noSurat", values.noSurat);
  if (values.tglSurat) {
    formData.append("tglSurat", formatDate(values.tglSurat, "YYYY-MM-DD"));
  }
  if (values.kegiatan) formData.append("kegiatan", values.kegiatan);
  if (values.fileSurat) formData.append("fileSurat", values.fileSurat);

  return formData;
}

export default function AddPerjalananDinas() {
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [savedPerjalananId, setSavedPerjalananId] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const [confirmSpecial, setConfirmSpecial] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const { data: kabkota } = useKabKota();
  const { data: pegawai } = usePegawai();
  const { data: pejabat } = usePegawai({ params: { status: "pejabat" } });
  const { data: suratTugas } = useSuratTugas();

  const [loading, startLoading, endLoading] = useLoading();

  const handleSubmit = async (values, form, type) => {
    try {
      startLoading();

      const formData = buildPerjalananFormData(values, type);
      const res = await postPerjalanan(formData);

      form.reset();
      setSavedPerjalananId(res.idPerjalanan);
      setShowSuccessModal(true);
      setShowErrorModal(false);
      setConfirmSpecial(false);
      setPendingSubmit(null);
    } catch (err) {
      setPendingSubmit({ values, form });

      setConflictData({
        data: err?.konflik ?? [],
        tglBerangkat: values.dateRange.formattedStart,
        tglKembali: values.dateRange.formattedEnd,
      });

      setShowErrorModal(true);
    } finally {
      endLoading();
    }
  };

  const handleConfirmSpecial = () => {
    if (!pendingSubmit) return;

    handleSubmit(pendingSubmit.values, pendingSubmit.form, "khusus");
  };

  return (
    <PageBase className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-10 mt-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-yellow-600">
          Perjalanan Dinas
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Tambah Perjalanan Dinas Baru
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Lengkapi data pegawai, tujuan, tanggal keberangkatan, dan surat tugas
          untuk membuat perjalanan dinas baru.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
        <AddPerjalananForm
          onSubmit={handleSubmit}
          kabkota={kabkota}
          pegawai={pegawai}
          pejabat={pejabat}
          st={suratTugas}
        />
      </section>

      <InfoModal
        show={showSuccessModal}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data berhasil disimpan"
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={() => router.push(`/perjalanan-dinas/${savedPerjalananId}`)}
      >
        <p className="mt-2 text-gray-500">
          Perjalanan dinas berhasil dibuat. Kamu bisa melanjutkan untuk melihat
          detail data yang baru disimpan.
        </p>
      </InfoModal>

      <InfoModal
        show={confirmSpecial}
        icon={<FaInfoCircle className="h-6 w-6 text-white" />}
        title="Perjalanan Khusus"
        onCancel={() => setConfirmSpecial(false)}
        onConfirm={handleConfirmSpecial}
      >
        <p className="mt-2 text-gray-500">
          Pegawai sudah memiliki perjalanan dinas pada periode tersebut. Tetap
          lanjutkan dan buat perjalanan ini sebagai perjalanan khusus?
        </p>
      </InfoModal>

      <InfoModal
        show={showErrorModal}
        icon={<IoAlert className="h-6 w-6 text-white" />}
        title="Data gagal disimpan"
        onCancel={() => setShowErrorModal(false)}
        onConfirm={() => {
          setConfirmSpecial(true);
          setShowErrorModal(false);
        }}
      >
        <div className="text-left">
          <p className="my-2 text-sm leading-6 text-gray-500">
            Ada pegawai yang sudah memiliki perjalanan pada tanggal{" "}
            <span className="font-semibold text-gray-700">
              {conflictData?.tglBerangkat}
            </span>{" "}
            s/d{" "}
            <span className="font-semibold text-gray-700">
              {conflictData?.tglKembali}
            </span>
            .
          </p>

          <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
            {conflictData?.data?.map((item, index) => (
              <li
                key={`${item.nama}-${index}`}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:border-yellow-300 hover:bg-yellow-50"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {item.nama}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {formatDate(item.tglBerangkat)} s/d{" "}
                  {formatDate(item.tglKembali)} · Tujuan {item.kabkota}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </InfoModal>

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}