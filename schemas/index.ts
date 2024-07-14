import { z } from "zod";

export const FileDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  size: z.number(),
  isPrivate: z.boolean(),
  userId: z.string().optional().nullable(),
  createdAt: z.date(),
  canEdit: z.boolean()
});