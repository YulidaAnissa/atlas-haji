"use client";
import dynamic from "next/dynamic";

export const Breadcrumb = dynamic(() => import("./Breadcrumb"), { ssr: false });
export const DataTables = dynamic(() => import("./DataTables"), { ssr: false });
export const FormModal = dynamic(() => import("./FormModal"), { ssr: false });
export const InfoModal = dynamic(() => import("./InfoModal"), { ssr: false });
export const List = dynamic(() => import("./List"), { ssr: false });
export const LoadingOverlay = dynamic(() => import("./LoadingOverlay"), { ssr: false });
export const Tooltip = dynamic(() => import("./Tooltip"), { ssr: false });
export const TooltipInfo = dynamic(() => import("./TooltipInfo"), { ssr: false });
export const PrintButton = dynamic(() => import("./PrintButton"), { ssr: false });
export const DaftarNominatif = dynamic(() => import("./DaftarNominatif"), { ssr: false });
export const Snackbar = dynamic(() => import("./Snackbar"), { ssr: false });
export const StatCard = dynamic(() => import("./StatCard"), { ssr: false });
export const MonthlySchedule = dynamic(() => import("./MonthlySchedule"), { ssr: false });
