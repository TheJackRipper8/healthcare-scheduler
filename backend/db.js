import Database from "better-sqlite3";

const dbPath = process.env.SQLITE_PATH || "./database.sqlite";
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  date TEXT NOT NULL,     -- "YYYY-MM-DD"
  time TEXT NOT NULL,     -- "HH:MM"
  clinic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
);
`);

export default db;
