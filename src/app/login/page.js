"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LoginPage from "../../components/forms/Login";
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/elements/LoadingOverlay";
import InfoModal from "@/components/elements/InfoModal";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Components() {
  const [infoError, setInfoError] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (values) => {
    await login(values);
  };

  useEffect(() => {
    if (error) {
      setInfoError(true);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-brand px-10 py-12 text-zinc-950 lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
            <div className="mb-8 grid h-72 w-72 place-items-center rounded-full border border-white/25 bg-white/15 shadow-2xl shadow-black/20 backdrop-blur-md">
              <Image
                src="/logo.png"
                alt="Garuda Emblem"
                width={230}
                height={230}
                priority
                className="drop-shadow-2xl"
              />
            </div>

            <div className="max-w-xl text-center">
              {/* Bagian yang diperbagus */}
              <div className="mb-6 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/75">
                  Kantor Wilayah Kementerian Haji dan Umrah
                </p>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-white">
                  Provinsi Jawa Barat
                </p>
              </div>

              <h1 className="text-7xl font-black tracking-wide text-white drop-shadow-md">
                ATLAS
              </h1>

              <div className="mx-auto mt-5 flex w-32 items-center justify-center gap-2">
                <span className="h-px flex-1 bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                <span className="h-px flex-1 bg-white/40" />
              </div>

              <p className="mx-auto mt-6 max-w-lg text-lg font-medium leading-8 text-white/85">
                Menghadirkan tata kelola perjalanan dinas yang lebih terstruktur, terukur, akuntabel dan sistematis
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-sm text-white/70">
            <span>v1.0</span>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 flex justify-center lg:hidden">
              <div className="grid h-24 w-24 place-items-center rounded-2xl bg-brand shadow-xl shadow-brand/25">
                <Image
                  src="/logo.png"
                  alt="Garuda Emblem"
                  width={76}
                  height={76}
                  priority
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#eadfbe] bg-white px-7 py-9 shadow-[0_24px_80px_rgba(201,169,97,0.18)] sm:px-10">
              <div className="mb-8 text-center">
                {/* Penyesuaian juga pada bagian kartu login mobile/kanan */}
                <div className="mb-3 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand/80">
                    Kanwil Kementerian Haji dan Umrah
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-brand">
                    Provinsi Jawa Barat
                  </p>
                </div>

                <h1 className="text-5xl font-black tracking-wide text-slate-950 sm:text-6xl">
                  ATLAS
                </h1>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                  Aplikasi Tata Kelola Administrasi Perjalanan Dinas
                </p>
              </div>

              <LoginPage onSubmit={handleSubmit} />
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Pastikan akun dan kata sandi hanya digunakan pada perangkat yang
              terpercaya.
            </p>
          </div>

          <LoadingOverlay show={loading} />

          <InfoModal
            show={infoError}
            icon={<FaExclamationTriangle className="h-6 w-6 text-white" />}
            title="Login Gagal"
            onCancel={() => setInfoError(false)}
          >
            <p className="mt-2 text-gray-500">{error}</p>
          </InfoModal>
        </section>
      </div>
    </main>
  );
}