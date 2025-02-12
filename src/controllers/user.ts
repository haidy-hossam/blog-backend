import type { Context } from 'hono';
import { sign } from 'hono/jwt';

import { User } from '../models/user';
import RedisClient from '../services/redis';
import ErrorHandler from '../errorHandler';

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, email, password } = body;

    const passwordHashed = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
    });

    const user = new User(username, email, passwordHashed);

    await user.register();

    return c.json({ user }, 201);
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    const user = await User.getUser(username);

    if (user) {
      const isPasswordMatch = await Bun.password.verify(password, user.password);

      if (isPasswordMatch) {
        const token = await sign({ id: user?.id, username: user?.username }, process.env.JWT_SECRET!);

        await RedisClient.set(user.id.toString(), token);

        return c.json({ user, token });
      } else {
        const error = new Error();
        error.message = 'Wrong Password, please try again.';
        error.name = 'validationError';
        throw error;
      }
    } else {
      const error = new Error();
      error.message = 'User not found, please try again.';
      error.name = 'NotFoundError';
      throw error;
    }
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const updatePassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    const passwordHashed = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
    });

    const user = await User.updatePassword(username, passwordHashed);

    if (user) return c.json({ user });
    else return c.status(404);
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const logout = async (c: Context) => {
  try {
    await RedisClient.del(String(c.get('user').id));

    c.set('user', undefined);

    return c.json({ message: 'successful' }, 200);
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};
