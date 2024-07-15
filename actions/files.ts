"use server";

import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { Session } from "next-auth";
import { db } from "@/lib/db";
import { File, User } from "@prisma/client";
import { FileData } from "@/lib/definitions";
import { FileDataSchema } from "@/schemas";

export async function getFiles (): Promise<FileData[]>
{
  const session: Session | null = await auth();
  const files: (File & { user: User | null })[] = await db.file.findMany({
    where: {
      OR: [
        {
          isPrivate: false
        },
        {
          userId: session?.user?.id
        }
      ]
    },
    include: { user: true }
  });
  return files.map(file => FileDataSchema.parse({
    ...file,
    username: file.user?.name ?? "Anonymous",
    canEdit: file.userId === session?.user?.id || session?.user?.role === "ADMIN"
  }));
}

export interface DeleteFilesResponse
{
  success: boolean;
  failed: {
    name: string;
    reason: string;
  }[];
}
