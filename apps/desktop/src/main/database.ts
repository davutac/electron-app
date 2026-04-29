import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  applyDatabaseMigrations,
  createDatabaseClient,
  openDatabaseConnection,
} from "@repo/database/client";
import type { DatabaseClient, DatabaseConnection } from "@repo/database/client";
import { app } from "electron";
import { Result, TaggedError } from "better-result";
import type { Result as ResultType } from "better-result";

let databaseConnection: DatabaseConnection | null = null;
let databaseClient: DatabaseClient | null = null;

type DatabaseErrorReason = "create-directory" | "migrate" | "not-ready" | "open";

const formatErrorCause = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

export class DatabaseError extends TaggedError("DatabaseError")<{
  causeMessage?: string;
  message: string;
  reason: DatabaseErrorReason;
}>() {
  constructor(args: { cause?: unknown; reason: DatabaseErrorReason }) {
    if (args.reason === "not-ready") {
      super({ message: "Database is not ready", reason: args.reason });
      return;
    }

    const causeMessage = formatErrorCause(args.cause);
    super({
      causeMessage,
      message: `Database startup failed during ${args.reason}: ${causeMessage}`,
      reason: args.reason,
    });
  }
}

type DatabaseStartupResult = ResultType<void, DatabaseError>;

const getDatabasePath = (): string => join(app.getPath("userData"), "database", "app.sqlite");

const getMigrationsFolder = (): string => {
  if (app.isPackaged) {
    return join(process.resourcesPath, "database", "drizzle");
  }

  return join(app.getAppPath(), "..", "..", "packages", "database", "drizzle");
};

const closeCurrentConnection = (): void => {
  databaseClient = null;

  if (databaseConnection === null) {
    return;
  }

  databaseConnection.close();
  databaseConnection = null;
};

export const startDatabase = (): DatabaseStartupResult => {
  if (databaseClient !== null) {
    return Result.ok();
  }

  const databasePath = getDatabasePath();
  const directoryResult = Result.try({
    catch: (cause) => new DatabaseError({ cause, reason: "create-directory" }),
    try: () => mkdirSync(dirname(databasePath), { recursive: true }),
  });

  if (!Result.isOk(directoryResult)) {
    return directoryResult;
  }

  const databaseResult = Result.try({
    catch: (cause) => new DatabaseError({ cause, reason: "open" }),
    try: () => {
      const connection = openDatabaseConnection(databasePath);
      const client = createDatabaseClient(connection);

      return { client, connection };
    },
  });

  if (!Result.isOk(databaseResult)) {
    return databaseResult;
  }

  const { client, connection } = databaseResult.value;

  const migrationResult = Result.try({
    catch: (cause) => new DatabaseError({ cause, reason: "migrate" }),
    try: () => {
      applyDatabaseMigrations(client, getMigrationsFolder());
    },
  });

  if (!Result.isOk(migrationResult)) {
    closeCurrentConnection();
    connection.close();
    return migrationResult;
  }

  databaseConnection = connection;
  databaseClient = client;

  return Result.ok();
};

export const getDatabaseClient = (): ResultType<DatabaseClient, DatabaseError> => {
  if (databaseClient === null) {
    return Result.err(new DatabaseError({ reason: "not-ready" }));
  }

  return Result.ok(databaseClient);
};

export const closeDatabase = (): void => {
  closeCurrentConnection();
};
