"use client";

import { cn } from "@/lib/utils";

export default function NotFound(): JSX.Element
{
  return (
    <main className="w-full h-full flex items-center justify-center bg-background dark:bg-background-dark flex-col text-center">
      <h1 className="text-5xl font-mono">404</h1>
      <h2>You seem to reach the end of the website</h2>
      
      <button
        className={cn(
          "shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969]",
          "rounded-md font-light transition duration-200 ease-linear"
        )}
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </main>
  )
}