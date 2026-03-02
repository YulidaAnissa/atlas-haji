"use client";
import PageBase  from "@/components/pagebase";
import { useRouter } from "next/navigation";
import AddKabKotaForm from "@/components/forms/AddKabKota";
import { useKabKota, useAddKabKota } from "@/hooks/useData";
import InfoModal from "@/components/elements/InfoModal";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function AddKabKota() {
  const [ showModalSuccess, setShowModalSuccess ] = useState(false); 
  const { fetch } = useKabKota();
  const { addKabKota, loading } = useAddKabKota();
  const router = useRouter();
  
  const handleSubmit = async (values, form) => {
    try {
      const payload = { ...values };

      await addKabKota(payload);
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
    { label: "Tambah" }
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Tambah Kabupaten / Kota Baru
        </h1>
      </div>
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="text-white w-6 h-6"/>}
        title="Data berhasil disimpan"
        onCancel={() => {
          setShowModalSuccess(false);
          router.push("/kabupaten-kota");
        }}
      >
        <p className="text-gray-500 mt-2">
          Kabupaten / Kota sudah tersimpan dengan aman.
        </p>
      </InfoModal>
      <AddKabKotaForm 
        onSubmit={handleSubmit} 
      />
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
