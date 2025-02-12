import { or, eq } from 'drizzle-orm';

import Database from '../db';
import { users } from '../db/schema/users';

export class User {
  private username: string;
  private email: string;
  private password: string;
  private id?: number | undefined;
  private static db = Database.getDatabase();
  private static fields = { id: users.id, username: users.username, email: users.email, password: users.password };

  constructor(username: string, email: string, password: string, id?: number) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  register = async () => {
    const userExists = await User.db
      .select(User.fields)
      .from(users)
      .where(
        or(
          eq(users.email, this.username),
          eq(users.email, this.email),
          eq(users.username, this.username),
          eq(users.username, this.email),
        ),
      )
      .limit(1);
    if (userExists.length > 0) {
      const error = new Error();
      error.message = 'Username or Email is already registered, please try again.';
      error.name = 'validationError';
      throw error;
    }
    await User.db.insert(users).values({ username: this.username, email: this.email, password: this.password });
  };

  static getUser = async (username: string) => {
    const usersResult = await User.db
      .select(User.fields)
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);
    if (usersResult.length > 0) {
      return usersResult[0];
    } else {
      const error = new Error();
      error.message = 'User not found, please try again.';
      error.name = 'NotFoundError';
      throw error;
    }
  };

  static getUserById = async (id: number) => {
    const usersResult = await User.db.select(User.fields).from(users).where(eq(users.id, id)).limit(1);
    if (usersResult.length > 0) {
      return usersResult[0];
    } else {
      const error = new Error();
      error.message = 'User not found, please try again.';
      error.name = 'NotFoundError';
      throw error;
    }
  };

  static updatePassword = async (username: string, password: string) => {
    const user = await User.getUser(username);
    if (user) {
      await User.db.update(users).set({ password }).where(eq(users.id, user.id)).returning(User.fields);
      return user;
    } else {
      const error = new Error();
      error.message = 'User not found, please try again.';
      error.name = 'NotFoundError';
      throw error;
    }
  };
}
