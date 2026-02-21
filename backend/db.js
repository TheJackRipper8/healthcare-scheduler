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

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'provider', 'staff')),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT, 
  specialty TEXT      
);

CREATE TABLE IF NOT EXISTS clinics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  date TEXT NOT NULL,         
  start_time TEXT NOT NULL,   
  end_time TEXT NOT NULL,     
  FOREIGN KEY (provider_id) REFERENCES users(id),
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  date TEXT NOT NULL,         
  start_time TEXT NOT NULL,   
  end_time TEXT NOT NULL,     
  type TEXT NOT NULL,         
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES users(id),
  FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_provider_slot
ON appointments(provider_id, date, start_time)
WHERE status = 'scheduled';

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  staff_id INTEGER,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'seen', 'resolved')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);
`);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
