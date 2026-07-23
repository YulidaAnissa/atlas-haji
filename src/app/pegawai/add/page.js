"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import AddPegawaiForm from "@/components/forms/Pegawai";
import { usePegawai, useAddPegawai, useKantor } from "@/hooks/useData"; 
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Snackbar } from "@/components/elements";
import { profileStorage } from "@/utils/storage";

export default function PegawaiPage() {
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [profil, setProfil] = useState(null);

  const router = useRouter();
  
  const { data: kantor, loading: loadingKantor } = useKantor(); 
  const { fetch: fetchPegawai } = usePegawai();
  const { addPegawai, loading: loadingAdd } = useAddPegawai();

  useEffect(() => {
    const userProfile = profileStorage.get();
    setProfil(userProfile);
    setIsMounted(true);
  }, []);

  const handleSubmit = async (values, form) => {
    try {
      const payload = {
        ...values,
        status: values.isPejabat ? "eselon" : "pegawai",
        idKantor: profil?.idKantor || ""
      };

      // await addPegawai(payload);
      
      if (form && typeof form.reset === "function") {
        form.reset();
      }

      if (typeof fetchPegawai === "function") {
        await fetchPegawai();
      }

      setShowModalSuccess(true);
    } catch (err) { // DIUBAH: Hapus ': any' di sini
      const errorMessage =
      err.response?.data?.err ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data pegawai";

      setShowSnackbar({
        show: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleCloseSuccessModal = () => {
    setShowModalSuccess(false);
    router.push("/pegawai");
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Daftar Pegawai", href: "/pegawai" },
    { label: "Tambah" },
  ];

  const isPageLoading = loadingAdd || loadingKantor;

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      {/* BREADCRUMB SECTION */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* HEADER BANNER SECTION */}
      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-linear-to-r from-[#fbf7ec] via-white to-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <FiUserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
              Data Master
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Tambah Pegawai Baru
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lengkapi data profil pegawai, nomor identitas (NIP), pangkat,
              golongan, penempatan kantor, serta detail jabatan untuk pemetaan otomatis hak biaya
              perjalanan dinas.
            </p>
          </div>
        </div>
      </section>

      {/* FORM CONTAINER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {isMounted ? (
          <AddPegawaiForm 
            onSubmit={handleSubmit} 
            type="add" 
            kantorOptions={kantor} 
          />
        ) : (
          <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 animate-pulse">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
            <span>Menyiapkan formulir...</span>
          </div>
        )}
      </section>

      {/* MODAL SUCCESS */}
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data Berhasil Disimpan"
        onCancel={handleCloseSuccessModal}
        onConfirm={handleCloseSuccessModal}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Profil data pegawai baru telah terdaftar dan siap digunakan di modul
          administrasi perjalanan dinas.
        </p>
      </InfoModal>
      <Snackbar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.message}
        onClose={() =>
          setShowSnackbar({ show: false, message: "", type: "" })
        }
      />

      {/* LOADING OVERLAY */}
      <LoadingOverlay show={isPageLoading} />
    </PageBase>
  );
}