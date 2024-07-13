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
      target="_blank"
      href={link ?? ""}
      className={cn(
        "flex sm:flex-row flex-col sm:w-full max-sm:h-full sm:items-center sm:p-1 p-4 rounded-md sm:space-x-2 max-sm:space-y-3 text-white shadow-sm",
        !link && "cursor-default",
        link && "hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-2xl",
        className
      )}
      style={{ backgroundColor: color, ...style }}
    >
      {React.cloneElement(logo, { className: "w-6 h-6" })}
      <p className="max-sm:vertical-lr">{name}</p>
    </Link>
  )
}