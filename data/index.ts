"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { File } from "@prisma/client";

export const getFileById = cache(async (id: string): Promise<File | null> =>
{
  const file = await db.file.findUnique({ where: { id } });
  return file;
});