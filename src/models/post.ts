import { eq } from 'drizzle-orm';

import Database from '../db';
import { posts } from '../db/schema/posts';
import { users } from '../db/schema/users';
import { categories } from '../db/schema/categories';

export class Post {
  private id?: number;
  private userId: number;
  private username?: string;
  private title: string;
  private content: string;
  private categoryId: number;
  private categoryName?: string;
  private createdAt?: Date;
  private static db = Database.getDatabase();
  private static fields = {
    id: posts.id,
    userId: posts.userId,
    title: posts.title,
    content: posts.content,
    createdAt: posts.created_at,
    categoryId: posts.categoryId,
  };
  private static fieldsJoined = { ...Post.fields, username: users.username, categoryName: categories.name };

  constructor(
    userId: number,
    title: string,
    content: string,
    categoryId: number,
    id?: number,
    createdAt?: Date,
    username?: string,
    categoryName?: string,
  ) {
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.id = id;
    this.username = username;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.createdAt = createdAt;
  }

  getUserId() {
    return this.userId;
  }

  insert = async () => {
    const post = await Post.db
      .insert(posts)
      .values({ userId: this.userId, title: this.title, content: this.content, categoryId: this.categoryId })
      .returning(Post.fields);
    return new Post(post[0].userId, post[0].title, post[0].content, post[0].categoryId, post[0].id, post[0].createdAt);
  };

  static getPosts = async () => {
    const postsResult = await Post.db
      .select(Post.fieldsJoined)
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .innerJoin(categories, eq(categories.id, posts.categoryId));
    return postsResult;
  };

  static getPostById = async (id: number) => {
    const postsResult = await Post.db
      .select(Post.fieldsJoined)
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .innerJoin(categories, eq(categories.id, posts.categoryId))
      .where(eq(posts.id, id))
      .limit(1);
    if (postsResult.length > 0) {
      return new Post(
        postsResult[0].userId,
        postsResult[0].title,
        postsResult[0].content,
        postsResult[0].id,
        postsResult[0].categoryId,
        postsResult[0].createdAt,
        postsResult[0].username,
        postsResult[0].categoryName,
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
      const post = await Post.db
        .update(posts)
        .set({ title: this.title, content: this.content, categoryId: this.categoryId })
        .where(eq(posts.id, this.id))
        .returning(Post.fields);
      return new Post(
        post[0].userId,
        post[0].title,
        post[0].content,
        post[0].categoryId,
        post[0].id,
        post[0].createdAt,
      );
    } else {
      const error = new Error();
      error.message = 'Post id must be provided';
      error.name = 'validationError';
      throw error;
    }
  };

  delete = async () => {
    if (this.id) {
      const post = await Post.db.delete(posts).where(eq(posts.id, this.id)).returning(Post.fields);
      return new Post(
        post[0].userId,
        post[0].title,
        post[0].content,
        post[0].categoryId,
        post[0].id,
        post[0].createdAt,
      );
    } else {
      const error = new Error();
      error.message = 'Post id must be provided';
      error.name = 'validationError';
      throw error;
    }
  };
}
