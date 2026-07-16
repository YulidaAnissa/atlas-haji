"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

import PageBase from "@/components/pagebase";
import AddKabKotaForm from "@/components/forms/KabKota";
import { useKabKota, useAddKabKota } from "@/hooks/useData";
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function AddKabKota() {
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const { fetch } = useKabKota();
  const { addKabKota, loading } = useAddKabKota();
  const router = useRouter();

  const handleSubmit = async (values, form) => {
    try {
      // Memastikan konversi nominal string dari form input menjadi Number sebelum dikirim ke API
      const payload = {
        kabkota: values?.kabkota?.trim(),
        uhPNS: Number(values?.uhPNS) || 0,
        uhPPPK: Number(values?.uhPPPK) || 0,
        uhNonASN: Number(values?.uhNonASN) || 0,
        alamat: values?.alamat?.trim() || null,
      };

      await addKabKota(payload);
      form.reset();
      await fetch();
      setShowModalSuccess(true);
    } catch (err) {
      console.error("Gagal menambahkan data kabupaten/kota:", err);
      return err;
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Kabupaten / Kota", href: "/kabupaten-kota" },
    { label: "Tambah" },
  ];

  return (
    <PageBase className="mx-auto p-6 sm:p-8 lg:p-10">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      {/* HEADER BANNER SECTION */}
      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-linear-to-r from-[#fbf7ec] via-white to-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <FiMapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
              Data Master
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Tambah Kabupaten / Kota Baru
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lengkapi data wilayah tujuan serta alokasikan standar nominal uang harian 
              secara spesifik berdasarkan masing-masing status kepegawaian.
            </p>
          </div>
        </div>
      </section>

      {/* FORM CONTAINER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <AddKabKotaForm onSubmit={handleSubmit} />
      </section>

      {/* MODAL SUCCESS */}
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data Berhasil Disimpan"
        onCancel={() => {
          setShowModalSuccess(false);
          router.push("/kabupaten-kota");
        }}
        onConfirm={() => {
          setShowModalSuccess(false);
          router.push("/kabupaten-kota");
        }}
      >
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Standar biaya wilayah kabupaten / kota baru beserta matriks uang hariannya telah tersimpan dengan aman ke dalam sistem data master.
        </p>
      </InfoModal>

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}