"use client";
import React from "react";
import Image from 'next/image';
import LoginPage from '../../components/forms/Login';
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/elements/LoadingOverlay";

export default function Components() {
  const { login, loading, error } = useAuth();

  // const { register, handleSubmit, formState: { errors }, reset } = useForm();
  // const onSubmit = async (data) => {
  //   const formData = new FormData();
  //   formData.append('nip', data.nip);
  //   formData.append('password', data.password);
  //   console.log('Form Data Submitted:', data);

  //   // if (kategori === 3) {
  //   // formData.append('file', data.file[0]);
  //   // } else {
  //   //   formData.append('link', data.link);
  //   // }

  //   // const result = await postModul(formData);

  //   // if (result) {
  //   //   setShowModal(true);
  //   //   reset(); // reset semua input form
  //   //   setFileName('');
  //   //   setPreviewURL(null);

  //   // } else {
  //   //   alert('Gagal mengirim modul.');
  //   // }
  // };

  const handleSubmit = async (values) => {
    login(values)
  };


  return (
    <div className="min-h-screen flex from-green-50 via-white to-yellow-50">
      {/* Left side - Emblem */}
      <div className="w-1/2 bg-brand text-white flex flex-col justify-center items-center p-8 shadow-lg">
        <Image src="/logo.png" alt="Garuda Emblem" width={266} height={266} />
      </div>

      {/* Right side - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <div className="bg-white/70 p-10 w-full">
          <h1 className="text-7xl font-bold mb-2 text-center tracking-wide">
            ATLAS
          </h1>
          <p className="font-medium mb-6 text-center">
            APLIKASI TATA KELOLA ADMINISTRASI PERJALANAN DINAS
          </p>
          <LoginPage 
            onSubmit={handleSubmit}
          />
        </div>
        <LoadingOverlay show={loading}/>
      </div>
    </div>
  );
}