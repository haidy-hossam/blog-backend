import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

class Database {
  static connection: NodePgDatabase | null = null;

  static getDatabase = () => {
    if (Database.connection === null) Database.connection = drizzle(process.env.DATABASE_URL!);
    return Database.connection;
  };
}

export default Database;
