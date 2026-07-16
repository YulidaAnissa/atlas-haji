"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import AddPegawaiForm from "@/components/forms/Pegawai";
import { usePegawai, useAddPegawai } from "@/hooks/useData";
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function Pegawai() {
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { fetch } = usePegawai();
  const { addPegawai, loading } = useAddPegawai();
  const router = useRouter();

  const handleSubmit = async (values, form) => {
    try {
      const payload = { 
        ...values, 
        status: values.isPejabat ? "eselon" : "pegawai" 
      };

      await addPegawai(payload);
      form.reset();
      
      if (typeof fetch === 'function') await fetch();
      
      setShowModalSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.err || err.message || "Terjadi kesalahan saat menyimpan data";

      if (errorMessage.toLowerCase().includes("nip") || errorMessage.toLowerCase().includes("terdaftar")) {
        return { 
          nip: "NIP/NIK ini sudah terdaftar dalam sistem" 
        };
      }
      
      return { FORM_ERROR: errorMessage };
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Pegawai", href: "/pegawai" },
    { label: "Tambah" },
  ];

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      {/* BREADCRUMB SECTION */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItem} />
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
              Lengkapi data profil pegawai, nomor identitas (NIP), pangkat, golongan, 
              serta detail jabatan untuk pemetaan otomatis hak biaya perjalanan dinas.
            </p>
          </div>
        </div>
      </section>

      {/* FORM CONTAINER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {isMounted ? (
          <AddPegawaiForm onSubmit={handleSubmit} type="add" />
        ) : (
          <div className="h-48 w-full animate-pulse rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
            <span>Menyiapkan formulir aman...</span>
          </div>
        )}
      </section>

      {/* MODAL SUCCESS */}
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data Berhasil Disimpan"
        onCancel={() => {
          setShowModalSuccess(false);
          router.push("/pegawai");
        }}
        onConfirm={() => {
          setShowModalSuccess(false);
          router.push("/pegawai");
        }}
      >
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Profil data pegawai baru telah terdaftar dan siap digunakan di modul administrasi perjalanan dinas.
        </p>
      </InfoModal>

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}