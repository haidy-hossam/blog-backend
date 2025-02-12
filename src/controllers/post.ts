import type { Context } from 'hono';

import { Post } from '../models/post';
import ErrorHandler from '../errorHandler';

export const create = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { title, content, categoryId } = body;

    let post = new Post(c.get('user').id, title, content, categoryId);

    post = await post.insert();

    return c.json({ post }, 201);
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const read = async (c: Context) => {
  try {
    const posts = await Post.getPosts();

    return c.json({ posts });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const readById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const post = await Post.getPostById(Number(id));

    return c.json({ post });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const update = async (c: Context) => {
  try {
    const { id } = c.req.param();
    if (!id) {
      const error = new Error();
      error.message = 'Post id must be provided';
      error.name = 'validationError';
      throw error;
    }

    const body = await c.req.json();
    const { title, content, categoryId } = body;

    let post = await Post.getPostById(Number(id));

    if (post.getUserId() !== Number(c.get('user').id)) {
      const error = new Error();
      error.message = "You aren't authorized to perform this action.";
      error.name = 'AuthorizationError';
      throw error;
    }

    post = new Post(c.get('user').id, title, content, categoryId, Number(id));

    post = await post.update();

    return c.json({ post });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const deleteById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    let post = await Post.getPostById(Number(id));

    if (post.getUserId() !== Number(c.get('user').id)) {
      const error = new Error();
      error.message = "You aren't authorized to perform this action.";
      error.name = 'AuthorizationError';
      throw error;
    }

    post = await post.delete();

    return c.json({ ...post, message: 'successful' });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};
