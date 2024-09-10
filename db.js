import { Database } from "bun:sqlite";

// Initialize the database
const db = new Database("mydb.sqlite");

// Create a table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`);

export { db };
