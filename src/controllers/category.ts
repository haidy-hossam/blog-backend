import type { Context } from 'hono';

import { Category } from '../models/category';
import ErrorHandler from '../errorHandler';

export const create = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name } = body;

    let category = new Category(c.get('user').id, name);

    category = await category.insert();

    return c.json({ category }, 201);
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const read = async (c: Context) => {
  try {
    const categories = await Category.getCategories();

    return c.json({ categories });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const readById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const category = await Category.getCategoryById(Number(id));

    return c.json({ category });
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
      error.message = 'Category id must be provided';
      error.name = 'validationError';
      throw error;
    }

    const body = await c.req.json();
    const { name } = body;

    let category = await Category.getCategoryById(Number(id));

    if (category.getUserId() !== Number(c.get('user').id)) {
      const error = new Error();
      error.message = "You aren't authorized to perform this action.";
      error.name = 'AuthorizationError';
      throw error;
    }

    category = new Category(c.get('user').id, name, Number(id));

    category = await category.update();

    return c.json({ category });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};

export const deleteById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    let category = await Category.getCategoryById(Number(id));

    if (category.getUserId() !== Number(c.get('user').id)) {
      const error = new Error();
      error.message = "You aren't authorized to perform this action.";
      error.name = 'AuthorizationError';
      throw error;
    }

    category = await category.delete();

    return c.json({ ...category, message: 'successful' });
  } catch (error) {
    const reformattedError = ErrorHandler(error as Error);
    c.status(reformattedError.statusCode);
    return c.json(reformattedError);
  }
};
