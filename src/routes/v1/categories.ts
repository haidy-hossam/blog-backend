import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

import { create, read, readById, update, deleteById } from '../../controllers/category';
import Auth from '../../middleware/auth';
import * as categoriesValidator from '../../middleware/categories.validator';

const app = new Hono();

const factory = createFactory();

app.post('/', ...factory.createHandlers(Auth(factory), categoriesValidator.createSchema, create));

app.get('/', ...factory.createHandlers(Auth(factory), read));

app.get('/:id', ...factory.createHandlers(Auth(factory), readById));

app.patch('/:id', ...factory.createHandlers(Auth(factory), categoriesValidator.updateSchema, update));

app.delete('/:id', ...factory.createHandlers(Auth(factory), deleteById));

export default app;
