// @shared/index.ts
export * from "./prisma-types.js";
export * from "./constants.js";

import { z } from "zod";

export const filterStateSchema = z.object({
  page: z.coerce.number().default(1),
  genres: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  sort: z.enum(["az", "za", "rel_date", "rating"]).default("rating"),
  limit:z.number().default(15)
});

export type FilterState = z.infer<typeof filterStateSchema>;
