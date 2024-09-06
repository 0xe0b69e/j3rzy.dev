"use client";

import { cn } from "@/lib/utils";
import { NerkoOne } from "@/lib/fonts";

export default function Home(): JSX.Element {
  return (
    <main className="w-full h-full bg-[#3a1911] flex sm:p-20 flex-col items-center">
      <h1
        className={cn("uppercase text-[100px] text-[#a97e4f] m-0", NerkoOne.className)}
        style={{ textShadow: "-7px 7px 2px #000" }}
      >Feed the woods</h1>
      <p
        className="font-serif text-[30px] font-semibold"
        style={{ textShadow: "-2px 2px 1px #000" }}
      >Go into the woods.</p>
    </main>
  );
}
