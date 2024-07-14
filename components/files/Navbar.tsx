"use client";

import { cn } from "@/lib/utils";
import SignIn from "@/components/SignIn";

export default function Navbar (): JSX.Element
{
  return (
    <nav className={cn(
      "w-full h-16 top-0 bg-surface dark:bg-surface-dark transition-all duration-300 shadow-lg fixed z-50 items-center flex justify-end p-2",
    )}>
      <SignIn />
    </nav>
  )
}