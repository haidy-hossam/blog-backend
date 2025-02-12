import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { categories } from './categories';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
});

export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
}));
