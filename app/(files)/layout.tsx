"use server";

import React from "react";
import Navbar from "@/components/files/Navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function RootLayout ({ children }: Readonly<{ children: React.ReactNode; }>)
{
  const session: Session | null = await auth();
  
  return (
    <SessionProvider session={session}>
      <Navbar/>
      {children}
    </SessionProvider>
  );
}