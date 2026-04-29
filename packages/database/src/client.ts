import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schemas";

export type DatabaseConnection = Database.Database;
export type DatabaseClient = BetterSQLite3Database<typeof schema>;

export const openDatabaseConnection = (databasePath: string): DatabaseConnection =>
  new Database(databasePath);

export const createDatabaseClient = (database: DatabaseConnection): DatabaseClient =>
  drizzle(database, { casing: "snake_case", schema });

export const applyDatabaseMigrations = (
  database: DatabaseClient,
  migrationsFolder: string,
): void => {
  migrate(database, { migrationsFolder });
};
