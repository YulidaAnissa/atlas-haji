"use client";

import PageBase from "@/components/pagebase";
import { useRouter } from "next/navigation";
import AddKabKotaForm from "@/components/forms/KabKota";
import { useKabKota, useAddKabKota } from "@/hooks/useData";
import InfoModal from "@/components/elements/InfoModal";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function AddKabKota() {
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const { fetch } = useKabKota();
  const { addKabKota, loading } = useAddKabKota();
  const router = useRouter();

  const handleSubmit = async (values, form) => {
    try {
      await addKabKota({ ...values });
      form.reset();
      fetch();
      setShowModalSuccess(true);
    } catch (err) {
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
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItem} />
      </div>

      <section className="mb-8 rounded-2xl border border-[#eadfbe] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(201,169,97,0.12)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            Data Master
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Tambah Kabupaten / Kota Baru
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Lengkapi data kabupaten/kota, uang harian, biaya transportasi, dan
            biaya penginapan untuk kebutuhan perjalanan dinas.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <AddKabKotaForm onSubmit={handleSubmit} />
      </section>

      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data berhasil disimpan"
        onCancel={() => {
          setShowModalSuccess(false);
          router.push("/kabupaten-kota");
        }}
        onConfirm={() => {
          setShowModalSuccess(false);
          router.push("/kabupaten-kota");
        }}
      >
        <p className="mt-2 text-gray-500">
          Kabupaten / Kota sudah tersimpan dengan aman.
        </p>
      </InfoModal>

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}