import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

import { register, login, updatePassword, logout } from '../../controllers/user';
import Auth from '../../middleware/auth';
import * as usersValidator from '../../middleware/users.validator';

const app = new Hono();

const factory = createFactory();

app.post('/register', usersValidator.registerSchema, ...factory.createHandlers(register));

app.post('/login', usersValidator.loginSchema, ...factory.createHandlers(login));

app.post('/update-password', usersValidator.updatePasswordSchema, ...factory.createHandlers(updatePassword));

app.post('/logout', ...factory.createHandlers(Auth(factory), logout));

export default app;
