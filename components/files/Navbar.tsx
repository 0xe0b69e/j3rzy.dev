"use client";

import { cn } from "@/lib/utils";
import SignIn from "@/components/SignIn";
import FunnyAnimation from "@/components/FunnyAnimation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ExitIcon } from "@radix-ui/react-icons";

export default function Navbar (): JSX.Element
{
  const session = useSession();
  
  return (
    <nav className={cn(
      "w-full h-16 top-0 bg-surface dark:bg-surface-dark transition-all duration-300 shadow fixed z-40 items-center flex justify-between p-2",
    )}>
      <Link href={`/`}>
        <FunnyAnimation/>
      </Link>
      {session.data ? (
        <div className="h-full group inline-flex items-center justify-center">
          <Image
            src={session.data.user?.image ?? "https://via.placeholder.com/48x48.png?text=?"}
            width={48}
            height={48}
            alt={`${session.data.user?.name}'s avatar`}
            className="rounded-full"
            title={`${session.data.user?.name}`}
          />
          <button
            className="hidden group-hover:inline absolute bg-red-500/25 rounded-full p-2"
            title="Sign Out"
            onClick={() => signOut()}
          >
            <ExitIcon className="w-8 h-8" />
          </button>
        </div>
      ) : (
        <SignIn/>
      )}
    </nav>
  );
}