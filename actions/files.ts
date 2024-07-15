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
import path from "node:path";

export default async function uploadFile (fileName: string, base64: string, isPrivate: boolean): Promise<boolean>
{
  const session: Session | null = await auth();
  const uuid: string = uuidv4();
  try
  {
    const buffer: Buffer = Buffer.from(base64, "base64");
    const type: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
    const mimeType: string = type ? type.mime : "application/octet-stream";
    const filePath: string = path.join(process.cwd(), "files", uuid)
    
    fs.writeFileSync(filePath, buffer);
    
    db.file.create({
      data: {
        name: fileName,
        fileName: uuid,
        size: fs.statSync(filePath).size,
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

export interface DeleteFilesResponse
{
  success: boolean;
  failed: {
    name: string;
    reason: string;
  }[];
}

export async function deleteFiles (fileIds: string[]): Promise<DeleteFilesResponse>
{
  const failed: {
    name: string;
    reason: string;
  }[] = [];
  const session: Session | null = await auth();
  try
  {
    const files: File[] = await db.file.findMany({
      where: {
        id: {
          in: fileIds
        }
      }
    });
    for ( const file of files )
    {
      if ( file.userId !== session?.user?.id && session?.user?.role !== "ADMIN" ) failed.push({
        name: file.name,
        reason: "Not sufficient permissions"
      });
      fs.unlinkSync(`./files/${file.fileName}`);
      await db.file.delete({
        where: {
          id: file.id
        }
      });
    }
  } catch ( error )
  {
    console.error(error);
    return {
      success: false,
      failed
    };
  }
  
  return { success: true, failed };
}