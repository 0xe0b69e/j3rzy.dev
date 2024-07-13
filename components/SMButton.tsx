import React, { ReactElement } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SMButtonProps
{
  color: string;
  name: string;
  link?: string;
  className?: string;
  style?: React.CSSProperties;
  logo: ReactElement;
}

export default function SMButton ({ color, name, link, className, style, logo }: SMButtonProps): JSX.Element
{
  return (
    <Link
      href={link ?? ""}
      className={cn(
        "flex flex-row w-full items-center p-1 rounded-md space-x-2 text-white shadow-sm",
        !link && "cursor-default",
        link && "hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-2xl",
        className
      )}
      style={{ backgroundColor: color, ...style }}
      {...(link ? { target: "_blank" } : {})}
    >
      {React.cloneElement(logo, { className: "w-6 h-6" })}
      <p>{name}</p>
    </Link>
  )
}