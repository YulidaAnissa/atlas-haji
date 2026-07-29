"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi"; // Menggunakan FiBriefcase untuk representasi kantor

import PageBase from "@/components/pagebase";
import AddKantorForm from "@/components/forms/Kantor"; // Disesuaikan dengan form Kantor
import { useKantor, useAddKantor, useKabKota, usePegawai } from "@/hooks/useData"; // Disesuaikan dengan hooks Kantor
import InfoModal from "@/components/elements/InfoModal";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { extractKodeSurat } from "@/utils/string";

export default function AddKantor() {
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  const { fetch } = useKantor();
  const { addKantor, loading } = useAddKantor();
  const router = useRouter();
  const { data: kabkota } = useKabKota();
  const { data: pegawai } = usePegawai();

  const handleSubmit = async (values, form) => {
    try {
      // Helper aman untuk string trim
      const safeTrim = (val) => (val !== undefined && val !== null ? String(val).trim() : null);

      // Menyesuaikan payload dengan struktur tabel kantor
      const payload = {
        nama: safeTrim(values?.nama),
        alamat: safeTrim(values?.alamat),
        email: safeTrim(values?.email),
        website: safeTrim(values?.website),
        callCenter: safeTrim(values?.callCenter),
        idKabKota: values?.idKabKota?.value ? Number(values.idKabKota?.value) : null,
        unitKantor: safeTrim(values?.unitKantor),
        kodeSurat: values?.kodeSurat?.value ? extractKodeSurat(values.kodeSurat.value) : (safeTrim(values?.kodeSurat) || null),

        // Penanganan aman untuk PPK, PKOH, dan DIPA
        ppk: values?.ppk?.value !== undefined ? safeTrim(values.ppk.value) : safeTrim(values?.ppk),
        pkoh: values?.pkoh?.value !== undefined ? safeTrim(values.pkoh.value) : safeTrim(values?.pkoh),
        dipa: values?.dipa?.value !== undefined ? safeTrim(values.dipa.value) : safeTrim(values?.dipa),
      };

      await addKantor(payload);
      form.reset();
      await fetch();
      setShowModalSuccess(true);
    } catch (err) {
      console.error("Gagal menambahkan data kantor:", err);
      return err;
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Kantor", href: "/kantor" },
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
            <FiBriefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
              Data Master
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Tambah Kantor Baru
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lengkapi data informasi cabang, lokasi fisik, alamat, dan rincian kontak operasional perusahaan.
            </p>
          </div>
        </div>
      </section>

      {/* FORM CONTAINER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <AddKantorForm onSubmit={handleSubmit} kabKotaOptions={kabkota} pegawai={pegawai}/>
      </section>

      {/* MODAL SUCCESS */}
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="h-6 w-6 text-white" />}
        title="Data Berhasil Disimpan"
        onCancel={() => {
          setShowModalSuccess(false);
          router.push("/kantor");
        }}
        onConfirm={() => {
          setShowModalSuccess(false);
          router.push("/kantor");
        }}
      >
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Informasi operasional kantor baru telah tersimpan dengan aman ke dalam sistem data master.
        </p>
      </InfoModal>

      <LoadingOverlay show={loading} />
    </PageBase>
  );
}