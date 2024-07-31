import type { Metadata } from "next";
import "./globals.css";
import React from "react";

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
  }
};

export default function RootLayout ({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en">
    <body className="overflow-x-hidden">
    {children}
    </body>
    </html>
  );
}
