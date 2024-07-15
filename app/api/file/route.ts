import { NextRequest } from "next/server";
import { getFileById } from "@/data";
import Prisma from "@prisma/client";
import path from "node:path";
import { promises as fs } from "node:fs";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { v4 } from "uuid";
import { db } from "@/lib/db";
import JSZip from "jszip";

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
  
  const ids: string[] = id.split(",");
  let promises: (Prisma.File | null)[] = await Promise.all(ids.map(getFileById));
  const files: Prisma.File[] = promises.filter(Boolean) as Prisma.File[];
  
  if ( files.length !== ids.length ) return Response.json({ status: 404, body: "Not found" });
  if ( files.some(f => !f.isPrivate) ) return Response.json({ status: 403, body: "Unauthorized" });
  
  try
  {
    const buffers: Buffer[] = await Promise.all(files.map(f => fs.readFile(path.join(process.cwd(), "files", f.fileName))));
    if ( buffers.length !== files.length ) return Response.json({ status: 500, body: "Internal server error" });
    if ( buffers.length === 1 ) return new Response(buffers[0], {
      headers: {
        "Content-Type": files[0].mimeType,
        "Content-Disposition": `attachment; filename="${files[0].name}"`
      }
    });
    
    const zip: JSZip = new JSZip();
    files.forEach((file, index) => zip.file(file.name, buffers[index]));
    const blob: Blob = await zip.generateAsync({ type: "blob" });
    return new Response(blob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="files.zip"`
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
  
  try
  {
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

export async function DELETE (request: NextRequest): Promise<Response>
{
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");
  if ( !id ) return Response.json({ status: 400, body: "Bad request" });
  
  const file: Prisma.File | null = await getFileById(id);
  if ( !file ) return Response.json({ status: 404, body: "Not found" });
  
  const session: Session | null = await auth();
  if ( file.userId !== session?.user.id && session?.user.role !== "ADMIN" ) return Response.json({ status: 403, body: "Unauthorized" });
  
  try
  {
    await fs.unlink(path.join(process.cwd(), "files", file.fileName));
    await db.file.delete({ where: { id: file.id } });
  } catch ( error: any )
  {
    console.error(error);
    return Response.json({ status: 500, body: "Internal server error" });
  }
  
  return Response.json({ status: 200, body: "OK" });
}