import { z } from "zod/v4";
import { idRegex } from "@/lib/utils";

export const idSchema = z.string().regex(idRegex);
export type Id = z.infer<typeof idSchema>;
