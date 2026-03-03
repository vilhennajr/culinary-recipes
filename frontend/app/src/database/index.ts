import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let openPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  if (openPromise) return openPromise;

  openPromise = (async () => {
    const database = await SQLite.openDatabaseAsync('culinary.db');
    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY NOT NULL,
      login       TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      name        TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id                         TEXT PRIMARY KEY NOT NULL,
      user_id                    TEXT NOT NULL,
      category_id                TEXT,
      name                       TEXT,
      preparation_time_minutes   INTEGER,
      servings                   INTEGER,
      preparation_method         TEXT NOT NULL,
      ingredients                TEXT,
      created_at                 TEXT NOT NULL,
      updated_at                 TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes (user_id);
    `);
    db = database;
    return database;
  })();

  return openPromise;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
