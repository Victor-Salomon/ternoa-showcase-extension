"use client";

import * as z from "zod";

export const formSchema = z.object({
  royalty: z.string().default("0"),
  collection: z.string().optional(),
  soulbond: z.boolean().default(false).optional(),
  metadataTitle: z.string().optional(),
  metadataDescription: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
