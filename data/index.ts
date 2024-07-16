"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { File, User } from "@prisma/client";

export const getFileById = cache(async (id: string): Promise<File | null> =>
{
  const file = await db.file.findUnique({ where: { id } });
  return file;
});

export const getUserById = cache(async (id: string): Promise<User | null> =>
{
  const user = await db.user.findUnique({ where: { id } });
  return user;
});