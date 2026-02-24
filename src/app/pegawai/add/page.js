"use client";
import PageBase  from "@/components/pagebase";
import { useRouter } from "next/navigation";
import AddPegawaiForm from "@/components/forms/AddPegawai";
import { useKabKota, usePegawai, useAddPegawai } from "@/hooks/useData";
import InfoModal from "@/components/elements/InfoModal";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function AddPegawai() {
  const [ showModalSuccess, setShowModalSuccess ] = useState(false); 

  const { addPegawai, loading } = useAddPegawai();
  
  const handleSubmit = async (values, form) => {
    try {
      const payload = { ...values, status: "pegawai" };

      await addPegawai(payload);
      form.reset();
      setShowModalSuccess(true);
    } catch (err) {
      return err;
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Pegawai", href: "/pegawai" },
    { label: "Tambah" }
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Tambah Pegawai Baru
        </h1>
      </div>
      <InfoModal
        show={showModalSuccess}
        icon={<FaCheck className="text-white w-6 h-6"/>}
        title="Data berhasil disimpan"
        onCancel={() => setShowModalSuccess(false)}
      >
        <p className="text-gray-500 mt-2">
          Pegawai sudah tersimpan dengan aman.
        </p>
      </InfoModal>
      <AddPegawaiForm 
        onSubmit={handleSubmit} 
      />
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
