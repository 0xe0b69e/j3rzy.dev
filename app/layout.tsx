import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { varelaRound } from "@/lib/font";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "j3rzy.dev",
  description: "Jerzy (0xe0b69e)'s scuffed personal website",
  openGraph: {
    type: "website",
    url: "https://j3rzy.dev",
    title: "j3rzy.dev",
    description: "Jerzy (0xe0b69e)'s scuffed personal website",
    countryName: "United States",
    locale: "en_US",
    siteName: "j3rzy.dev",
    images: [
      {
        url: "https://j3rzy.dev/og-image.png",
        width: 900,
        height: 900,
        alt: "Great art by @sweirde on Twitter!",
      },
    ],
  }
};

export default function RootLayout ({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en">
    <body className={varelaRound.className}>
    {children}
    <Footer />
    </body>
    </html>
  );
}
