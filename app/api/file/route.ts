import { NextRequest } from "next/server";
import { getFileById } from "@/data";
import { File } from "@prisma/client";
import path from "node:path";
import * as fs from "node:fs";
import { auth } from "@/auth";
import { Session } from "next-auth";

export async function GET (request: NextRequest)
{
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");
  if ( !id ) return Response.json({ status: 400, body: "Bad request" });
  
  const file: File | null = await getFileById(id);
  if ( !file ) return Response.json({ status: 404, body: "Not found" });
  
  if ( file.isPrivate )
  {
    const session: Session | null = await auth();
    if ( !session || file.userId !== session.user.id ) return Response.json({ status: 403, body: "Unauthorized" });
  }
  
  try
  {
    const buffer: Buffer = fs.readFileSync(path.join(process.cwd(), "files", file.fileName));
    
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

export async function POST (request: NextRequest)
{
  console.log(request.body);
}