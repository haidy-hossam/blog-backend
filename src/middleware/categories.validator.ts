import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const createSchema = zValidator(
  'json',
  z
    .object({
      name: z.string(),
    })
    .strict(),
);

export const updateSchema = zValidator(
  'json',
  z
    .object({
      name: z.string().optional(),
    })
    .strict(),
);
