import { pgTable, timestamp, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users } from './users';
import { posts } from './posts';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  userId: integer('user_id').notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));
