"use client";
import React from "react";
import InputField from "../FormField/InputField";
import validation from "./validate";
import { Form, Field } from "react-final-form";

export default function LoginPage({ onSubmit, helperText }) {
  return (
    <Form onSubmit={onSubmit} validate={validation}>
      {({ handleSubmit }) => (
        <form className="border border-gray-300 rounded-lg px-10 py-8 max-w-sm mx-auto" noValidate onSubmit={handleSubmit}>
          <Field
            clearOnError
            component={InputField}
            helperText={helperText}
            label="Nomor Induk Pegawai"
            name="username"
            placeholder="Masukkan Nomor Induk Pegawai..."
            type="text"
          />
          <Field
            clearOnError
            component={InputField}
            helperText={helperText}
            label="Password"
            name="password"
            placeholder="Masukkan Password..."
            type="password"
          />
          <button
            type="submit"
            className="mt-4 cursor-pointer w-full bg-black text-white py-2 rounded-md hover:bg-brand transition transform hover:scale-105 shadow-md"
          >
            Login
          </button>
          {/* <div className="mt-4">
            <a href="#" className="text-sm hover:underline">
            Forgot password?
            </a>
          </div> */}
        </form>
      )}
    </Form>
  );
}