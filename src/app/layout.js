import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";


// Load Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app
export const metadata = {
  title: "ATLAS - Aplikasi Tatakelola Administrasi Perjalanan Dinas",
  description: "Login and administration system for official travel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}