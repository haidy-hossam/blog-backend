import { Factory } from 'hono/factory';
import { verify } from 'hono/jwt';

import RedisClient from '../services/redis';
import ErrorHandler from '../errorHandler';
import { User } from '../models/user';

export default (factory: Factory) => {
  const middleware = factory.createMiddleware(async (c, next) => {
    try {
      const error = new Error();
      error.message = "You aren't authorized to perform this action.";
      error.name = 'AuthorizationError';

      let authToken = c.req.header('Authorization');
      if (!authToken) throw error;

      authToken = authToken.replace('Bearer ', '');

      const decoded = await verify(authToken, process.env.JWT_SECRET!);
      const userAuthenticated = await RedisClient.get(String(decoded.id));
      if (userAuthenticated) {
        const user = await User.getUserById(Number(decoded.id));
        if (user) {
          //@ts-expect-error set user in the context
          c.set('user', user);
          return await next();
        } else throw error;
      } else throw error;
    } catch (error) {
      const reformattedError = ErrorHandler(error as Error);
      c.status(reformattedError.statusCode);
      return c.json(reformattedError);
    }
  });
  return middleware;
};
