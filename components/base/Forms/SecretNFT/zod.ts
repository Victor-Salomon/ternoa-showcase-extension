"use client";

import * as z from "zod";

export const formSchema = z.object({
    royalty: z.string().default("0"),
    collection: z.string().optional(),
    soulbond: z.boolean().default(false),
    metadataTitle: z.string(),
    metadataDescription: z.string(),
    secretMetadataTitle: z.string(),
    secretMetadataDescription: z.string(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
