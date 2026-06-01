"use client";

import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";

import TextAreaField from "../FormField/TextAreaField";
import SelectField from "../FormField/SelectField";
import InputField from "../FormField/InputField";
import { UploadFile } from "@/components/forms/FormField";

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = false,
  type = "edit",
  pegawai = [],
}) {
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  // console.log('data form ', data);
  console.log('pegawai ', pegawai);

  useEffect(() => {
    if (type === "add" && Array.isArray(pegawai)) {
      setPegawaiOptions(
        pegawai
          .filter((item) => item.status === "perjalanan")
          .map((item) => ({
            value: item.idPerjalananPegawai,
            label: `${item.nip} | ${item.nama}`,
          }))
      );
    }
  }, [pegawai, type]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        ...data,
        tujuan: data?.idKabKota || "",
        pegawai: data?.pegawai || "",
        hasil: data?.hasil || "",
        spd: data?.spd || null,

        adaBiayaPerjalanan:
          !!data?.biayaTrans ||
          !!data?.buktiTrans ||
          !!data?.biayaPeng ||
          !!data?.buktiPeng,

        biayaTrans: data?.biayaTrans || "",
        buktiTrans: data?.buktiTrans || null,
        biayaPeng: data?.biayaPeng || "",
        buktiPeng: data?.buktiPeng || null,

        dateRange: {
          startDate: data?.tglBerangkat
            ? new Date(data.tglBerangkat)
            : new Date(),
          endDate: data?.tglKembali ? new Date(data.tglKembali) : new Date(),
        },
      }}
    >
      {({ handleSubmit, values, form }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex max-h-[80vh] flex-col overflow-y-auto"
        >
          <div className="space-y-6 px-1">
            {type === "add" && (
              <Field
                name="pegawai"
                component={SelectField}
                label="Data Pegawai"
                options={pegawaiOptions}
                className="text-left"
              />
            )}

            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Laporan Perjalanan
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Lengkapi hasil laporan dan unggah dokumen SPD.
                </p>
              </div>

              <Field
                component={TextAreaField}
                label="Hasil Laporan"
                name="hasil"
                type="text"
              />

              <Field
                component={UploadFile}
                label="Surat Perjalanan Dinas"
                name="spd"
              />
            </section>

            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Biaya Perjalanan
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Aktifkan jika perjalanan memiliki biaya transportasi atau
                    penginapan.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <Field
                    name="adaBiayaPerjalanan"
                    component="input"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Ada biaya?
                  </span>
                </label>
              </div>

              {values.adaBiayaPerjalanan && (
                <div className="grid gap-5 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2">
                  <Field
                    component={InputField}
                    label="Biaya Transportasi"
                    name="biayaTrans"
                    startAdornment={
                      <span className="text-sm font-semibold text-gray-500">
                        Rp
                      </span>
                    }
                    type="number"
                  />

                  <Field
                    component={InputField}
                    label="Biaya Penginapan"
                    name="biayaPeng"
                    startAdornment={
                      <span className="text-sm font-semibold text-gray-500">
                        Rp
                      </span>
                    }
                    type="number"
                  />

                  <Field
                    component={UploadFile}
                    label="Bukti Pendukung Transportasi"
                    name="buktiTrans"
                  />

                  <Field
                    component={UploadFile}
                    label="Bukti Pendukung Penginapan"
                    name="buktiPeng"
                  />
                </div>
              )}
            </section>
          </div>

          <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-gray-200 bg-white px-1 py-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Simpan
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}