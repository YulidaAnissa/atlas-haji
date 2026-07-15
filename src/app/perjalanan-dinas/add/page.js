"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

import PageBase from "@/components/pagebase";
import AddPerjalananForm from "@/components/forms/Perjalanan";
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

import { usePegawai } from "@/hooks/useData";
import { useAddSuratTugas } from "@/hooks/useData";
import { formatDate } from "@/utils/date";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  {
    label: "Daftar Perjalanan Dinas",
    href: "/perjalanan-dinas",
  },
  { label: "Tambah Surat Tugas" },
];

function getOptionValue(option) {
  if (typeof option === "object" && option !== null) {
    return option.value;
  }

  return option;
}

function buildSuratTugasFormData(values) {
  const formData = new FormData();

  const nip = getOptionValue(values.nip);
  const noSurat = getOptionValue(values.noSurat);

  if (values.idSurat) {
    formData.append("idSurat", values.idSurat);
  }

  if (nip) {
    formData.append("nip", nip);
  }

  if (noSurat) {
    formData.append("noSurat", noSurat);
  }

  if (values.tglSurat) {
    formData.append(
      "tglSurat",
      formatDate(values.tglSurat, "YYYY-MM-DD")
    );
  }

  if (values.kegiatan) {
    formData.append(
      "kegiatan",
      String(values.kegiatan).trim()
    );
  }

  if (values.fileSurat) {
    formData.append("fileSurat", values.fileSurat);
  }

  return formData;
}

export default function AddPerjalananDinas() {
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [showErrorModal, setShowErrorModal] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [savedDataId, setSavedDataId] = useState(null);

  const { addSuratTugas, loading } = useAddSuratTugas();
  const {
    data: pejabat = [],
    loading: loadingPejabat,
  } = usePegawai({
    params: {
      status: "eselon",
    },
  });

  const handleSubmit = async (values, form) => {
    try {
      const formData =
        buildSuratTugasFormData(values);

      const resp = await addSuratTugas(formData);

      form.reset();

      setSavedDataId(resp?.idSurat);
      setShowSuccessModal(true);
      setShowErrorModal(false);
    } catch (error) {
      console.error(
        "Gagal menyimpan surat tugas:",
        error
      );
      setErrorMessage(
        error?.message ||
          error?.err ||
          "Terjadi kesalahan saat menyimpan perjalanan dinas."
      );

      setShowErrorModal(true);
      setShowSuccessModal(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);

    if (savedDataId) {
      router.push(
        `/perjalanan-dinas/${savedDataId}`
      );

      return;
    }

    router.push("/perjalanan-dinas");
  };

  return (
    <PageBase className="mx-auto max-w-5xl px-6 py-10 lg:px-12">
      <Breadcrumb items={breadcrumbItems} />
      <AddPerjalananForm
        onSubmit={handleSubmit}
        pejabat={pejabat}
      />
      <InfoModal
        show={showSuccessModal}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Perjalanan Dinas berhasil disimpan"
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={handleSuccessConfirm}
      />
      <InfoModal
        show={showErrorModal}
        title="Perjalanan Dinas gagal disimpan"
        onCancel={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
      >
        <p className="mt-2 text-gray-500">
          {errorMessage}
        </p>
      </InfoModal>

      <LoadingOverlay
        show={loading || loadingPejabat}
      />
    </PageBase>
  );
}