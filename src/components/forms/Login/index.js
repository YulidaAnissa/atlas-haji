"use client";

import React, { useState } from "react";
import InputField from "../FormField/InputField";
import validation from "./validate";
import { Form, Field } from "react-final-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";

export default function LoginPage({ onSubmit, helperText }) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Form onSubmit={onSubmit} validate={validation}>
      {({ handleSubmit, submitting }) => (
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <Field
            clearOnError
            component={InputField}
            helperText={helperText}
            label="Username"
            name="username"
            placeholder="Masukkan Username"
            type="text"
          />

          <Field
            clearOnError
            component={InputField}
            helperText={helperText}
            label="Password"
            name="password"
            placeholder="Masukkan Password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <button
                type="button"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                onClick={() => setShowPassword((value) => !value)}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-[#f7f0df] hover:text-[#c9a961] focus:outline-none focus:ring-2 focus:ring-[#c9a961]/30"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={21} />
                ) : (
                  <AiOutlineEye size={21} />
                )}
              </button>
            }
          />

          <button
            type="submit"
            disabled={submitting}
            className="group mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-[#c9a961]/25 transition hover:bg-[#b5964f] focus:outline-none focus:ring-4 focus:ring-[#c9a961]/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{submitting ? "Memproses..." : "Masuk"}</span>
            <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Gunakan akun resmi pegawai</span>
            <button
              type="button"
              className="font-semibold text-brand transition hover:text-[#a8873f]"
            >
              Butuh bantuan?
            </button>
          </div>
        </form>
      )}
    </Form>
  );
}