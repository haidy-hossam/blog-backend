import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const createSchema = zValidator(
  'json',
  z
    .object({
      title: z.string(),
      content: z.string(),
      categoryId: z.number(),
    })
    .strict(),
);

export const updateSchema = zValidator(
  'json',
  z
    .object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      categoryId: z.number().optional(),
    })
    .strict(),
);
