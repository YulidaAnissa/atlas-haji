"use client";
import React, { useState } from "react";
import InputField from "../FormField/InputField";
import validation from "./validate";
import { Form, Field } from "react-final-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage({ onSubmit, helperText }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form onSubmit={onSubmit} validate={validation}>
      {({ handleSubmit }) => (
        <form
          className="border border-gray-300 rounded-lg px-10 py-8 max-w-sm mx-auto"
          noValidate
          onSubmit={handleSubmit}
        >
          <Field
            clearOnError
            component={InputField}
            helperText={helperText}
            label="Nomor Induk Pegawai"
            name="username"
            placeholder="Masukkan Nomor Induk Pegawai..."
            type="text"
          />

          {/* <div className="relative"> */}
            <Field
              clearOnError
              component={InputField}
              helperText={helperText}
              label="Password"
              name="password"
              placeholder="Masukkan Password..."
              type={showPassword ? "text" : "password"}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              }
            />
          {/* </div> */}

          <button
            type="submit"
            className="mt-4 cursor-pointer w-full bg-black text-white py-2 rounded-md hover:bg-brand transition transform hover:scale-105 shadow-md"
          >
            Login
          </button>
        </form>
      )}
    </Form>
  );
}
