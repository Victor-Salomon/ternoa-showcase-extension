"use client"

import * as z from "zod"

export const formSchema = z.object({
  offchainData: z.string().max(150),
  royalty: z.string().default("0"),
  collection: z.string().optional(),
  soulbond:z.boolean().default(false).optional(),
})

export type FormSchemaType = z.infer<typeof formSchema>
