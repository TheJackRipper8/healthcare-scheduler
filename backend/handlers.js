
import bcrypt from "bcrypt";
import db from "./db.js";


// The index.js has api endpoints that the front end can use to contact the backend
// and interact with the SQLITE3 database
// When an endpoint is called in index.js is called,it reidrects to a handler
// The handlers are stored in this file (handlers.js)
// The handlers form the core backend of implementing core login that interacts
// with front end, back end, database, and authentication, and access controls


const handlers = {};

// Function handling login by staff, patients, and providers

export async function login(req, res) {
  const { email, password } = req.body;

  const user = db.prepare(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = ?"
  ).get(email);

  if (!user) 
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) 
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };

  return res.json({ ok: true, user: req.session.user });
}

// Handler called when endpoint is called for login
// Handles login 
handlers.login = async function loginHandler(req, res) {
  try {

    return res.json({ ok: true, token: "token-placeholder", user: { id: 1, name: "Demo" } });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js for book appointments
// Responsible for booking appointments by staff or patients
handlers.bookAppointment = async function bookAppointment(req, res) {
  try {

    return res.json({ ok: true, id:  123 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when canceling appointments
// Responisble for canceling appointments by staff or patients
handlers.cancelAppointment = async function cancelAppointment(req, res) {
  try {
    const id = Number(req.params.id);
    return res.json({ ok: true, changed:  1 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when sending notifications
// Responsible for sending notifications by staff -> patient or provider -> staff
handlers.sendNotification = async function sendNotification(req, res) {
  try {
    const { appointment_id, user_id, email, message, method } = req.body;
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when getting daily appointments
// Responsible for gettig daily appointments used by staff and providers
handlers.getDailyAppointments = async function getDailyAppointments(req, res) {
  try {

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when getting weekly appointments
// Responsible for getting weekly appointments used by staff and provdiers
handlers.getWeeklyAppointments = async function getWeeklyAppointments(req, res) {
  try {
    const start = req.query.start; 
    const providerId = req.query.provider_id;

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when getting upcoming appointments
// Responsible for getting upcoming appointments for patient
handlers.getUpcomingAppointments = async function getUpcomingAppointments(req, res) {
  try {
    const patientEmail = req.query.patient_email;
    const limit = Number(req.query.limit || 50);

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when getting past appointments
// Responsible for retrieving past appointments froma user
handlers.getPastAppointments = async function getPastAppointments(req, res) {
  try {
    const patientEmail = req.query.patient_email;
    const limit = Number(req.query.limit || 50);

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js retrieving notifications
// Responsible for retrieving notifications for patients and staff
handlers.getNotifications = async function getNotifications(req, res) {
  try {
    const userId = req.query.user_id;
    const patientEmail = req.query.patient_email;

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

// Handler called when endpoint is called in index.js when marking notifications
// Responsible for marking notification rend by staff or patient
handlers.markNotificationRead = async function markNotificationRead(req, res) {
  try {
    const id = Number(req.params.id);

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

export default handlers;
