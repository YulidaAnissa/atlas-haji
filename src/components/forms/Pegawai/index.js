"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { FiSave, FiX } from "react-icons/fi";

import InputField from "../FormField/InputField";
import SelectField from "../FormField/SelectField";
import RadioField from "../FormField/RadioField";
import validation from "./validate";

// --- KONSTANTA & UTILS ---
const EMPLOYEE_TYPES = [
  { label: "PNS", value: "PNS" },
  { label: "PPPK", value: "PPPK" },
  { label: "Non ASN", value: "NON_ASN" },
];

/** Ekstrak nilai string dari objek React-Select atau string murni */
const extractValue = (val) => {
  if (!val) return "";
  if (typeof val === "object") return val.value ?? "";
  return String(val);
};

/** Normalisasi string Jenis Pegawai dari payload backend */
const normalizeJenisPegawai = (data = {}) => {
  const raw = String(data.jenisPegawai || data.jenis_pegawai || "").trim().toUpperCase();

  if (["PNS", "PPPK", "NON_ASN"].includes(raw)) return raw;
  if (raw.includes("NON") || raw.includes("HONORER")) return "NON_ASN";
  if (data.nik && !data.nip) return "NON_ASN";
  if (data.pangkat || (data.gol && String(data.gol).includes("/"))) return "PNS";
  if (data.nip) return "PNS";

  return "";
};

/** Normalisasi string Role dari payload backend (default: user) */
const normalizeRole = (data = {}) => {
  const raw = String(data.role || "").trim().toLowerCase();
  if (["user", "admin", "finance"].includes(raw)) return raw;
  return "user"; // Default role
};

/** Pengecekan status Pejabat */
const parseIsPejabat = (data = {}) => {
  if (data.isPejabat !== undefined) return Boolean(data.isPejabat);
  if (!data.status) return false;
  return String(data.status).toLowerCase().includes("eselon");
};

// --- SUB-KOMPONEN ---

function EmployeeIdentityFields({ employeeType, form, disabled }) {
  const handleTypeChange = (option) => {
    const newValue = extractValue(option);

    form.change("nip", "");
    if (newValue !== "PNS") {
      form.change("isPejabat", false);
      form.change("unit", "");
      form.change("pangkat", "");
    }
    if (newValue === "NON_ASN") {
      form.change("gol", "");
    }
  };

  return (
    <>
      <div className="col-span-2 sm:col-span-1">
        <Field
          name="jenisPegawai"
          component={SelectField}
          label="Jenis Pegawai"
          placeholder="Pilih jenis pegawai"
          options={EMPLOYEE_TYPES}
          disabled={disabled}
          onValueChange={handleTypeChange}
        />
      </div>

      <div className="col-span-2 sm:col-span-1">
        {(employeeType === "PNS" || employeeType === "PPPK") && (
          <Field
            name="nip"
            component={InputField}
            label="NIP"
            placeholder="Masukkan NIP"
            disabled={disabled}
          />
        )}

        {employeeType === "NON_ASN" && (
          <Field
            name="nip"
            component={InputField}
            label="NIK"
            placeholder="Masukkan NIK"
            disabled={disabled}
          />
        )}

        {!employeeType && (
          <Field
            name="nip"
            component={InputField}
            label="NIP / NIK"
            placeholder="Pilih jenis pegawai terlebih dahulu"
            disabled
          />
        )}
      </div>
    </>
  );
}

