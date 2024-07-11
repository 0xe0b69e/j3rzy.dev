import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { varelaRound } from "@/lib/font";
import { cn } from "@/lib/utils";

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
        width: 1200,
        height: 630,
        alt: "j3rzy.dev",
      },
    ],
  }
};

export default function RootLayout ({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en">
    <body className={cn(
      varelaRound.className
    )}>{children}</body>
    </html>
  );
}
