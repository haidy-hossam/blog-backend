import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const registerSchema = zValidator(
  'json',
  z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(7),
  }),
);

export const loginSchema = zValidator(
  'json',
  z.object({
    username: z.string(),
    password: z.string(),
  }),
);

export const updatePasswordSchema = zValidator(
  'json',
  z.object({
    username: z.string(),
    password: z.string().min(7),
  }),
);
