import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

const app = new Hono();

app.use(logger());

export default app;
