import React, { ClassAttributes, ReactElement } from "react";
import Link from "next/link";
import { cn, darkenHexColor, isBlack } from "@/lib/utils";

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
  const getMultiplier = (): number => isBlack(color) ? -0.75 : 1.5;
  
  /**
  Alternative to
  ```typescript
  if (link) {
    return (
      <Link ... >
        ...
      </Link>
    )
  } else {
    return (
      <div ... >
        ...
      </div>
    )
  }
  ```
   */
  const props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement | HTMLLinkElement>, HTMLDivElement | HTMLLinkElement> = {
    className: cn(
      "flex flex-row w-full items-center p-1 rounded-md space-x-2 text-white shadow-sm",
      !link && "cursor-default",
      link && "hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-2xl",
      className
    ),
    style: { backgroundImage: `linear-gradient(to bottom, ${color}, ${darkenHexColor(color, 0x28 * getMultiplier())})`, ...style },
    ...(link ? { target: "_blank", href: link } : {})
  }
  
  return React.createElement(link ? "a" : "div",
    props,
    (
      <>
        {React.cloneElement(logo, { className: "w-6 h-6" })}
        <p>{name}</p>
      </>
    )
  );
}