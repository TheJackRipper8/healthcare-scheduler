import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "better-sqlite3";

// reads the .env file in backend
// puts variables such as PORT and SQLITE_PATH in .env

dotenv.config();

// Create Express server (backend instance)
const app = express();
// Allows front end to call backend
app.use(cors());
// Allows server to read JSON bodies
app.use(express.json());

// Initialize DB_PATH as in env or manual 
const DB_PATH = process.env.SQLITE_PATH || "./database.sqlite";
// Create a databsae object
const db = new Database(DB_PATH);
// Sets PORT to that in .env or manual
const PORT = process.env.PORT || 3000;
// App starts listening to requests as PORT (handles request to server and database)
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
// Create the SQLITE3 database 
db.exec(`

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- PRIMARY KEY, user id
  role TEXT NOT NULL CHECK (role IN ('patient', 'provider', 'staff')), -- roles used in access controls
  name TEXT NOT NULL, -- first name + last name for staff, providers, patients
  email TEXT NOT NULL UNIQUE, -- Email address of respective roles
  password_hash TEXT, -- password hash for patients, providers, and staff
  specialty TEXT  -- used for providers only
);

CREATE TABLE IF NOT EXISTS clinics (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- PRIMARY KEY for clinics
  name TEXT NOT NULL, -- clinic name
  address TEXT -- adderss of clinic
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- PRIMARY KEY or ID for availability time block
  provider_id INTEGER NOT NULL, -- provider for a given time block
  clinic_id INTEGER NOT NULL, -- clinic for a given time block
  date TEXT NOT NULL,  -- date for a given time block
  start_time TEXT NOT NULL,   -- start time for a given time block
  end_time TEXT NOT NULL,     -- end time for a given time blcok
  FOREIGN KEY (provider_id) REFERENCES users(id), -- provider_id FOREIGN KEY to users ID
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) -- clinic ID FOREIGN KEY to clinics ID
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- appointment ID
  patient_id INTEGER NOT NULL, -- patient for a given appointment
  provider_id INTEGER NOT NULL, -- provider for a given appointment
  clinic_id INTEGER NOT NULL, -- clinic for a given appointment
  date TEXT NOT NULL,         -- date for a given appointment
  start_time TEXT NOT NULL,   -- start time for a given appointment
  end_time TEXT NOT NULL,     -- end time for a given appointment
  type TEXT NOT NULL,         -- appointment type (like checkup)
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'cancelled', 'completed', 'no_show')), -- status of current appointment
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), -- time when appointment was created
  FOREIGN KEY (patient_id) REFERENCES users(id), -- patient_ID relates to users id
  FOREIGN KEY (provider_id) REFERENCES users(id), -- provider_ID relates to users id
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) -- clinic id relates to clinics ID
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_provider_slot
ON appointments(provider_id, date, start_time)
WHERE status = 'scheduled';

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- message id
  patient_id INTEGER NOT NULL, -- patient to whom message belongs
  staff_id INTEGER, -- the staff who sent the message
  message TEXT NOT NULL, -- the message content
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'seen', 'resolved')), -- status of message
  created_at TEXT NOT NULL DEFAULT (datetime('now')), -- time the message was sent
  FOREIGN KEY (patient_id) REFERENCES users(id), -- patient_id relates users id
  FOREIGN KEY (staff_id) REFERENCES users(id) -- staff_id relates to users id
);
`);


