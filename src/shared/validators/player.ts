import { z } from 'zod';
import { PHONE_REGEX } from '@/constants';
import { id } from './shared';

export const player = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1),
  lastName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .nullable()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(10)
    .regex(PHONE_REGEX, { message: 'Invalid phone number format' })
    .nullable()
    .or(z.literal('')),
  shareContactInfo: z.boolean().optional(),
  referredByPlayerId: id.nullable().or(z.literal('')),
});

export const playerUpdateInput = z.object({
  id: id,
  data: player,
});