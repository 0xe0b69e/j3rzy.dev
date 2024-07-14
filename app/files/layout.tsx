import React from "react";
import Navbar from "@/components/files/Navbar";

export default function RootLayout ({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}