import type { Metadata } from "next";
import { Geist, Geist_Mono, Poiret_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { NotesProvider } from "@/contexts/NotesContext";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poiretOne = Poiret_One({
  weight: "400",
  variable: "--font-poiret-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorldsxMap Project",
  description:
    "Explore countries, add notes about your experiences, and keep track of the people you meet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <CountryProvider>
          <NotesProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} ${poiretOne.variable} antialiased bg-gray-200`}
            >
              {children}
            </body>
          </NotesProvider>
        </CountryProvider>
      </AuthProvider>
    </html>
  );
}
