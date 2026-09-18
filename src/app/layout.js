import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/elements/Provider";
import { accessTokenStorage } from "@/utils/storage";

// Load Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ATLAS",
  description: "Aplikasi Tata Kelola Administrasi Perjalanan Dinas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}