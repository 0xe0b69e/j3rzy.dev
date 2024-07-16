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
import { generateFileSha256Hash } from "@/lib/utils";

const filePath: string = path.join(process.cwd(), "files");

export async function GET (request: NextRequest): Promise<Response>
{
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");
  if ( !id ) return Response.json({ status: 400, message: "Bad request" });
  
  const ids: string[] = id.split(",");
  let promises: (Prisma.File | null)[] = await Promise.all(ids.map(getFileById));
  const files: Prisma.File[] = promises.filter(Boolean) as Prisma.File[];
  if ( files.length !== ids.length ) return Response.json({ status: 404, message: "Not found" });
  
  const session: Session | null = await auth();
  if ( files.some(f => f.isPrivate && (f.userId !== session?.user.id && session?.user?.role !== "ADMIN")) )
    return Response.json({ status: 404, message: "Not found" });
  
  try
  {
    const buffers: Buffer[] = await Promise.all(files.map(f => fs.readFile(path.join(filePath, f.fileName))));
    if ( buffers.length !== files.length ) return Response.json({ status: 500, message: "Internal server error" });
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
    return Response.json({ status: 500, message: "Internal server error" });
  }
}

export async function POST (request: NextRequest): Promise<Response>
{
  const formData: FormData = await request.formData();
  const files: File[] | null = formData.getAll("file") as File[];
  const isPrivate: FormDataEntryValue | null = formData.get("private");
  if ( !files || !files.length || !files.every(file => file instanceof File) )
    return Response.json({ status: 400, message: "Bad request" });
  
  const session: Session | null = await auth();
  const data = await Promise.all(files.map(async (file) => ({
    name: file.name,
    fileName: v4(),
    size: file.size,
    mimeType: file.type,
    userId: session?.user?.id,
    isPrivate: session ? isPrivate === "true" : false,
    buffer: Buffer.from(await file.arrayBuffer()),
    sha256: await generateFileSha256Hash(Buffer.from(await file.arrayBuffer()))
  })));
  const existingFiles: Prisma.File[] = await db.file.findMany();
  const uniqueData = data.filter(({ sha256 }) => !existingFiles.some(f => f.sha256 === sha256));
  existingFiles.forEach(f => {
    const index = data.findIndex(({ sha256 }) => sha256 === f.sha256);
    if ( index !== -1 ) data[index].fileName = f.fileName;
  });
  
  try
  {
    await Promise.all(uniqueData.map(async ({ fileName, buffer }) => fs.writeFile(path.join(filePath, fileName), buffer)));
    await db.file.createMany({
      data: data.map(({ buffer, ...rest }) => rest)
    });
    const files: Prisma.File[] = await db.file.findMany({
      where: { fileName: { in: data.map(({ fileName }) => fileName) } }
    });
    return Response.json({
      status: 200, message: "OK",
      files: files.map(({ fileName, updatedAt, ...file }) => ({
        ...file,
        username: session?.user?.name ?? "Anonymous",
        canEdit: file.userId === session?.user?.id || session?.user?.role === "ADMIN"
      }))
    });
  } catch ( error: any )
  {
    console.error(error);
    return Response.json({ status: 500, message: "Internal server error" });
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");
  if (!id) return Response.json({ status: 400, message: "Bad request" });
  
  const ids: string[] = id.split(",");
  let promises: (Prisma.File | null)[] = await Promise.all(ids.map(getFileById));
  const files: Prisma.File[] = promises.filter(Boolean) as Prisma.File[];
  if (files.length !== ids.length) return Response.json({ status: 404, message: "Not found" });
  
  const session: Session | null = await auth();
  if (files.some(f => (f.userId !== session?.user?.id && session?.user?.role !== "ADMIN")))
    return Response.json({ status: 404, message: "Not found" });
  
  try {
    const fileUsageCounts = await Promise.all(files.map(file =>
      db.file.count({ where: { sha256: file.sha256, id: { notIn: ids } } })
    ));
    const filesToDelete = files.filter((file, index) => fileUsageCounts[index] === 0);
    
    await db.file.deleteMany({ where: { id: { in: files.map(f => f.id) } } });
    await Promise.all(filesToDelete.map(f => fs.unlink(path.join(filePath, f.fileName))));
    
    return Response.json({ status: 200, message: "OK" });
  } catch (error: any) {
    console.error(error);
    return Response.json({ status: 500, message: "Internal server error" });
  }
}
