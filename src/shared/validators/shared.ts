import { z } from 'zod';

export const id = z.string().trim().cuid();
export const findByIdInput = z.object({ id });
