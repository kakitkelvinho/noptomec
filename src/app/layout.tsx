import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/navbar";
import "@/styles/global.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noptomec App",
  description: "A website on optomechanics, built on Next.js     ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const routes = [
    { name: "Home", link: "/" },
    { name: "Data Viewer", link: "/tools/dataviewer" },
    { name: "Spectrum Viewer", link: "/tools/spectrumviewer" }
  ]
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 dark:text-white`}
      >
        <div className='flex'>
          <NavBar routes={routes} />
          <div className="w-full ml-40 px-2">{children}</div>
        </div>
      </body>
    </html>
  );
}