EmployeeIdentityFields.propTypes = {
  employeeType: PropTypes.string,
  form: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

function FormProgress({ values }) {
  const jenisVal = extractValue(values.jenisPegawai);
  const isPns = jenisVal === "PNS";
  const isPppk = jenisVal === "PPPK";

  // Target fields untuk kalkulasi progress kelengkapan data
  const targetFields = ["jenisPegawai", "nama", "jabatan", "nip", "noRek", "namaRek", "bank"];
  if (isPns) targetFields.push("pangkat", "gol");
  else if (isPppk) targetFields.push("gol");
  if (isPns && values.isPejabat) targetFields.push("unit");

  const filledCount = targetFields.filter((field) => {
    const val = extractValue(values[field]);
    return val.trim() !== "";
  }).length;

  const progress = Math.round((filledCount / targetFields.length) * 100);

  return (
    <aside className="sticky top-4 h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Kelengkapan Data</p>
          <span className="text-sm font-bold text-brand">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-brand transition-all duration-300 ease-out-in"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          PNS menggunakan NIP, pangkat & golongan. PPPK menggunakan NIP & golongan. Non ASN menggunakan NIK.
          {values.isPejabat && " Sebagai pejabat, kolom Unit wajib diisi."}
        </p>
      </div>
    </aside>
  );
}

FormProgress.propTypes = {
  values: PropTypes.object.isRequired,
};

function PegawaiFields({ values, form, isEdit }) {
  const currentJenis = extractValue(values.jenisPegawai);
  const isPns = currentJenis === "PNS";
  const isPppk = currentJenis === "PPPK";

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">Informasi Pegawai</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Isi identitas, kategori kepegawaian, dan jabatan saat ini.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <EmployeeIdentityFields employeeType={currentJenis} form={form} />

        <div className="col-span-2 sm:col-span-1">
          <Field
            name="nama"
            component={InputField}
            label="Nama Pegawai"
            placeholder="Masukkan nama lengkap beserta gelar"
          />
        </div>

        {isPns && (
          <div className="col-span-2 sm:col-span-1">
            <Field name="pangkat" component={InputField} label="Pangkat" placeholder="Contoh: Penata" />
          </div>
        )}

        {(isPns || isPppk) && (
          <div className="col-span-2 sm:col-span-1">
            <Field
              name="gol"
              component={InputField}
              label={isPppk ? "Golongan / Kelas Jabatan" : "Golongan"}
              placeholder={isPppk ? "Contoh: IX atau VII" : "Contoh: III/c"}
            />
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <Field
            name="jabatan"
            component={InputField}
            label="Jabatan"
            placeholder="Masukkan nama jabatan atau posisi saat ini"
          />
        </div>

        {isPns && (
          <>
            <div className="col-span-2 mt-2 border-t border-slate-100 py-2">
              <label className="flex cursor-pointer select-none items-center gap-3">
                <Field
                  name="isPejabat"
                  component="input"
                  type="checkbox"
                  onChange={(e) => {
                    form.change("isPejabat", e.target.checked);
                    if (!e.target.checked) form.change("unit", "");
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
                />
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">Pegawai ini merupakan Pejabat</p>
                  <p className="text-xs text-slate-500">Centang jika memiliki peran struktural tertentu</p>
                </div>
              </label>
            </div>

            {values.isPejabat && (
              <div className="col-span-2 animate-fadeIn">
                <Field
                  name="unit"
                  component={InputField}
                  label="Unit Kerja Pejabat"
                  placeholder="Masukkan nama unit kerja (Contoh: Bidang Integrasi Data)"
                />
              </div>
            )}
          </>
        )}

        {/* --- INFORMASI REKENING BANK --- */}
        <div className="col-span-2 mt-4 border-t border-slate-100 pt-5">
          <h4 className=" font-bold text-slate-900 mb-4">Informasi Rekening Bank</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              name="bank"
              component={InputField}
              label="Nama Bank"
              placeholder="Contoh: Bank Mandiri / BSI"
            />
            <Field
              name="noRek"
              component={InputField}
              label="Nomor Rekening"
              placeholder="Masukkan nomor rekening"
            />
            <Field
              name="namaRek"
              component={InputField}
              label="Nama Pemilik Rekening"
              placeholder="Sesuai buku tabungan"
            />
          </div>
        </div>

        {/* --- FIELD ROLE PENGGUNA (PALING BAWAH - RADIO GROUP) --- */}
        <div className="col-span-2 mt-4 border-t border-slate-100 pt-5">
          <Field name="role" component={RadioField} />
        </div>
      </div>
    </section>
  );
}

PegawaiFields.propTypes = {
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
};

// --- KOMPONEN UTAMA ---

export default function AddPegawaiForm({
  onSubmit = () => {},
  data = {},
  onClose = () => {},
  type = "add",
}) {
  const isEdit = type === "edit";

  // Initial Values dengan tambahan field rekening
  const initialValues = useMemo(() => {
    const rawJenisStr = normalizeJenisPegawai(data);
    const rawRoleStr = normalizeRole(data);

    return {
      ...data,
      nip: data.nip || data.nik || "",
      jenisPegawai: EMPLOYEE_TYPES.find((opt) => opt.value === rawJenisStr) || null,
      role: rawRoleStr, // Menyimpan string murni: 'user' | 'admin' | 'finance'
      isPejabat: parseIsPejabat(data),
      unit: data.unit || "",
      bank: data.bank || "",
      noRek: data.noRek || data.no_rek || "",
      namaRek: data.namaRek || data.nama_rek || "",
    };
  }, [data]);

  // Submit Handler
  const handleFormSubmit = (formValues) => {
    const cleanPayload = {
      ...formValues,
      jenisPegawai: extractValue(formValues.jenisPegawai),
      role: formValues.role || "user",
    };
    // idKantor dibersihkan dari payload
    delete cleanPayload.idKantor;
    
    onSubmit(cleanPayload);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      validate={validation}
      initialValues={initialValues}
      enableReinitialize
    >
      {({ handleSubmit, values, form, submitting }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#eadfbe] bg-white shadow-sm"
        >
          {!isEdit && (
            <div className="border-b border-[#eadfbe] bg-[#fbf7ec] px-4 py-5 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Data Master</p>
              <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">Form Pegawai</h2>
            </div>
          )}

          <div className={`grid gap-6 p-4 sm:p-6 ${isEdit ? "" : "lg:grid-cols-[280px_1fr]"}`}>
            {!isEdit && <FormProgress values={values} />}
            <div className="min-w-0 bg-white">
              <PegawaiFields
                values={values}
                form={form}
                isEdit={isEdit}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#eadfbe] bg-[#fbf7ec] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            {isEdit && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 sm:w-auto sm:min-w-44"
              >
                <FiX className="h-4 w-4" /> Tutup
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
            >
              <FiSave className="h-4 w-4" />
              {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Pegawai"}
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}

AddPegawaiForm.propTypes = {
  onSubmit: PropTypes.func,
  data: PropTypes.object,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(["add", "edit"]),
};