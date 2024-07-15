import Link from "next/link";
import { getFileById } from "@/data";
import Prisma from "@prisma/client";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

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
      "w-full h-full bg-background dark:bg-background-dark pt-16 flex items-center justify-center bg-gradient-to-tr",
      file
        ? "via-30% from-sky-600 via-indigo-500 to-violet-800 dark:from-sky-800 dark:via-indigo-600 dark:to-violet-950"
        : "from-red-400 to-red-700 dark:from-red-600 dark:to-red-900"
    )}>
      <Card className="p-4">
        {
          file
            ? (<></>)
            : (<h1 className="text-3xl">Requested file does not exist</h1>)
        }
      </Card>
    </main>
  );
}