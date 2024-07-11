import React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function Card ({
  children,
  className,
  ...props
}: CardProps): JSX.Element
{
  return (
    <div
      className={cn(
        "backdrop-filter bg-white/40 backdrop-blur-lg shadow-sm rounded-lg p-1 border-2 border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

