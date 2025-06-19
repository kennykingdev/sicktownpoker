import { z } from "zod/v4";
import { idSchema } from "./common";

export const playerSchema = z.object({
  id: idSchema,
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.email().nullish(),
  phone: z
    .string()
    .trim()
    .length(10)
    // start with a 10 character string, make sure it's only numbers
    .regex(/^[0-9]+$/)
    .nullish(),
});
export type Player = z.infer<typeof playerSchema>;

export const createPlayerSchema = playerSchema.omit({ id: true });
export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;

// Make sure all the normal required fields are optional here.
// Only 'id' is required so we know who to update
export const editPlayerSchema = playerSchema.partial({
  firstName: true,
  lastName: true,
});
export type EditPlayerInput = z.infer<typeof editPlayerSchema>;
