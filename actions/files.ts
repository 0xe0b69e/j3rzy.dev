"use server";

import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { Session } from "next-auth";
import * as fs from "node:fs";
import { db } from "@/lib/db";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";
import { File, User } from "@prisma/client";
import { FileData } from "@/lib/definitions";
import { FileDataSchema } from "@/schemas";

export default async function uploadFile (fileName: string, base64: string, isPrivate: boolean): Promise<boolean>
{
  const session: Session | null = await auth();
  const uuid: string = uuidv4();
  try
  {
    const buffer: Buffer = Buffer.from(base64, "base64");
    const type: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
    const mimeType: string = type ? type.mime : "application/octet-stream";
    
    fs.writeFileSync(`./files/${uuid}`, buffer);
    
    db.file.create({
      data: {
        name: fileName,
        fileName: uuid,
        size: fs.statSync(`./files/${uuid}`).size,
        mimeType,
        userId: session?.user?.id,
        isPrivate: session ? isPrivate : false
      }
    });
  } catch ( error )
  {
    console.error(error);
    return false;
  }
  
  return true;
}

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