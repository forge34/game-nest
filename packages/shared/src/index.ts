// @shared/index.ts
export * from "./prisma-types";
export * from "./constants";

import { z } from "zod";

export const filterStateSchema = z.object({
  page: z.coerce.number().default(1),
  genres: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  sort: z.enum(["az", "za", "rel_date", "rating"]).default("rating"),
});

export type FilterState = z.infer<typeof filterStateSchema>;
