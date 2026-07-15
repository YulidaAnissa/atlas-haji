"use client";

import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";

import { UploadFile } from "@/components/forms/FormField";
import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import TextAreaField from "../FormField/TextAreaField";
import validation from "./validate";

const noop = () => {};

const getDateOrToday = (date) => (date ? new Date(date) : new Date());

const hasBiayaPerjalanan = (data) =>
  Boolean(data?.biayaTrans || data?.buktiTrans || data?.biayaPeng || data?.buktiPeng);

export default function ComponentForm({
  data = {},
  onSubmit,
  onClose = noop,
  type = "edit",
  pegawai = [],
}) {
  const isAddMode = type === "add";

  const pegawaiOptions = useMemo(() => {
    if (!isAddMode) return [];

    return pegawai
      .filter((item) => item.status === "perjalanan")
      .map((item) => ({
        value: item.idPerjalananPegawai,
        label: `${item.nip} | ${item.nama}`,
      }));
  }, [isAddMode, pegawai]);

  const initialValues = useMemo(
    () => ({
      ...data,
      tujuan: data?.idKabKota || "",
      pegawai: data?.pegawai ?? null,
      hasil: data?.hasil || `Terlaksananya tugas ${data[0]?.kegiatan}`,
      spd: data?.spd || null,
      adaBiayaPerjalanan: hasBiayaPerjalanan(data),
      biayaTrans: data?.biayaTrans || "",
      buktiTrans: data?.buktiTrans || null,
      biayaPeng: data?.biayaPeng || "",
      buktiPeng: data?.buktiPeng || null,
      dateRange: {
        startDate: getDateOrToday(data?.tglBerangkat),
        endDate: getDateOrToday(data?.tglKembali),
      },
    }),
    [data],
  );

  console.log('data laporan form', initialValues);

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} validate={validation}>
      {({ handleSubmit, values }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex max-h-[80vh] flex-col overflow-y-auto"
        >
          <div className="space-y-6 px-1">
            {isAddMode && (
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
                name="hasil"
                component={TextAreaField}
                label="Hasil Laporan"
                type="text"
              />

              <Field
                name="spd"
                component={UploadFile}
                label="Surat Perjalanan Dinas"
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
                    name="biayaTrans"
                    component={InputField}
                    label="Biaya Transportasi"
                    startAdornment={
                      <span className="text-sm font-semibold text-gray-500">
                        Rp
                      </span>
                    }
                  />

                  <Field
                    name="biayaPeng"
                    component={InputField}
                    label="Biaya Penginapan"
                    startAdornment={
                      <span className="text-sm font-semibold text-gray-500">
                        Rp
                      </span>
                    }
                  />

                  <Field
                    name="buktiTrans"
                    component={UploadFile}
                    label="Bukti Pendukung Transportasi"
                  />

                  <Field
                    name="buktiPeng"
                    component={UploadFile}
                    label="Bukti Pendukung Penginapan"
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
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              Tutup
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}