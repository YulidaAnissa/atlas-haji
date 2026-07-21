"use client";
import dynamic from "next/dynamic";

export const DatePickerRange = dynamic(() => import("./DatePickerRange"), { ssr: false });
export const DatePicker = dynamic(() => import("./DatePicker"), { ssr: false });
export const SelectSearchField = dynamic(() => import("./SelectField"), { ssr: true });
export const UploadFile = dynamic(() => import("./UploadFile"), { ssr: false });
export const TextArea = dynamic(() => import("./TextArea"), { ssr: false });
export const InputBase = dynamic(() => import("./InputBase"), { ssr: false });
export const MultiSelectTextField = dynamic(() => import("./MultiSelectTextField"), { ssr: false });
export const InputField = dynamic(() => import("./InputField"), { ssr: false });
export const SelectField = dynamic(() => import("./SelectField"), { ssr: false });
export const RadioField = dynamic(() => import("./RadioField"), { ssr: false });