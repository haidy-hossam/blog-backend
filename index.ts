import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

import users from './src/routes/v1/users';

dotenv.config({
  path: '.env',
});

const app = new Hono();

app.use(logger());

app.route('/api/v1/users', users);

export default app;
