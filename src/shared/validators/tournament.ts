import { TournamentStatus } from '@prisma/client';
import { z } from 'zod';
import { id } from './shared';

export const tournament = z.object({
  scheduledStart: z
    .string()
    .trim()
    .transform((string) => new Date(string)),
  name: z.string().trim().min(1),
  status: z.nativeEnum(TournamentStatus).optional(),
});

export const tournamentUpdateInput = z.object({
  id: id,
  data: tournament,
});
