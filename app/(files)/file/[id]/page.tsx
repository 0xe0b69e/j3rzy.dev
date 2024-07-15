import Link from "next/link";
import { getFileById } from "@/data";
import Prisma from "@prisma/client";
import { cn } from "@/lib/utils";

interface PageProps
{
  params: {
    id: string;
  };
}

export default async function Page ({ params }: PageProps): Promise<JSX.Element>
{
  const file: Prisma.File | null = await getFileById(params.id);
  
  return (
    <main className={cn(
      "w-full h-full bg-background dark:bg-background-dark pt-16"
    )}>
      <h1>{file?.name}</h1>
      <Link href="/files">Go back</Link>
    </main>
  );
}