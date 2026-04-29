import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schemas";

export const createDatabaseClient = (database: D1Database) =>
  drizzle(database, { casing: "snake_case", schema });

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
