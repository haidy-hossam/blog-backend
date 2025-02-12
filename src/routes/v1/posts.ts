import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

import { create, read, readById, update, deleteById } from '../../controllers/post';
import Auth from '../../middleware/auth';
import * as postsValidator from '../../middleware/posts.validator';

const app = new Hono();

const factory = createFactory();

app.post('/', ...factory.createHandlers(Auth(factory), postsValidator.createSchema, create));

app.get('/', ...factory.createHandlers(Auth(factory), read));

app.get('/:id', ...factory.createHandlers(Auth(factory), readById));

app.patch('/', ...factory.createHandlers(Auth(factory), postsValidator.updateSchema, update));

app.delete('/:id', ...factory.createHandlers(Auth(factory), deleteById));

export default app;
