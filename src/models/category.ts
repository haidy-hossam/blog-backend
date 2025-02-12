import { eq } from 'drizzle-orm';

import Database from '../db';
import { categories } from '../db/schema/categories';
import { users } from '../db/schema/users';

export class Category {
  private id?: number;
  private userId: number;
  private username?: string;
  private name: string;
  private createdAt?: Date;
  private static db = Database.getDatabase();
  private static fields = {
    id: categories.id,
    userId: categories.userId,
    name: categories.name,
    createdAt: categories.created_at,
  };
  private static fieldsJoined = { ...Category.fields, username: users.username };

  constructor(userId: number, name: string, id?: number, createdAt?: Date, username?: string) {
    this.userId = userId;
    this.name = name;
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
  }

  getUserId() {
    return this.userId;
  }

  insert = async () => {
    const category = await Category.db
      .insert(categories)
      .values({ userId: this.userId, name: this.name })
      .returning(Category.fields);
    return new Category(category[0].userId, category[0].name, category[0].id, category[0].createdAt);
  };

  static getCategories = async () => {
    const postsResult = await Category.db
      .select(Category.fieldsJoined)
      .from(categories)
      .innerJoin(users, eq(users.id, categories.userId));
    return postsResult;
  };

  static getCategoryById = async (id: number) => {
    const categoriesResult = await Category.db
      .select(Category.fieldsJoined)
      .from(categories)
      .innerJoin(users, eq(users.id, categories.userId))
      .where(eq(categories.id, id))
      .limit(1);
    if (categoriesResult.length > 0) {
      return new Category(
        categoriesResult[0].userId,
        categoriesResult[0].name,
        categoriesResult[0].id,
        categoriesResult[0].createdAt,
        categoriesResult[0].username,
      );
    } else {
      const error = new Error();
      error.message = 'Post not found, please try again.';
      error.name = 'NotFoundError';
      throw error;
    }
  };

  update = async () => {
    if (this.id) {
      const category = await Category.db
        .update(categories)
        .set({ name: this.name })
        .where(eq(categories.id, this.id))
        .returning(Category.fields);
      return new Category(category[0].userId, category[0].name, category[0].id, category[0].createdAt);
    } else {
      const error = new Error();
      error.message = 'Post id must be provided';
      error.name = 'validationError';
      throw error;
    }
  };

  delete = async () => {
    if (this.id) {
      const category = await Category.db
        .delete(categories)
        .where(eq(categories.id, this.id))
        .returning(Category.fields);
      return new Category(category[0].userId, category[0].name, category[0].id, category[0].createdAt);
    } else {
      const error = new Error();
      error.message = 'Post id must be provided';
      error.name = 'validationError';
      throw error;
    }
  };
}
