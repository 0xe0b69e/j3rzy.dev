"use server";

import { Metadata, ResolvingMetadata } from "next";
import { getFileById, getUserById } from "@/data";
import Prisma from "@prisma/client";
import { formatBytes, formatDate } from "@/lib/utils";
import Link from "next/link";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { FaArrowLeft } from "react-icons/fa6";

interface PageProps
{
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata (
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata>
{
  const file: Prisma.File | null = await getFileById(params.id);
  const uploader: Prisma.User | null = file ? await getUserById(file.id) : null;
  
  const previousImages = (await parent).openGraph?.images || [];
  
  return (!!file && !file.isPrivate)
    ? ({
      metadataBase: new URL("https://j3rzy.dev"),
      title: file.name,
      openGraph: {
        type: "website",
        title: file.name,
        description: `${formatBytes(file.size)}, uploaded by ${uploader?.name ?? "Anonymous"} on ${formatDate(file.createdAt)}`,
        images: file.mimeType.startsWith("image/") ? [ {
          url: `/api/file?id=${file.id}`,
          width: 1200,
          height: 630,
        } ] : previousImages
      },
    })
    : ({
      metadataBase: new URL("https://j3rzy.dev"),
      title: "File not found",
      openGraph: {
        type: "website",
        title: "File not found",
        description: "The file you're looking for doesn't exist.",
        images: previousImages,
      },
    });
}

export default async function Page ({ params, searchParams }: PageProps): Promise<JSX.Element>
{
  const session: Session | null = await auth();
  
  const file: Prisma.File | null = await getFileById(params.id);
  const uploader: Prisma.User | null = file ? await getUserById(file.id) : null;
  
  return (
    <>
      <Link href="/files" className="fixed top-16 left-0 p-2" title="Go back"><FaArrowLeft className="w-10 h-10" /></Link>
      <main className="pt-16 bg-background dark:bg-background-dark flex w-full h-full items-center justify-center">
        {(!!file && (!file.isPrivate || session?.user.id === file.userId))
          ? (
            <div
              className="p-8 bg-background-light dark:bg-background-dark rounded-lg shadow-lg flex flex-col items-center pb-4">
              <h1
                className="text-3xl font-mono bg-background dark:bg-background-dark shadow-inner border-4 border-background dark:border-background-dark py-2 px-6 text-wrap"
                style={{ boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.6)" }}
              >{file.name}</h1>
              <p className="text-wrap">Uploaded by {uploader?.name ?? "Anonymous"}</p>
              <p className="text-wrap">Size: {formatBytes(file.size)}</p>
              <p className="mb-3 text-wrap">Uploaded at: {formatDate(file.createdAt)}</p>
              <Link
                href={`/api/file?id=${file.id}`}
                target="_blank"
                className="py-1 px-8 bg-gradient-to-b from-secondary to-primary hover:from-secondary-dark hover:to-primary-dark rounded-lg text-center text-white"
              >
                Download
              </Link>
            </div>
          )
          : (
            <div
              className="p-8 bg-background-light dark:bg-background-dark rounded-lg shadow-lg flex items-center justify-center text-center flex-col">
              <h1 className="text-3xl font-bold text-wrap">File not found</h1>
              <p className="text-wrap">The file you&#39;re looking for doesn&#39;t exist.</p>
            </div>
          )
        }
      </main>
    </>
  );
}