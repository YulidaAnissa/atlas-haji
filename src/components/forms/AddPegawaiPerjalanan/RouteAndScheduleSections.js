"use client";

import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { DatePickerRange, MultiSelectTextField } from "@/components/forms/FormField";
import SelectField from "../FormField/SelectField";

export function ScheduleSection({ tglSurat }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-0">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FiCalendar className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Jadwal Perjalanan</h3>
          <p className="mt-0.5 text-xs text-slate-500">Tanggal berangkat dan kembali</p>
        </div>
      </div>

      <div className="p-4">
        <Field name="dateRange">
          {({ input, meta }) => {
            const hasError = Boolean((meta.touched || meta.submitFailed) && meta.error);
            const errorMessage = Array.isArray(meta.error)
              ? meta.error[0]?.message
              : meta.error;

            const suratDate = tglSurat ? new Date(tglSurat) : null;
            if (suratDate) suratDate.setHours(0, 0, 0, 0);

            return (
              <div>
                {hasError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-xs font-medium leading-5 text-red-600">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <DatePickerRange
                  input={input}
                  meta={meta}
                  minDate={suratDate}
                  className="w-full"
                />
              </div>
            );
          }}
        </Field>
      </div>
    </section>
  );
}

ScheduleSection.propTypes = {
  tglSurat: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

export function RouteSection({ kabkotaOptions, values }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FiMapPin className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Rute Perjalanan</h3>
          <p className="mt-0.5 text-xs text-slate-500">Tentukan kota asal dan titik tujuan</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <Field
          name="idKabKota"
          component={SelectField}
          label="Kota Asal"
          options={kabkotaOptions}
          placeholder="Pilih kota keberangkatan"
          className="w-full"
        />

        <div>
          <Field
            name="tujuan"
            component={MultiSelectTextField}
            label="Kota Tujuan"
            options={kabkotaOptions}
            placeholder="Pilih tujuan perjalanan"
            className="w-full"
          />

          {values.tujuan && values.tujuan.length > 0 && (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#eadfbe] bg-[#fbf7ec] px-4 py-3">
              <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Tujuan terpilih (Sesuai Rute Perjalanan)
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
                  {Array.isArray(values.tujuan)
                    ? values.tujuan.join(", ")
                    : values.tujuan}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

RouteSection.propTypes = {
  kabkotaOptions: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};