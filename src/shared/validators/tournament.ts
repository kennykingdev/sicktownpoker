import { TournamentStatus } from '@prisma/client';
import { z } from 'zod';
import { id } from './shared';

export const data = z.object({
  scheduledStart: z.date(),
  name: z.string().trim().min(1, { message: 'Tournament name is required' }),
  status: z.nativeEnum(TournamentStatus),
});

export type TournamentDataSchema = z.infer<typeof data>;

export const updateInput = z.object({
  id: id,
  data: data.partial(),
});

export const createInput = z.object({
  data: data,
});
