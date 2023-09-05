"use client";

import * as z from "zod";

export const formSchema = z.object({
  offchainData: z.string().max(150, { message: "Offchain data length must be less than 150 characters" }).optional(),
  royalty: z.string().default("0"),
  collection: z.string().optional(),
  soulbond: z.boolean().default(false).optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
