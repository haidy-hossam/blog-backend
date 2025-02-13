import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

import categories from './src/routes/v1/categories';
import users from './src/routes/v1/users';
import posts from './src/routes/v1/posts';

dotenv.config({
  path: '.env',
});

const app = new Hono();

app.use('/api/*', cors());

app.use(logger());

app.route('/api/v1/users', users);

app.route('/api/v1/categories', categories);

app.route('/api/v1/posts', posts);

export default app;
