"use client";

import { cn } from "@/lib/utils";
import SignIn from "@/components/SignIn";
import FunnyAnimation from "@/components/FunnyAnimation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar (): JSX.Element
{
  const pathname: string = usePathname();
  
  return (
    <nav className={cn(
      "w-full h-16 top-0 bg-surface dark:bg-surface-dark transition-all duration-300 shadow fixed z-50 items-center flex justify-between p-2",
    )}>
      <Link href={`/`}>
        <FunnyAnimation />
      </Link>
      <SignIn />
    </nav>
  )
}