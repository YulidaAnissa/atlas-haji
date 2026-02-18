"use client";
import PageBase  from "@/components/pagebase";
import { useRouter } from "next/navigation";
import AddPerjalananForm from "@/components/forms/AddPerjalanan";
import { useKabKota, usePegawai } from "@/hooks/useData";
import { postPerjalanan } from "./actions";
import { useLoading } from "@/hooks";
import InfoModal from "@/components/elements/InfoModal";
import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { IoAlert } from "react-icons/io5";
import { formatDate } from "@/utils/date";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import Breadcrumb from "@/components/elements/Breadcrumb";

export default function AddPerjalananDinas() {
  const router = useRouter();
  const [ showModalSuccess, setShowModalSuccess ] = useState(false); 
  const [ showModalError, setShowModalError ] = useState(false); 
  const [ dataRes, setDataRes ] = useState({}); 

  const { data: kabkota } = useKabKota();
  const { data: pegawai } = usePegawai();
  const [loading, startLoading, endLoading] = useLoading();
  
  const handleSubmit = async (values, form) => {
    try {
      startLoading();
      const pegawaiArray = Array.isArray(values.pegawai)
        ? values.pegawai.map(opt => opt) // ambil hanya NIP string
        : [];

      const payload = {
        pegawai: pegawaiArray,
        tglBerangkat: values.dateRange.formattedStart,
        tglKembali: values.dateRange.formattedEnd,
        idKabKota: values.tujuan,   // pastikan tujuan = idKabKota
      };

      // console.log(values);


      const res = await postPerjalanan(payload);
      form.reset();
      setShowModalSuccess(true);
      setDataRes(res.idPerjalanan);
    } catch (err) {
      setShowModalError(true);
      setDataRes({
        data: [...err?.konflik],
          tglBerangkatValue: values.dateRange.formattedStart,
          tglKembaliValue: values.dateRange.formattedEnd, // usually end, not start
      });

    } finally {
      endLoading();
    }
  };

  const breadcrumbItem = [
    { label: "Home", href: "/" },
    { label: "Daftar Perjalanan Dinas", href: "/perjalanan-dinas" },
    { label: "Tambah" }
  ];
  return (
    <PageBase className="p-16 mx-auto">
      {/* Header */}
      <Breadcrumb items={breadcrumbItem} />
      <div className="mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)] tracking-wide">
          Tambah Perjalanan Dinas Baru
        </h1>
      </div>
      <InfoModal 
        onConfirm={() => router.push(`/perjalanan-dinas/${dataRes}`)}
        show={showModalSuccess}
        icon={<FaCheck className="text-white w-6 h-6"/>}
        title="Data berhasil disimpan"
        onCancel={() => setShowModalSuccess(false)}
      >
        <p className="text-gray-500 mt-2">
          Perubahan sudah tersimpan dengan aman. Apakah kamu ingin melanjutkan?
        </p>
      </InfoModal>
      <InfoModal
        show={showModalError}
        icon={<IoAlert className="text-white w-6 h-6"/>}
        title="Data gagal disimpan"
        onCancel={() => setShowModalError(false)}
      >
        <div>
          <p className="text-gray-500 my-2">
            Ada pegawai yang sudah punya perjalanan di tanggal {dataRes?.tglBerangkatValue} s/d. {dataRes?.tglKembaliValue}
          </p>
          <ul className="space-y-2 text-left">
            {dataRes?.data?.map((item, index) => (
              <li
                key={index}
                className="grid p-2 rounded-lg border border-gray-200 hover:shadow-md transition"
              >
                  <p className="text-sm font-semibold text-gray-700">{item.nama}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.tglBerangkat)} s/d. {formatDate(item.tglKembali)} Tujuan {item.kabkota}
                  </p>
                
              </li>
            ))}
          </ul>

        </div>
      </InfoModal>
      <AddPerjalananForm 
        onSubmit={handleSubmit} 
        kabkota={kabkota}
        pegawai={pegawai}
      />
      <LoadingOverlay show={loading}/>
    </PageBase>
  );
}
