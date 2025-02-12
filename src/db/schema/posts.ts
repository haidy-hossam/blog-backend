import { pgTable, timestamp, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users } from './users';
import { categories } from './categories';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  userId: integer('user_id').notNull(),
  categoryId: integer('category_id').notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));
