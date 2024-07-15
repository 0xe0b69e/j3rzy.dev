import { NextRequest } from "next/server";
import { getFileById } from "@/data";
import Prisma from "@prisma/client";
import path from "node:path";
import { promises as fs } from "node:fs";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { v4 } from "uuid";
import { db } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false
  }
};

export async function GET (request: NextRequest): Promise<Response>
{
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");
  if ( !id ) return Response.json({ status: 400, body: "Bad request" });
  
  const file: Prisma.File | null = await getFileById(id);
  if ( !file ) return Response.json({ status: 404, body: "Not found" });
  
  if ( file.isPrivate )
  {
    const session: Session | null = await auth();
    if ( !session || file.userId !== session.user.id ) return Response.json({ status: 403, body: "Unauthorized" });
  }
  
  try
  {
    const buffer: Buffer = await fs.readFile(path.join(process.cwd(), "files", file.fileName));
    
    return new Response(buffer, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${file.name}"`
      }
    });
  } catch ( error: any )
  {
    console.error(error);
    return Response.json({ status: 500, body: "Internal server error" });
  }
}

export async function POST (request: NextRequest): Promise<Response>
{
  const formData: FormData = await request.formData();
  const file: FormDataEntryValue | null = formData.get("file");
  const isPrivate: FormDataEntryValue | null = formData.get("private");
  if ( !file || !(file instanceof File) ) return Response.json({ status: 400, body: "Bad request" });
  
  const name: string = (file as File).name;
  const uuid: string = v4();
  const mimeType: string = (file as File).type;
  const size: number = (file as File).size;
  const blob: Blob = file as Blob;
  const buffer: Buffer = Buffer.from(await blob.arrayBuffer());
  
  try {
    await fs.writeFile(path.join(process.cwd(), "files", uuid), buffer);
    const session: Session | null = await auth();
    await db.file.create({
      data: {
        name,
        fileName: uuid,
        size,
        mimeType,
        userId: session?.user?.id,
        isPrivate: session ? isPrivate === "true" : false
      }
    });
  } catch ( error: any )
  {
    console.error(error);
    return Response.json({ status: 500, body: "Internal server error" });
  }
  
  return Response.json({ status: 200, body: "OK" });
}