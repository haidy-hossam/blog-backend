import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

import categories from './src/routes/v1/categories';
import users from './src/routes/v1/users';

dotenv.config({
  path: '.env',
});

const app = new Hono();

app.use(logger());

app.route('/api/v1/users', users);

app.route('/api/v1/categories', categories);

export default app;
