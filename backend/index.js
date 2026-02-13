import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = process.env.SQLITE_PATH || "./database.sqlite";
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  date TEXT NOT NULL,   -- YYYY-MM-DD
  time TEXT NOT NULL,   -- HH:MM (or 10:00 AM, your choice)
  clinic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  clinic TEXT NOT NULL
);
`);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
