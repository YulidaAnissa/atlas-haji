"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import LoginPage from '../../components/forms/Login';
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import InfoModal from "@/components/elements/InfoModal";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Components() {
  const [ infoError, setInfoError ] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (values) => {
    login(values)
  };

  useEffect(() => {
    if(error) {
      setInfoError(true);
    }
  }, [error]);

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
        <InfoModal
          show={infoError}
          icon={<FaExclamationTriangle className="text-white w-6 h-6"/>}
          title="Login Gagal"
          onCancel={() => setInfoError(false)}
        >
          <p className="text-gray-500 mt-2">
            {error}
          </p>
        </InfoModal>
      </div>
    </div>
  );
}